module Foliage.Interpretation
  ( interpProgram
  , Log(..)
  , Exc(..)
  , Env(..)
  , LogMessage(..)
  ) where

import Prelude
import Foliage.Program
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (ExceptT, runExceptT, throwError)
import Control.Monad.Reader (class MonadReader, ask, runReaderT)
import Control.Monad.State (class MonadState, get, modify, modify_, runStateT)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (class MonadWriter, tell)
import Data.Array as Array
import Data.Bifunctor (lmap, rmap)
import Data.Either (Either(..), either)
import Data.Generic.Rep (class Generic)
import Data.Int as Int
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Data.Traversable (traverse, traverse_)
import Data.Tuple (fst)
import Data.Tuple.Nested (type (/\), (/\))
import Debug as Debug
import Type.Proxy (Proxy(..))
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Constants
--------------------------------------------------------------------------------
initialGas :: Int
initialGas = 100

--------------------------------------------------------------------------------
-- Types
--------------------------------------------------------------------------------
newtype Ctx
  = Ctx
  { modules :: Map Name Module
  , focusModule :: Module
  -- external function name => external function
  , externalFunctions :: Map String (Map String Term -> Either String Term)
  -- external lattice type name => comparison function over that lattice type
  , externalCompares :: Map String (String -> String -> Either String Ordering)
  }

derive instance _Newtype_Ctx :: Newtype Ctx _

newtype Env
  = Env
  { gas :: Int
  , rules :: List Rule
  , ripe_rules :: Map Name (List RipeRule)
  , known_props :: List Prop
  , active_props :: List { prop :: Prop, isNew :: Boolean }
  }

derive instance _Newtype_Env :: Newtype Env _

newtype Exc (label :: Symbol)
  = Exc
  { label :: Proxy label
  , source :: String
  , description :: String
  }

_apply_rule = Proxy :: Proxy "apply rule"

_error = Proxy :: Proxy "error"

derive instance _Newtype_Exc :: Newtype (Exc label) _

derive newtype instance _Eq_Exc :: Eq (Exc label)

instance _Show_Exc :: IsSymbol label => Show (Exc label) where
  show (Exc { label, source, description }) = "[exc . " <> reflectSymbol label <> "] " <> source <> ": " <> description

newtype Log
  = Log
  { label :: String
  , messages :: Array LogMessage
  }

derive instance _Newtype_Log :: Newtype Log _

