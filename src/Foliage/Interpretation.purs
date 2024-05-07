module Foliage.Interpretation where

import Foliage.Program
import Prelude
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (ExceptT(..), mapExceptT, runExcept, runExceptT, throwError)
import Control.Monad.Reader (class MonadReader, ask, runReaderT)
import Control.Monad.State (class MonadState, get, modify, modify_, runStateT)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (class MonadWriter)
import Control.Monad.Writer as Writer
import Data.Array as Array
import Data.Bifunctor (lmap, rmap)
import Data.Either (Either(..), either)
import Data.Lens (Getter', (^.))
import Data.Lens.Record as Lens.Record
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Traversable (traverse, traverse_)
import Data.Tuple (fst)
import Data.Tuple.Nested (type (/\), (/\))
import Debug as Debug
import Foliage.App.Rendering (Html, line, render)
import Foliage.Common (Exc(..), _apply_rule, _compare, _error, fromOpaque, map_Exc_label)
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Types
--------------------------------------------------------------------------------
newtype Ctx
  = Ctx
  { modules :: Map FixedName Module
  , focusModule :: Module
  }

derive instance _Newtype_Ctx :: Newtype Ctx _

newtype Env
  = Env
  { gas :: Int
  , ripe_rules :: Map FixedName (List RipeRule) -- prop name => ripe rules that have a head hypothesis of the prop name
  , known_props :: Map FixedName (List Prop) -- prop name => instance of prop
  , active_props :: List { prop :: Prop, isNew :: Boolean }
  }

derive instance _Newtype_Env :: Newtype Env _

data Log
  = Log
    { label :: String
    , messages :: Array (String /\ Html)
    }
    (Maybe Env)

tellLog ::
  forall m.
  MonadState Env m =>
  MonadWriter (Array Log) m =>
  { label :: String
  , messages :: Array (String /\ Html)
  } ->
  m Unit
tellLog r = do
  env <- get
  Writer.tell [ Log r (Just env) ]

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
        }

    env =
      let
        ripe_rules /\ active_props =
          main.rules # Map.values
            # partitionEither
                ( \rule ->
                    rule
                      # nextHypothesis
                      # case _ of
                          Left conclusion -> Right { prop: conclusion, isNew: false }
                          Right { hypothesis: hypothesis@(Hypothesis (Prop prop_name _) _), rule' } -> Left (Map.singleton prop_name (List.singleton { hypothesis, rule' }))
                )
            # lmap List.fold
      in
        Env
          { gas: main.initialGas
          , ripe_rules
          , known_props: active_props # map (\{ prop: prop@(Prop prop_name _) } -> Map.singleton prop_name (List.singleton prop)) # List.foldr (Map.unionWith append) Map.empty
          , active_props
          }
  err_or_unit /\ env' <-
    fixpointFocusModule
      # runExceptT
      # flip runReaderT ctx
      # flip runStateT env
  ((err_or_unit # either Just (const Nothing)) /\ env') # pure

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
  Ctx { focusModule: Module main } <- ask
  tellLog { label: "gas = " <> show env.gas, messages: [] }
  when (env.gas <= 0) do
    tellLog { label: "error", messages: [ "reason" /\ ("out of gas" # HH.text # pure # HH.div []), "initialGas" /\ (main.initialGas # show # HH.text # pure # HH.div []) ] }
    throwError (Exc { label: _error, source: "fixpointFocusModule", description: "ran out of gas" })
  case env.active_props of
    Nil -> do
      tellLog { label: "done", messages: [ "gas" /\ (env.gas # show # HH.text # pure # HH.div []) ] }
      pure unit
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
learnProp prop@(Prop prop_name _) = do
  Env env <- get
  let
    failure exc = do
      tellLog { label: "learn prop . failure", messages: [ "reason" /\ (exc # show # HH.text # pure # HH.div []) ] }

    success known_props' = do
      tellLog { label: "learn prop . success", messages: [ "prop" /\ (prop # render # line # HH.div []) ] }
      modify_ \(Env env') -> Env env' { known_props = known_props' }
  env.known_props # Map.lookup prop_name
    # case _ of
        Nothing -> success (env.known_props # Map.insert prop_name (pure prop))
        Just known_props -> do
          insertProp identity known_props prop
            # bindFlipped case _ of
                Left exc -> failure exc
                Right known_props' -> success (env.known_props # Map.insert prop_name known_props')

joinProps ::
  forall m a.
  Monad m =>
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadState Env m =>
  MonadWriter (Array Log) m =>
  Getter' a Prop -> List a -> a -> ExceptT (Exc "ignore prop") m (List a)
joinProps g props prop = do
  props
    # List.foldM
        ( \known_props prop' -> do
            compareProp (prop ^. g) (prop' ^. g)
              # runExceptT
              # lift
              # bindFlipped case _ of
                  -- prop >< prop' ==> keep prop'
                  Left _ -> pure (prop' : known_props)
                  -- prop < prop' ==> prop is subsumed
                  Right (LT /\ _) -> do
                    tellLog { label: "joinProps . props subsume prop", messages: [ "prop" /\ (prop ^. g # render # line # HH.div []) ] }
                    throwError (Exc { label: Proxy :: Proxy "ignore prop", source: "joinProps", description: show (prop ^. g) <> " is subsumed by " <> show (prop' ^. g) })
                  -- prop = prop' ==> prop is subsumed
                  Right (EQ /\ _) -> do
                    tellLog { label: "joinProps . props subsume prop", messages: [ "prop" /\ (prop ^. g # render # line # HH.div []) ] }
                    throwError (Exc { label: Proxy :: Proxy "ignore prop", source: "joinProps", description: show (prop ^. g) <> " is subsumed by " <> show (prop' ^. g) })
                  -- prop > prop' ==> prop' is subsumed so drop prop'
                  Right (GT /\ _) -> do
                    tellLog { label: "joinProps . prop subsumes prop'", messages: [ "prop" /\ (prop ^. g # render # line # HH.div []), "prop'" /\ (prop' ^. g # render # line # HH.div []) ] }
                    pure known_props
        )
        Nil

insertProp ::
  forall m a.
  Monad m =>
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadState Env m =>
  MonadWriter (Array Log) m =>
  Getter' a Prop -> List a -> a -> m (Either (Exc "ignore prop") (List a))
insertProp g props prop =
  runExceptT do
    props' <- joinProps g props prop
    List.snoc props' prop # pure

resolveProp ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  Prop -> m Unit
resolveProp prop@(Prop prop_name _) = do
  tellLog { label: "resolve prop", messages: [ "prop" /\ (prop # render # line # HH.div []) ] }
  Env env <- get
  -- rules that result from applying `prop` to a rule
  new_ripe_rules :: List RipeRule <-
    env.ripe_rules
      # Map.lookup prop_name
      # fromMaybe Nil
      # traverse
          ( \ripe_rule -> do
              -- ripe_rule <- freshenRipeRule ripe_rule # pure
              (applyRipeRuleToProp ripe_rule prop # runExceptT)
                >>= case _ of
                    Left exc -> do
                      tellLog
                        { label: "resolve prop . apply rule . failure"
                        , messages:
                            [ "prop" /\ (prop # render # line # HH.div [])
                            , "ripe_rule" /\ (ripe_rule # from_RipeRule_to_Rule # render # line # HH.div [])
                            , "reason" /\ (exc # show # HH.text # pure # HH.div [])
                            ]
                        }
                      pure Nil
                    Right (sigma /\ rule') -> do
                      tellLog
                        { label: "resolve prop . apply rule . success"
                        , messages:
                            [ "prop" /\ (prop # render # line # HH.div [])
                            , "ripe_rule" /\ (ripe_rule # from_RipeRule_to_Rule # render # line # HH.div [])
                            , "sigma" /\ (sigma # render # line # HH.div [])
                            , "sigma rule" /\ (rule' # render # line # HH.div [])
                            ]
                        }
                      case nextHypothesis rule' of
                        Left conclusion -> do
                          -- doesn't have any more hypotheses, so just defer its conclusion
                          deferProp true conclusion
                          pure Nil
                        Right ripe_rule' -> do
                          pure (List.singleton ripe_rule')
          )
      # map List.fold
  new_ripe_rules # traverse_ deferRipeRule

-- | Defers a `Prop` to be resolved later.
deferProp ::
  forall m.
  MonadState Env m =>
  MonadWriter (Array Log) m =>
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  Boolean -> Prop -> m Unit
deferProp isNew prop@(Prop prop_name _) = do
  tellLog { label: "defer prop", messages: [ "prop" /\ (prop # render # line # HH.div []), "isNew" /\ (isNew # show # HH.text # pure # HH.div []) ] }
  Env env <- get
  let
    failure exc = do
      tellLog { label: "defer prop . failure", messages: [ "prop" /\ (prop # render # line # HH.div []), "reason" /\ (exc # show # HH.text # pure # HH.div []) ] }

    success active_props = do
      tellLog { label: "defer prop . success", messages: [ "prop" /\ (prop # render # line # HH.div []) ] }
      modify_ \(Env env') -> Env env' { active_props = active_props }
  insertProp (Lens.Record.prop (Proxy :: Proxy "prop")) env.active_props { prop, isNew }
    >>= case _ of
        Left exc -> failure exc
        Right active_props ->
          if isNew then
            -- since prop is claimed to be new, check if already known to be subsumed before defering
            env.known_props
              # Map.lookup prop_name
              # maybe (success active_props) \known_props ->
                  joinProps identity known_props prop
                    # runExceptT
                    # bindFlipped case _ of
                        Left exc -> failure exc
                        Right _ -> success active_props
          -- prop is not claimed to be new, so just defer it
          else
            success active_props

-- | Defers a `Rule` by inserting it into `ripe_rules` and defering all known
-- | `Prop`s that can be applied to this rule, to be resolved later.
deferRipeRule ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  RipeRule -> m Unit
deferRipeRule ripe_rule_ = do
  ripe_rule@{ hypothesis: Hypothesis (Prop prop_name _) _ } <- ripe_rule_ # freshenRipeRule # pure
  tellLog { label: "defer rule", messages: [ "ripe_rule" /\ (ripe_rule # from_RipeRule_to_Rule # render # line # HH.div []) ] }
  modify_ \(Env env) -> Env env { ripe_rules = env.ripe_rules # Map.insertWith append prop_name (List.singleton ripe_rule) }
  Env env <- get
  props <-
    env.known_props
      # Map.lookup prop_name
      # maybe
          (pure Nil)
          ( List.filterM \prop ->
              applyRipeRuleToProp ripe_rule prop
                # runExceptT
                # map (either (const false) (const true))
          )
  props # traverse_ (deferProp false)

freshenRipeRule :: RipeRule -> RipeRule
freshenRipeRule ripe_rule =
  { hypothesis: ripe_rule.hypothesis # freshenVarNames
  , rule': ripe_rule.rule' # freshenVarNames
  }

applyRipeRuleToProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  MonadState Env m =>
  RipeRule -> Prop -> ExceptT (Exc "apply rule") m (TermSubst /\ Rule)
applyRipeRuleToProp ripe_rule@{ hypothesis: Hypothesis hyp_prop hyp_sides } prop = do
  -- ripe_rule@{ hypothesis: Hypothesis hyp_prop hyp_sides } <- freshenRipeRule ripe_rule # pure
  -- first, check if prop satisfies hypothesis_prop
  sigma <-
    compareProp hyp_prop prop
      # mapExceptT (map (lmap (map_Exc_label _apply_rule)))
      # bindFlipped case _ of
          LT /\ sigma -> pure sigma
          EQ /\ sigma -> pure sigma
          _ -> throwError (Exc { label: _apply_rule, source: "applyRipeRuleToProp", description: show hyp_prop <> " < " <> show prop })
  let
    rule' = ripe_rule.rule' # substRule sigma

    hyp_sides' = hyp_sides <#> substSideHypothesis sigma
  -- second, check if the side hypotheses hold
  rule'' <-
    processSideHypotheses rule' hyp_sides'
      # mapExceptT (map (lmap (map_Exc_label _apply_rule)))
  pure (sigma /\ rule'')

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
    Ctx { focusModule } <- ask
    functionDef <-
      focusModule
        # lookupModule (Proxy :: Proxy "functionDefs") side.functionName
        # maybe (lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "could not function definition of the name " <> show side.functionName })) pure
    result <- case functionDef of
      ExternalFunctionDef externalFunctionDef -> do
        -- function <- case Map.lookup externalFunctionDef.name externalFunctions of
        --   Nothing -> lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "cound not find function of the name " <> show externalFunctionDef.name })
        --   Just function -> pure function
        args <- side.args # traverse (evaluateTerm >>> lift)
        result <-
          fromOpaque externalFunctionDef.impl (Array.zip externalFunctionDef.inputs args # map (lmap fst) # Map.fromFoldable)
            # either (\err -> lift $ throwError (Exc { label: _error, source: "processSideHypothesis", description: "error in function " <> show externalFunctionDef.name <> ": " <> err })) pure
        pure result
    rule # substRule (Map.singleton side.resultVarVarName result) # pure

--------------------------------------------------------------------------------
-- Utilities
--------------------------------------------------------------------------------
evaluateTerm ::
  forall m y.
  MonadThrow (Exc "error") m =>
  Term -> m (TermF y)
evaluateTerm = traverse \x -> throwError (Exc { label: _error, source: "evaluateTerm", description: "expected term to be a value, but found a variable " <> show x })

compareProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow (Exc "error") m =>
  MonadWriter (Array Log) m =>
  Prop -> Prop -> ExceptT (Exc "compare") m LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) = do
  unless (p1 == p2) do
    throwError (Exc { label: _compare, source: "compareProp", description: show p1 <> " != " <> show p2 })
  Ctx { focusModule: Module { relations } } <- ask
  domain <- case Map.lookup p1 relations of
    Nothing -> Exc { label: _error, source: "compareProp", description: "could not find relation " <> show (show p1) } # throwError # lift
    Just (Relation { domain }) -> pure domain
  compareTerm domain t1 t2

-- | Assumes that terms to have the same type type.
-- TODO: check for consistent substitution
compareTerm ::
  forall m.
  MonadThrow (Exc "error") m =>
  MonadReader Ctx m =>
  MonadWriter (Array Log) m =>
  LatticeType -> Term -> Term -> ExceptT (Exc "compare") m LatticeOrdering
-- compareTerm _lty (VarTerm x1) (VarTerm x2) =
--   EQ
--     /\ ( Map.fromFoldable
--           [ x1 /\ VarTerm (freshVarName unit)
--           , x2 /\ VarTerm (freshVarName unit)
--           ]
--       )
--     # pure
compareTerm _lty t1 (VarTerm x2) = EQ /\ (Map.singleton x2 t1) # pure

compareTerm _lty (VarTerm x1) t2 = EQ /\ (Map.singleton x1 t2) # pure

compareTerm lty@(NamedLatticeType x) t1 t2 = do
  Ctx { focusModule } <- ask
  case lookupModule (Proxy :: Proxy "latticeTypeDefs") x focusModule of
    Nothing -> throwError (Exc { label: _compare, source: "comapreTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find lattice type definition with name " <> show x })
    Just latticeTypeDef -> case latticeTypeDef of
      LatticeTypeDef lty' -> do
        -- (Exc { label: _error, source: "compareTerm", description: "got here" }) # throwError # lift # void
        compareTerm lty' t1 t2
      ExternalLatticeTypeDef extLatticeTypeDef -> do
        case fromOpaque extLatticeTypeDef.compare_impl (t1 /\ t2) # runExceptT # runExcept of
          Left compare_exc -> throwError compare_exc
          Right (Left error_exc) -> throwError (error_exc # map_Exc_label _error) # lift
          Right (Right (o /\ sigma)) -> pure (o /\ sigma)

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
        GT /\ sigma -> LT /\ sigma # pure

compareTerm (DiscreteLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ _sigma -> throwError_compareTerm (DiscreteLatticeType lty) t1 t2
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ _sigma -> throwError_compareTerm (DiscreteLatticeType lty) t1 t2

compareTerm (PowerLatticeType lty) t1 t2 = Unsafe.todo "compareTerm PowerLatticeType"

throwError_compareTerm :: forall m a. MonadThrow (Exc "compare") m => LatticeType -> Term -> Term -> m a
throwError_compareTerm lty t1 t2 =
  throwError
    ( Exc
        { label: _compare
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
