module Foliage.InterpretationOld (interpProgram, Log(..), Err(..)) where

import Foliage.Program
import Prelude

import Control.Monad.Error.Class (class MonadThrow, throwError)
import Control.Monad.Except (throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadAsk, class MonadReader, ask, runReaderT)
import Control.Monad.State (class MonadState, execStateT, get, modify, modify_)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (class MonadTell, class MonadWriter, tell)
import Control.MonadPlus (class MonadPlus)
import Control.Plus (empty)
import Data.Array as Array
import Data.Bifunctor (lmap, rmap)
import Data.Either (Either(..), either, fromRight, isLeft)
import Data.Generic.Rep (class Generic)
import Data.Int as Int
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype, over)
import Data.Newtype as Newtype
import Data.Show.Generic (genericShow)
import Data.String.CodeUnits (fromCharArray)
import Data.Traversable (class Traversable, traverse, traverse_)
import Data.Tuple (fst)
import Data.Tuple.Nested ((/\))
import Debug as Debug
import Effect.Class (class MonadEffect)
import Effect.Class.Console as Console
import Partial.Unsafe (unsafeCrashWith)
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe
import Unsafe.Coerce (unsafeCoerce)

initialGas :: Int
initialGas = 100

newtype Ctx
  = Ctx
  { modules :: Map Name Module
  , focusModule :: Module
  , rules :: Array Rule
  -- external function name => external function
  , externalFunctions :: Map String (Map String Term -> Either String Term)
  -- external lattice type name => comparison function over that lattice type
  , externalCompares :: Map String (String -> String -> Either String Ordering)
  }

derive instance _Newtype_Ctx :: Newtype Ctx _

newtype Env
  = Env
  { active_rules :: List Rule
  , props :: List Prop
  , gas :: Int
  }

derive instance _Newtype_Env :: Newtype Env _

newtype Err
  = Err
  { source :: String
  , description :: String
  }

derive instance _Newtype_Err :: Newtype Err _

derive newtype instance _Eq_Err :: Eq Err

instance _Show_Err :: Show Err where
  show (Err { source, description }) =
    Array.intercalate "\n"
      [ sep, "[ERROR]", "source: " <> source, "", description, sep ]
    where
    sep = '=' # Array.replicate 20 # fromCharArray

data Log
  = LearnPropLog Prop
  | IgnorePropLog Prop
  | EnqueueRuleLog Rule
  | DequeueRuleLog Rule
  | StringLog String

derive instance _Generic_Log :: Generic Log _

instance _Show_Log :: Show Log where
  show = genericShow

-- TODO: actually this should _merge_ with active_rules, so that only
-- non-subsumed rules exist in the resulting active_rules
enqueue_active_rule = enqueue_active_rules <<< List.singleton

enqueue_active_rules rules = do
  rules # traverse_ \rule -> tell [ EnqueueRuleLog rule ]
  modify_ (Newtype.over Env (Record.modify (Proxy :: Proxy "active_rules") (rules <> _)))

dequeue_active_rule = do
  Env { active_rules } <- get
  case active_rules of
    Nil -> pure Nothing
    active_rule : active_rules -> do
      tell [ DequeueRuleLog active_rule ]
      modify_ (Newtype.over Env _ { active_rules = active_rules })
      pure (Just active_rule)

--------------------------------------------------------------------------------
-- interpretation endpoint
--------------------------------------------------------------------------------
externalCompares :: Map String (String -> String -> Either String Ordering)
externalCompares =
  Map.fromFoldable
    [ "Int"
        /\ \x y -> do
            x :: Int <- Int.fromString x # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show x <> " to be a literal integer") pure
            y :: Int <- Int.fromString y # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show y <> " to be a literal integer") pure
            pure (compare x y)
    ]