instance _Show_Log :: Show Log where
  show (Log log) = "[" <> log.label <> "] " <> ((log.messages <#> show) # Array.intercalate "  ")

data LogMessage
  = StringLogMessage String
  | RuleLogMessage String Rule
  | RipeRuleLogMessage String RipeRule
  | PropLogMessage String Prop
  | TermLogMessage String Term
  | LatticeTypeLogMessage String LatticeType

derive instance _Generic_LogMessage :: Generic LogMessage _

instance _Show_LogMessage :: Show LogMessage where
  show = genericShow

--------------------------------------------------------------------------------
-- Endpoints
--------------------------------------------------------------------------------
interpProgram ::
  forall m.
  Monad m =>
  MonadWriter (Array Log) m =>
  MonadThrow (Exc "error") m =>
  Program -> m (Maybe (Exc "error") /\ Env)
interpProgram (Program prog) = do
  focusModule@(Module main) <- lookup "module Main" mainModuleName prog.modules
  Debug.traceM "[interpProgram]"
  let
    ctx =
      Ctx
        { modules: prog.modules
        , focusModule
        , externalFunctions
        , externalCompares
        }

    env =
      let
        rules /\ active_props =
          main.rules # Map.values
            # partitionEither
                ( \rule ->
                    rule
                      # nextHypothesis
                      # case _ of
                          Left conclusion -> Right { prop: conclusion, isNew: true }
                          Right _ -> Left rule
                )

        ripe_rules /\ _active_props =
          main.rules # Map.values
            # partitionEither
                ( \rule ->
                    rule
                      # nextHypothesis
                      # case _ of
                          Left conclusion -> Right { prop: conclusion, isNew: true }
                          Right { hypothesis: hypothesis@(Hypothesis (Prop prop_name _) _), rule' } -> Left (Map.singleton prop_name (List.singleton { hypothesis, rule' }))
                )
            # lmap List.fold
      in
        Env
          { gas: initialGas
          , rules
          , ripe_rules
          , known_props: Nil
          , active_props
          }
  err_or_unit /\ env' <-
    fixpointFocusModule
      # runExceptT
      # flip runReaderT ctx
      # flip runStateT env
  pure ((err_or_unit # either Just (const Nothing)) /\ env')

externalFunctions :: Map String (Map String Term -> Either String Term)
externalFunctions =
  Map.fromFoldable
    [ let
        f = "addWeight"
      in
        f
          /\ \args -> do
              w1 <- let x = "w1" in args # getArg { f, x } (validateInt { f, x })
              w2 <- let x = "w2" in args # getArg { f, x } (validateInt { f, x })
              let
                w = w1 + w2
              pure (LiteralTerm (Int.toStringAs Int.decimal w) intDataType)
    ]
  where
  getArg :: forall r a. { f :: String, x :: String | r } -> (Term -> Either String a) -> _ -> Either String a
  getArg { f, x } validate args =
    Map.lookup x args
      # maybe (throwExternalFunctionCallError f $ "no argument " <> show x) pure
      # bindFlipped validate

  validateInt :: forall r. { f :: String, x :: String | r } -> Term -> Either String Int
  validateInt { f, x } = case _ of
    LiteralTerm s dty
      | dty == intDataType -> s # Int.fromString # maybe (throwExternalFunctionCallError f $ s <> " is not an Int") pure
    t -> throwExternalFunctionCallError f $ "expected arg " <> x <> " = " <> show t <> " to be an Int"

  throwExternalFunctionCallError :: forall a. String -> String -> Either String a
  throwExternalFunctionCallError f msg = throwError $ "when calling external function " <> f <> ", " <> msg

externalCompares :: Map String (String -> String -> Either String Ordering)
externalCompares =
  Map.fromFoldable
    [ "Int"
        /\ \x y -> do
            x :: Int <- Int.fromString x # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show x <> " to be a literal integer") pure
            y :: Int <- Int.fromString y # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show y <> " to be a literal integer") pure
            pure (compare x y)
    ]

intDataType :: DataType
intDataType = NamedDataType (Name "Int")

--------------------------------------------------------------------------------
-- Implementation
--------------------------------------------------------------------------------
fixpointFocusModule ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  m Unit
fixpointFocusModule = do
  Env env <- modify \(Env env) -> (Env env { gas = env.gas - 1 })
  when (env.gas <= 0) do
    tell [ Log { label: "error", messages: [ "out of gas" # StringLogMessage, show { initialGas } # StringLogMessage ] } ]
    throwError (Exc { label: _error, source: "fixpointFocusModule", description: "ran out of gas" })
  case env.active_props of
    Nil -> pure unit
    Cons active_prop active_props -> do
      modify_ \(Env env') -> (Env env' { active_props = active_props })
      when active_prop.isNew do
        learnProp active_prop.prop
      resolveProp active_prop.prop
      fixpointFocusModule

learnProp ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  Prop -> m Unit
learnProp prop = do
  Env env <- get
  ignore_or_props <-
    env.known_props
      # List.foldM
          ( \known_props prop' -> do
              compareProp prop prop'
                # runExceptT
                # lift
                # bindFlipped case _ of
                    -- prop >< prop' ==> keep prop'
                    Left _ -> pure (prop' : known_props)
                    -- prop < prop' ==> prop is subsumed; keep prop'
                    Right (LT /\ _) -> throwError (Exc { label: Proxy :: Proxy "ignore prop", source: "learnProp", description: "learned prop is subsumed by known props" })
                    -- prop = prop' ==> prop is subsumed; keep prop'
                    Right (EQ /\ _) -> throwError (Exc { label: Proxy :: Proxy "ignore prop", source: "learnProp", description: "learned prop is subsumed by known props" })
                    -- prop > prop' ==> prop' is subsumed so drop prop'
                    Right (GT /\ _) -> pure known_props
          )
          Nil
      # runExceptT
  case ignore_or_props of
    Left (Exc exc) -> do
      tell [ Log { label: "ignore prop", messages: [ exc # show # StringLogMessage ] } ]
    Right known_props' -> do
      tell [ Log { label: "learn prop", messages: [ prop # PropLogMessage "prop" ] } ]
      modify_ \(Env env') -> Env env' { known_props = prop : known_props' }

resolveProp ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  Prop -> m Unit
resolveProp prop@(Prop prop_name _) = do
  tell [ Log { label: "resolve prop", messages: [ prop # PropLogMessage "prop" ] } ]
  Env env <- get
  -- rules that result from applying `prop` to a rule
  new_ripe_rules :: List RipeRule <-
    env.ripe_rules
      # Map.lookup prop_name
      # fromMaybe Nil
      # traverse
          ( \ripe_rule -> do
              (applyRipeRuleToProp ripe_rule prop # runExceptT)
                >>= case _ of
                    Left err -> do
                      tell [ Log { label: "resolve prop . apply rule . fail", messages: [ ripe_rule # RipeRuleLogMessage "ripe_rule", prop # PropLogMessage "prop", err # show # StringLogMessage ] } ]
                      pure Nil
                    Right rule' -> do
                      tell [ Log { label: "resolve prop . apply rule . pass", messages: [ prop # PropLogMessage "prop", ripe_rule # RipeRuleLogMessage "rule", rule' # RuleLogMessage "rule after subst" ] } ]
                      case nextHypothesis rule' of
                        Left conclusion -> do
                          -- doesn't have any more hypotheses, so just defer its conclusion
                          deferProp true conclusion
                          pure Nil
                        Right ripe_rule' -> do
                          pure (List.singleton ripe_rule')
          )
      # map List.fold
  -- modify_ (\(Env env') -> (Env env' { rules = new_ripe_rules <> env'.rules }))
  new_ripe_rules # traverse_ deferRipeRule
  pure unit

-- | Defers a `Prop` to be resolved later.
deferProp ::
  forall m.
  MonadState Env m =>
  MonadWriter (Array Log) m =>
  Boolean -> Prop -> m Unit
deferProp isNew prop = do
  tell [ Log { label: "defer prop", messages: [ prop # PropLogMessage "prop", { isNew } # show # StringLogMessage ] } ]
  modify_ \(Env env) -> Env env { active_props = List.snoc env.active_props { prop, isNew } }

-- | Defers a `Rule` by inserting it into `ripe_rules` and defering all known
-- | `Prop`s that can be applied to this rule, to be resolved later.
deferRipeRule ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  RipeRule -> m Unit
deferRipeRule ripe_rule@{ hypothesis: Hypothesis (Prop prop_name _) _ } = do
  tell [ Log { label: "defer rule", messages: [ ripe_rule # RipeRuleLogMessage "rule" ] } ]
  modify_ \(Env env) -> Env env { ripe_rules = env.ripe_rules # Map.insertWith append prop_name (List.singleton ripe_rule) }
  Env env <- get
  props <-
    env.known_props
      # List.filterM
          ( \prop ->
              applyRipeRuleToProp ripe_rule prop
                # runExceptT
                # map (either (const false) (const true))
          )
  props # traverse_ (deferProp false)

applyRipeRuleToProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  RipeRule -> Prop -> ExceptT (Exc "apply rule") m Rule
applyRipeRuleToProp ripe_rule@{ hypothesis: Hypothesis hyp_prop hyp_sides } prop = do
  tell [ Log { label: "applyRipeRuleToProp", messages: [ ripe_rule # RipeRuleLogMessage "ripe rule", prop # PropLogMessage "prop" ] } ]
  -- first, check if prop satisfies hypothesis_prop
  sigma <-
    compareProp hyp_prop prop
      >>= case _ of
          LT /\ sigma -> pure sigma
          EQ /\ sigma -> pure sigma
          _ -> throwError (Exc { label: _apply_rule, source: "applyRipeRuleToProp", description: show hyp_prop <> " < " <> show prop })
  let
    rule' = ripe_rule.rule' # substRule sigma

    hyp_sides' = hyp_sides <#> substSideHypothesis sigma
  tell [ Log { label: "applyRipeRuleToProp", messages: [ rule' # RuleLogMessage "rule'" ] } ]
  -- second, check if the side hypotheses hold
  processSideHypotheses rule' hyp_sides'

processSideHypotheses ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  Rule -> Array SideHypothesis -> ExceptT (Exc "apply rule") m Rule
processSideHypotheses rule sides =
  Array.foldr
    (\side m_rule -> m_rule >>= \rule' -> processSideHypothesis rule' side)
    (pure rule)
    sides

processSideHypothesis ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  Rule -> SideHypothesis -> ExceptT (Exc "apply rule") m Rule
processSideHypothesis rule = case _ of
  FunctionSideHypothesis side -> do
    Ctx { focusModule, externalFunctions } <- ask
    functionDef <-
      focusModule
        # lookupModule (Proxy :: Proxy "functionDefs") side.functionName
        # maybe (lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "could not function definition of the name " <> show side.functionName })) pure
    result <- case functionDef of
      ExternalFunctionDef externalFunctionDef -> do
        function <- case Map.lookup externalFunctionDef.name externalFunctions of
          Nothing -> lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "cound not find function of the name " <> show externalFunctionDef.name })
          Just function -> pure function
        args <- side.args # traverse (evaluateTerm >>> lift)
        result <-
          function (Array.zip externalFunctionDef.inputs args # map (lmap fst) # Map.fromFoldable)
            # either (\err -> lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "error in function " <> show externalFunctionDef.name <> ": " <> err })) pure
        pure result
    rule # substRule (Map.singleton side.resultVarName result) # pure

--------------------------------------------------------------------------------
-- Utilities
--------------------------------------------------------------------------------
evaluateTerm ::
  forall m y.
  MonadThrow (Exc "error") m =>
  TermF Name -> m (TermF y)
evaluateTerm = traverse \x -> throwError (Exc { label: _error, source: "evaluateTerm", description: "expected term to be a value, but found a variable " <> show x })

compareProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  Prop -> Prop -> ExceptT (Exc "apply rule") m LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) = do
  unless (p1 == p2) (throwError (Exc { label: _apply_rule, source: "compareProp", description: show p1 <> " != " <> show p2 }))
  Ctx { focusModule: Module { relations } } <- ask
  domain <- case Map.lookup p1 relations of
    Nothing -> throwError (Exc { label: _apply_rule, source: "compareProp", description: "could not find relation " <> show (show p1) })
    Just (Relation { domain }) -> pure domain
  compareTerm domain t1 t2

-- | Assumes that terms to have the same type type.
compareTerm ::
  forall m.
  MonadThrow (Exc "error") m =>
  MonadReader Ctx m =>
  MonadWriter (Array Log) m =>
  LatticeType -> Term -> Term -> ExceptT (Exc "apply rule") m LatticeOrdering
compareTerm _lty (VarTerm x1) (VarTerm x2) =
  EQ
    /\ ( Map.fromFoldable
          [ x1 /\ VarTerm (freshName unit)
          , x2 /\ VarTerm (freshName unit)
          ]
      )
    # pure

compareTerm _lty t1 (VarTerm x2) = EQ /\ (Map.singleton x2 t1) # pure

compareTerm _lty (VarTerm x1) t2 = EQ /\ (Map.singleton x1 t2) # pure

compareTerm lty@(NamedLatticeType x) t1 t2 = do
  Ctx { focusModule } <- ask
  case lookupModule (Proxy :: Proxy "latticeTypeDefs") x focusModule of
    Nothing -> throwError (Exc { label: _apply_rule, source: "comapreTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find lattice type definition with name " <> show x })
    Just latticeTypeDef -> case latticeTypeDef of
      LatticeTypeDef lty -> compareTerm lty t1 t2
      ExternalLatticeTypeDef latticeTypeDef -> do
        Ctx { externalCompares } <- ask
        case Map.lookup latticeTypeDef.name externalCompares of
          Nothing -> throwError (Exc { label: _apply_rule, source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find compare function for external lattice type " <> show latticeTypeDef.name })
          Just compare -> case t1 /\ t2 of
            LiteralTerm s1 _ /\ LiteralTerm s2 _ -> case compare s1 s2 of
              Left description -> throwError (Exc { label: _apply_rule, source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description })
              Right o -> o /\ Map.empty # pure
            _ -> lift $ throwError (Exc { label: _error, source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "terms of an external lattice type are not literals" })

compareTerm lty@UnitLatticeType t1 t2 = case t1 /\ t2 of
  UnitTerm /\ UnitTerm -> EQ /\ Map.empty # pure
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftGreaterThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftIncomparableRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> throwError_compareTerm lty t1 t2
  RightTerm t1 /\ LeftTerm t2 -> throwError_compareTerm lty t1 t2
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftEqualRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

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
  _ -> lift $ throwError (Exc { label: _error, source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SetLatticeType _ lty_elem) t1 t2 = Unsafe.todo "compareTerm SetLatticeType"

compareTerm (OppositeLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ sigma -> GT /\ sigma # pure
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ sigma -> GT /\ sigma # pure

compareTerm (DiscreteLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ _sigma -> throwError_compareTerm (DiscreteLatticeType lty) t1 t2
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ _sigma -> throwError_compareTerm (DiscreteLatticeType lty) t1 t2

compareTerm (PowerLatticeType lty) t1 t2 = Unsafe.todo "compareTerm PowerLatticeType"

throwError_compareTerm :: forall m a. MonadThrow (Exc "apply rule") m => LatticeType -> Term -> Term -> m a
throwError_compareTerm lty t1 t2 =
  throwError
    ( Exc
        { label: _apply_rule
        , source: "compareTerm"
        , description: "in lattice " <> show lty <> ", " <> show t1 <> " !<= " <> show t2
        }
    )

lookup :: forall m56 a57 a60. Ord a60 => MonadThrow (Exc "error") m56 => Show a60 => String -> a60 -> Map a60 a57 -> m56 a57
lookup label x m = case Map.lookup x m of
  Nothing -> throwError (Exc { label: _error, source: "lookup", description: label <> " not found: " <> show x })
  Just a -> pure a

partitionEither :: forall a b c. (a -> Either b c) -> List a -> (List b /\ List c)
partitionEither p xs = List.foldr select (Nil /\ Nil) xs
  where
  select a (bs /\ cs) = case p a of
    Left b -> (b : bs) /\ cs
    Right c -> bs /\ (c : cs)
