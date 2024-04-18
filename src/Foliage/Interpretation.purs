module Foliage.Interpretation where

import Foliage.Program
import Prelude
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadAsk, ask, runReaderT)
import Control.Monad.State (class MonadState, execStateT, get, modify_)
import Control.MonadPlus (class MonadPlus)
import Control.Plus (empty)
import Data.Array as Array
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), isJust)
import Data.Traversable (traverse, traverse_)
import Data.Tuple.Nested ((/\))
import Partial.Unsafe (unsafeCrashWith)
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe as Unsafe
import Unsafe.Coerce (unsafeCoerce)

-- type M
--   = ReaderT Ctx (StateT Env M')
-- type M'
--   = ExceptT Err Aff
type Ctx
  = { modules :: Map Name Module
    , focusModule :: Module
    , rules :: Array Rule
    }

-- | Env:
-- | - active_rules :: priority queue of rules; priority is order of which to
-- |   try next 
-- | - TODO: concreteProps and abstractProps actually SHOULD NOT be separated --
-- |   since abstract props can subsume concrete props of course!
type Env
  = { active_rules :: List Rule
    , concreteProps :: List ConcreteProp
    , abstractProps :: List Prop
    , props :: List Prop
    }

_active_rules = Proxy :: Proxy "active_rules"

_concreteProps = Proxy :: Proxy "concreteProps"

-- TODO: actually this should _merge_ with active_rules, so that only
-- non-subsumed rules exist in the resulting active_rules
enqueue_active_rule ::
  forall m.
  MonadState Env m =>
  Rule -> m Unit
enqueue_active_rule rule =
  modify_
    (Record.modify (Proxy :: Proxy "active_rules") (rule : _))

dequeue_active_rule ::
  forall m.
  MonadState Env m => m (Maybe Rule)
dequeue_active_rule = do
  { active_rules } <- get
  case active_rules of
    Nil -> pure Nothing
    active_rule : active_rules -> do
      modify_ _ { active_rules = active_rules }
      pure (Just active_rule)

--------------------------------------------------------------------------------
-- interpretation endpoint
--------------------------------------------------------------------------------
interpProgram ::
  forall m.
  MonadThrow Err m =>
  Program -> m (List ConcreteProp)
interpProgram (Program prog) = do
  Module main <- lookup "module Main" mainModuleName prog.modules
  let
    ctx :: Ctx
    ctx =
      { modules: prog.modules
      , focusModule: Module main
      , rules: main.rules # Map.values # Array.fromFoldable
      }

    env :: Env
    env =
      -- initialize rules with only the axioms (i.e. given rules that are simply
      -- conclusions)
      { active_rules: main.rules # Map.values
      , concreteProps: Nil
      , abstractProps: Nil
      , props: Nil
      }
  env <-
    interpFocusModule
      # flip runReaderT ctx
      # flip execStateT env
  pure env.concreteProps

--------------------------------------------------------------------------------
-- interpretation internals
--------------------------------------------------------------------------------
-- | Interpret the focus module by computing the fixpoint of its rules.
interpFocusModule ::
  forall m.
  MonadAsk Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  m Unit
interpFocusModule = do
  fixpointFocusModule
  pure unit

fixpointFocusModule ::
  forall m.
  MonadAsk Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  m Unit
fixpointFocusModule =
  execMaybeT do
    active_rule <- dequeue_active_rule # fromJustT
    fixpointFocusModule_loop active_rule
    fixpointFocusModule

fixpointFocusModule_loop ::
  forall m.
  MonadAsk Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  Rule -> m Unit
fixpointFocusModule_loop (Rule { hypotheses, conclusion }) = case hypotheses of
  Nil -> learnProp conclusion
  hypothesis : hypotheses ->
    deriveProp hypothesis
      >>= traverse_ \{ sigma } -> do
          let
            rule = Rule { hypotheses, conclusion } # substRule sigma
          enqueue_active_rule rule

deriveProp ::
  forall m.
  MonadAsk Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  Prop -> m (List { prop :: Prop, sigma :: TermSubst })
deriveProp prop = do
  -- look in concreteProps and abstractProps for any props that can satisfy
  -- `hypothesis`
  { concreteProps, abstractProps } <- get
  let
    props = (concreteProps <#> toAbstractProp) <> abstractProps
  props
    # List.foldM
        ( \results prop' ->
            (compareProp prop prop' # runMaybeT)
              <#> case _ of
                  Just (LessThan sigma) -> { prop: prop', sigma } : results
                  _ -> results
        )
        Nil

learnProp ::
  forall m.
  MonadState Env m =>
  MonadAsk Ctx m =>
  MonadThrow Err m =>
  PropF Name -> m Unit
learnProp prop = do
  { props } <- get
  keep_prop /\ props <-
    props
      # List.foldM
          ( \(keep_prop /\ props) prop' ->
              (compareProp prop prop' # runMaybeT)
                <#> case _ of
                    -- prop >< prop' ==> keep prop'
                    Nothing -> (keep_prop /\ prop' : props)
                    -- prop < prop' ==> prop is subsumed; keep prop'
                    Just (LessThan _) -> (false /\ prop' : props)
                    -- prop = prop' ==> prop is subsumed; keep prop'
                    Just (Equal _) -> (false /\ prop' : props)
                    -- prop > prop' ==> prop' is subsumed so drop prop'
                    Just (GreaterThan _) -> (keep_prop /\ props)
          )
          (true /\ Nil)
  modify_ _ { props = (if keep_prop then (prop : _) else identity) props }

compareProp ::
  forall m.
  MonadAsk Ctx m =>
  MonadPlus m =>
  MonadThrow Err m =>
  Prop -> Prop -> m LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) = do
  unless (p1 == p2) empty
  { focusModule: Module { relations } } <- ask
  domain <- case Map.lookup p1 relations of
    Nothing ->
      throwError
        { source: "compareProp"
        , description: "The relation " <> show (show p1) <> " does not exist in the focused module."
        }
    Just (Relation { domain }) -> pure domain
  compareTerm domain t1 t2

-- | Requires the terms to have the same type type.
compareTerm ::
  forall m.
  MonadThrow Err m =>
  MonadPlus m =>
  LatticeType -> Term -> Term -> m LatticeOrdering
compareTerm _lty (VarTerm x1) (VarTerm x2) =
  Equal
    ( Map.fromFoldable
        [ x1 /\ VarTerm (freshName unit)
        , x2 /\ VarTerm (freshName unit)
        ]
    )
    # pure

compareTerm _lty (VarTerm x1) t2 = GreaterThan (Map.singleton x1 t2) # pure

compareTerm _lty t1 (VarTerm x2) = LessThan (Map.singleton x2 t1) # pure

compareTerm lty@UnitLatticeType t1 t2 = case t1 /\ t2 of
  UnitTerm /\ UnitTerm -> Equal Map.empty # pure
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(SumLatticeType LeftGreaterThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> GreaterThan Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> LessThan Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> LessThan Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> GreaterThan Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(SumLatticeType LeftIncomparableRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> empty
  RightTerm t1 /\ LeftTerm t2 -> empty
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(SumLatticeType LeftEqualRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> Equal Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> Equal Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering lty_1 lty_2) t1 t2 = case t1 /\ t2 of
  PairTerm t1_1 t1_2 /\ PairTerm t2_1 t2_2 ->
    compareTerm lty_1 t1_1 t2_1
      >>= case _ of
          LessThan sigma -> LessThan sigma # pure
          Equal sigma -> do
            t1_2 <- substTerm sigma t1_2 # pure
            t2_2 <- substTerm sigma t2_2 # pure
            compareTerm lty_2 t1_2 t2_2
          GreaterThan sigma -> GreaterThan sigma # pure
  _ -> throwError { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." }

compareTerm lty@(SetLatticeType _ lty_elem) t1 t2 = Unsafe.todo "compareTerm SetLatticeType"

compareTerm lty t1 t2 = unsafeCrashWith "compareTerm"

assertConcreteProp :: forall m. MonadThrow Err m => Prop -> m ConcreteProp
assertConcreteProp prop =
  prop
    # traverse \x ->
        throwError
          { source: "assertConcreteProp"
          , description: "Expected to be a concrete proposition, but the variable " <> show (show x) <> " appeared in the prop " <> show (show prop) <> "."
          }

fromConcreteProp :: Prop -> Maybe ConcreteProp
fromConcreteProp prop = prop # traverse (const Nothing)

toAbstractProp :: forall x. ConcreteProp -> PropF x
toAbstractProp = unsafeCoerce -- this is equivalent to `map absurd`

--------------------------------------------------------------------------------
-- miscellaneous
--------------------------------------------------------------------------------
lookup ::
  forall a m.
  MonadThrow Err m =>
  String -> Name -> Map Name a -> m a
lookup label x m = case Map.lookup x m of
  Nothing ->
    throwError
      { source: "lookup"
      , description: label <> " not found: " <> show x
      }
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