interpProgram :: forall m. MonadWriter (Array Log) m => MonadThrow Err m => MonadEffect m => Program -> m (List Prop)
interpProgram (Program prog) = do
  Module main <- lookup "module Main" mainModuleName prog.modules
  let
    ctx =
      Ctx
        { modules: prog.modules
        , focusModule: Module main
        , rules: main.rules # Map.values # Array.fromFoldable
        , externalFunctions: Map.empty -- TODO: external functions
        , externalCompares
        }

    env =
      -- initialize rules with only rules that have no hypotheses
      Env
        { active_rules: main.rules # Map.values # List.filter (nextHypothesis >>> isLeft)
        , props: Nil
        , gas: initialGas
        }
  Env env <-
    interpFocusModule
      # flip runReaderT ctx
      # flip execStateT env
  pure env.props

--------------------------------------------------------------------------------
-- interpretation internals
--------------------------------------------------------------------------------
-- | Interpret the focus module by computing the fixpoint of its rules.
interpFocusModule :: forall m. MonadWriter (Array Log) m => MonadAsk Ctx m => MonadState Env m => MonadThrow Err m => MonadEffect m => m Unit
interpFocusModule = do
  fixpointFocusModule
  pure unit

fixpointFocusModule :: forall m. MonadWriter (Array Log) m => MonadAsk Ctx m => MonadState Env m => MonadThrow Err m => MonadEffect m => m Unit
fixpointFocusModule =
  execMaybeT do
    modify (over Env \state -> state { gas = state.gas - 1 })
      >>= \(Env state) ->
          when (state.gas <= 0) do
            throwError (Err { source: "fixpointFocusModule", description: "ran out of gas" })
    active_rule <- dequeue_active_rule # fromJustT
    fixpointFocusModule_loop active_rule
    fixpointFocusModule

