module Foliage.Interpretation where

import Control.Monad.Trans.Class
import Data.Tuple.Nested
import Foliage.Program
import Prelude
import Control.Apply (lift2)
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadThrow, throwError)
import Control.Monad.Except (Except, ExceptT, runExceptT, throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadAsk, ReaderT, ask, runReaderT)
import Control.Monad.State (class MonadState, StateT, evalStateT, execStateT, get, modify, modify_, runStateT)
import Control.MonadPlus (class MonadPlus)
import Control.Plus (class Plus, empty)
import Data.Array as Array
import Data.Either (Either(..), either)
import Data.List (List(..))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), isJust)
import Data.Set as Set
import Data.Traversable (traverse, traverse_)
import Effect.Aff (Aff)
import Partial.Unsafe (unsafeCrashWith)
import Record as Record
import Type.Proxy (Proxy(..))

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
-- | - active_rules :: priority queue of rules; priority is order of which
-- |   to try next
type Env
  = { active_rules :: List Rule
    , concreteProps :: List ConcreteProp
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
    (Record.modify (Proxy :: Proxy "active_rules") (Cons rule))

dequeue_active_rule ::
  forall m.
  MonadState Env m => m (Maybe Rule)
dequeue_active_rule = do
  { active_rules } <- get
  case active_rules of
    Nil -> pure Nothing
    Cons active_rule active_rules -> do
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
      { active_rules:
          main.rules
            # Map.values
            # List.filter (fromNoParamsNorHypothesesRule >>> isJust)
      , concreteProps: Nil
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
    loop active_rule
    fixpointFocusModule
  where
  -- Throw means break loop.
  loop ::
    forall m.
    MonadAsk Ctx m =>
    MonadState Env m =>
    MonadThrow Err m =>
    Rule -> m Unit
  loop active_rule =
    execMaybeT do
      { rules } <- ask
      -- check if `active_rule` has at least one hypothesis
      case nextHypothesis active_rule of
        -- `active_rule` has no hypotheses
        Left { params, conclusion } -> learnProp conclusion
        -- `active_rule` has at least one hypothesis
        Right (hypothesis /\ active_rule) -> do
          -- apply active rule to `rules` by trying to immediately derive 
          -- `hypothesis`
          rules
            # traverse_ \rule -> do
                -- require `rule` has no hypotheses
                rule <- fromNoHypothesesRule rule # pure # fromJustT
                -- require that `hypothesis` matches `rule.conclusion` via
                -- substitution `sigma`, so we can use `rule` to instantiate
                -- hypothesis, yielding a new `active_rule`
                sigma <- matchProp hypothesis rule.conclusion
                substRule sigma active_rule # lift >>= enqueue_active_rule >>> lift

learnProp :: forall m. MonadAsk Ctx m => MonadState Env m => MonadThrow Err m => Prop -> m Unit
learnProp prop = do
  concreteProp <- assertConcreteProp prop
  -- insert prop into `concreteProps`
  modify_ (Record.modify _concreteProps (Cons concreteProp))
  { rules } <- ask
  -- enqueue any rules that result from applying a rule to `prop`
  rules
    # traverse_ \rule -> do
        applyRule rule prop
          >>= case _ of
              Nothing -> pure unit
              Just rule -> enqueue_active_rule rule

-- pure unit
applyRule ::
  forall m.
  MonadThrow Err m =>
  Rule -> Prop -> m (Maybe Rule)
applyRule rule prop = case nextHypothesis rule of
  Left _ -> pure Nothing
  Right (hyp /\ rule) ->
    matchProp hyp prop # runMaybeT
      >>= case _ of
          Nothing -> pure Nothing
          Just sigma -> do
            rule <- substRule sigma rule
            pure (Just rule)

-- | Variables in the left prop will be substituted for variables in the right
-- | prop. In other words, the left is _expected_ and the right is _actual_.
matchProp ::
  forall m.
  MonadThrow Err m =>
  MonadPlus m =>
  Prop -> Prop -> m TermSubst
matchProp (Prop p1 t1) (Prop p2 t2)
  | p1 == p2 = matchTerm t1 t2

matchProp (Prop p1 t1) (Prop p2 t2) = empty

-- | Variables in the left term will be substituted for variables in the right
-- | term. In other words, the left is _expected_ and the right is _actual_.
matchTerm ::
  forall m.
  MonadThrow Err m =>
  MonadPlus m =>
  Term -> Term -> m TermSubst
matchTerm (VarTerm lty x1) t2 = Map.singleton x1 t2 # pure

matchTerm (UnitTerm lty1) (UnitTerm lty2) = Map.empty # pure

matchTerm (LeftTerm lty1 t1) (LeftTerm lty2 t2) = matchTerm t1 t2

matchTerm (RightTerm lty1 t1) (RightTerm lty2 t2) = matchTerm t1 t2

matchTerm (PairTerm lty1 s1 t1) (PairTerm lty2 s2 t2) = do
  sigma1 <- matchTerm s1 s2
  t2 <- substTerm sigma1 t2
  matchTerm t1 t2

matchTerm (SetTerm lty1 t1) (SetTerm lty2 t2) = todo "matchTerm SetTerm"

matchTerm _ _ = empty

assertConcreteProp :: forall m. MonadThrow Err m => Prop -> m ConcreteProp
assertConcreteProp prop =
  prop
    # traverse \x ->
        throwError
          { source: "assertConcreteProp"
          , description: "Expected to be a concrete proposition, but the variable " <> show (show x) <> " appeared in the prop " <> show (show prop) <> "."
          }

fromConcreteProp :: forall x. ConcreteProp -> PropF LatticeType x
fromConcreteProp = map absurd

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

todo msg = unsafeCrashWith ("TODO: " <> msg)

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