processSideHypotheses sides rule = Array.foldr (\side m_rule -> m_rule >>= \rule -> processSideHypothesis rule side) (pure rule) sides
  where
  processSideHypothesis rule = case _ of
    FunctionSideHypothesis side -> do
      Ctx { focusModule, externalFunctions } <- ask
      functionDef <-
        focusModule
          # lookupModule (Proxy :: Proxy "functionDefs") side.functionName
          # maybe (throwError (Err { source: "processSideHypothesis", description: "could not function definition of the name " <> show side.functionName })) pure
      result <- case functionDef of
        ExternalFunctionDef functionDef -> case Map.lookup functionDef.name externalFunctions of
          Nothing -> throwError (Err { source: "processSideHypothesis", description: "cound not find function of the name " <> show functionDef.name })
          Just function -> do
            args <- side.args # traverse evaluateTerm
            result <-
              function (Array.zip functionDef.inputs args # map (lmap fst) # Map.fromFoldable)
                # either (\err -> throwError (Err { source: "processSideHypothesis", description: "error in function " <> show functionDef.name <> ": " <> err })) pure
            pure result
      substRule (Map.singleton side.resultVarName result) rule # pure

evaluateTerm ::
  forall m x y.
  Traversable TermF =>
  MonadThrow Err m =>
  Show x =>
  TermF x ->
  m (TermF y)
evaluateTerm = traverse \x -> throwError (Err { source: "evaluateTerm", description: "expected term to be a value, but found a variable " <> show x })

fixpointFocusModule_loop ::
  forall m.
  MonadState Env m =>
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  MonadTell (Array Log) m =>
  MonadEffect m =>
  Rule -> m Unit
fixpointFocusModule_loop (Rule { hypotheses, conclusion }) = case hypotheses of
  Nil -> learnProp conclusion
  hypothesis : hypotheses -> case hypothesis of
    Hypothesis hypothesis sides -> do
      -- Debug.traceM $ "fixpointFocusModule_loop.hypothesis: " <> show hypothesis
      deriveProp hypothesis
        >>= traverse_ \{ sigma } -> do
            -- Debug.traceM $ "fixpointFocusModule_loop.before: " <> show (Rule { hypotheses, conclusion })
            sides <- sides <#> substSideHypothesis sigma # pure
            rule <- Rule { hypotheses, conclusion } # substRule sigma # pure
            rule <- processSideHypotheses sides rule
            -- Debug.traceM $ "fixpointFocusModule_loop.after: " <> show rule
            enqueue_active_rule rule

applyRuleToProp ::
  forall m.
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  MonadPlus m =>
  MonadTell (Array Log) m =>
  Rule -> PropF Name -> m Rule
applyRuleToProp rule@(Rule { hypotheses, conclusion }) prop = do
  -- Debug.traceM $ "trying to apply rule " <> show rule <> " to prop " <> show prop
  case hypotheses of
    Nil -> empty
    hypothesis : hypotheses -> case hypothesis of
      Hypothesis hypothesis sides ->
        compareProp hypothesis prop
          >>= case _ of
              LT /\ sigma -> do
                -- Debug.traceM $ "success; sigma = " <> show sigma
                Rule { hypotheses, conclusion } # substRule sigma # pure
              EQ /\ sigma -> do
                -- Debug.traceM $ "success; sigma = " <> show sigma
                Rule { hypotheses, conclusion } # substRule sigma # pure
              _ -> empty

deriveProp ::
  forall m.
  MonadState Env m =>
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  Prop ->
  m
    ( List
        { prop :: Prop
        , sigma :: Map Name (TermF Name)
        }
    )
deriveProp prop = do
  Debug.traceM $ "deriveProp " <> show prop
  -- look in `props` for any props that can satisfy `hypothesis`
  Env { props } <- get
  props
    # List.foldM
        ( \results prop' -> do
            Debug.traceM $ "trying " <> show prop'
            (compareProp prop prop' # runMaybeT)
              <#> case _ of
                  Just (LT /\ sigma) -> do 
                    Debug.traceM $ "success!" <> show prop'
                    { prop: prop', sigma } : results
                  _ -> results
        )
        Nil

learnProp ::
  forall m.
  MonadState Env m =>
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  MonadTell (Array Log) m =>
  Prop -> m Unit
learnProp prop = do
  Env { props } <- get
  keep_prop /\ props <-
    props
      # List.foldM
          ( \(keep_prop /\ props) prop' ->
              (compareProp prop prop' # runMaybeT)
                <#> case _ of
                    -- prop >< prop' ==> keep prop'
                    Nothing -> (keep_prop /\ prop' : props)
                    -- prop < prop' ==> prop is subsumed; keep prop'
                    Just (LT /\ _) -> (false /\ prop' : props)
                    -- prop = prop' ==> prop is subsumed; keep prop'
                    Just (EQ /\ _) -> (false /\ prop' : props)
                    -- prop > prop' ==> prop' is subsumed so drop prop'
                    Just (GT /\ _) -> (keep_prop /\ props)
          )
          (true /\ Nil)
  if keep_prop then do
    tell [ LearnPropLog prop ]
    modify_ (Newtype.over Env _ { props = prop : props })
    -- activate any rules that can be applied to `prop`
    Ctx { rules } <- ask
    new_active_rules <-
      rules
        # traverse
            ( \rule ->
                (applyRuleToProp rule prop # runMaybeT)
                  <#> maybe Nil List.singleton
            )
        # map List.fold
    enqueue_active_rules new_active_rules
  else do
    tell [ IgnorePropLog prop ]

compareProp ::
  forall m.
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  MonadPlus m =>
  Prop ->
  Prop ->
  m LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) = do
  unless (p1 == p2) empty
  Ctx { focusModule: Module { relations } } <- ask
  domain <- case Map.lookup p1 relations of
    Nothing -> throwError (Err { source: "compareProp", description: "could not find relation " <> show (show p1) })
    Just (Relation { domain }) -> pure domain
  compareTerm domain t1 t2

-- | Requires the terms to have the same type type.
compareTerm ::
  forall m.
  MonadThrow Err m =>
  MonadAsk Ctx m =>
  MonadPlus m =>
  LatticeType -> Term -> Term -> m LatticeOrdering
compareTerm _lty (VarTerm x1) (VarTerm x2) =
  EQ
    /\ ( Map.fromFoldable
          [ x1 /\ VarTerm (freshName unit)
          , x2 /\ VarTerm (freshName unit)
          ]
      )
    # pure

compareTerm _lty (VarTerm x1) t2 = EQ /\ (Map.singleton x1 t2) # pure

compareTerm _lty t1 (VarTerm x2) = EQ /\ (Map.singleton x2 t1) # pure

compareTerm lty@(NamedLatticeType x) t1 t2 = do
  Ctx { focusModule } <- ask
  case lookupModule (Proxy :: Proxy "latticeTypeDefs") x focusModule of
    Nothing -> throwError (Err { source: "comapreTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find lattice type definition with name " <> show x })
    Just latticeTypeDef -> case latticeTypeDef of
      LatticeTypeDef lty -> compareTerm lty t1 t2
      ExternalLatticeTypeDef latticeTypeDef -> do
        Ctx { externalCompares } <- ask
        case Map.lookup latticeTypeDef.name externalCompares of
          Nothing -> throwError (Err { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find compare function for external lattice type " <> show latticeTypeDef.name })
          Just compare -> case t1 /\ t2 of
            LiteralTerm s1 _ /\ LiteralTerm s2 _ -> case compare s1 s2 of
              Left description -> throwError (Err { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description })
              Right o -> o /\ Map.empty # pure
            _ -> throwError (Err { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "terms of an external lattice type are not literals" })

compareTerm lty@UnitLatticeType t1 t2 = case t1 /\ t2 of
  UnitTerm /\ UnitTerm -> EQ /\ Map.empty # pure
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftGreaterThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftIncomparableRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> empty
  RightTerm t1 /\ LeftTerm t2 -> empty
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftEqualRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering lty_1 lty_2) t1 t2 = case t1 /\ t2 of
  PairTerm t1_1 t1_2 /\ PairTerm t2_1 t2_2 -> do
    -- Debug.traceM $ "compareTerm " <> show lty_1 <> " " <> show t1_1 <> " " <> show t2_1
    compareTerm lty_1 t1_1 t2_1
      >>= case _ of
          LT /\ sigma -> LT /\ sigma # pure
          EQ /\ sigma -> do
            t1_2 <- substTerm sigma t1_2 # pure
            t2_2 <- substTerm sigma t2_2 # pure
            compareTerm lty_2 t1_2 t2_2 # map (rmap (Map.union sigma))
          GT /\ sigma -> GT /\ sigma # pure
  _ -> throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SetLatticeType _ lty_elem) t1 t2 = Unsafe.todo "compareTerm SetLatticeType"

-- compareTerm lty (LiteralTerm s1 _) (LiteralTerm s2 _) = case compare s1 s2 of
--   LT -> LT /\Map.empty # pure
--   EQ -> EQ /\Map.empty # pure
--   GT -> GT /\ Map.empty # pure
compareTerm (OppositeLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ sigma -> GT /\ sigma # pure
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ sigma -> GT /\ sigma # pure

compareTerm (DiscreteLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ _sigma -> empty
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ _sigma -> empty

-- compareTerm lty t1 t2 = unsafeCrashWith $ "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2
compareTerm (PowerLatticeType lty) t1 t2 = Unsafe.todo "compareTerm PowerLatticeType"

assertConcreteProp :: forall m. MonadThrow Err m => Prop -> m ConcreteProp
assertConcreteProp prop = prop # traverse \x -> throwError (Err { source: "assertConcreteProp", description: "Expected to be a concrete proposition, but the variable " <> show (show x) <> " appeared in the prop " <> show (show prop) <> "." })

fromConcreteProp :: Prop -> Maybe ConcreteProp
fromConcreteProp prop = prop # traverse (const Nothing)

toAbstractProp :: forall x. ConcreteProp -> PropF x
toAbstractProp = unsafeCoerce -- this is equivalent to `map absurd`

--------------------------------------------------------------------------------
-- miscellaneous
--------------------------------------------------------------------------------
lookup label x m = case Map.lookup x m of
  Nothing -> throwError (Err { source: "lookup", description: label <> " not found: " <> show x })
  Just a -> pure a

fromJustT ::
  forall m a.
  MonadPlus m =>
  m (Maybe a) -> m a
fromJustT =
  ( _
      >>= case _ of
          Nothing -> empty
          Just a -> pure a
  )

execMaybeT :: forall a m. Functor m => MaybeT m a -> m Unit
execMaybeT = runMaybeT >>> void
