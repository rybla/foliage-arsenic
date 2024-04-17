module Foliage.Interpretation where

import Control.Monad.Trans.Class
import Data.Tuple.Nested
import Prelude
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadThrow, throwError)
import Control.Monad.Except (Except, ExceptT, runExceptT, throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadAsk, ReaderT, ask, runReaderT)
import Control.Monad.State (class MonadState, StateT, evalStateT, get, modify, modify_, runStateT)
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
import Foliage.Program (Module(..), Name(..), Program(..), Prop(..), Rule(..), Term, fromNoHypothesesRule, fromNoParamsNorHypothesesRule, mainModuleName, nextHypothesis)
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
    }

type Err
  = { source :: String
    , description :: String
    }

-- TODO: actually this should _merge_ with active_rules, so that only
-- non-subsumed rules exist in the resulting active_rules
enqueue_active_rule ::
  forall m.
  MonadState Env m =>
  Rule -> m Unit
enqueue_active_rule rule = modify_ (Record.modify (Proxy :: Proxy "active_rules") (Cons rule))

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
  Program -> m Unit
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
      }
  interpFocusModule
    # flip runReaderT ctx
    # flip evalStateT env
  pure unit

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

-- | Throw means break loop.
fixpointFocusModule_loop ::
  forall m.
  MonadAsk Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  Rule -> m Unit
fixpointFocusModule_loop active_rule =
  execMaybeT do
    { rules } <- ask
    case nextHypothesis active_rule of
      Left { params, conclusion } -> do
        -- apply `rules` to `conclusion`
        rules
          # traverse_ \rule -> do
              rule <- applyRule rule conclusion # lift # fromJustT
              enqueue_active_rule rule # lift
        pure unit
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
              sigma <- matchProp hypothesis rule.conclusion # pure # fromJustT
              substRule sigma active_rule # lift >>= enqueue_active_rule >>> lift

applyRule ::
  forall m.
  MonadThrow Err m =>
  Rule -> Prop -> m (Maybe Rule)
applyRule rule prop = case nextHypothesis rule of
  Left _ -> pure Nothing
  Right (hyp /\ rule) -> case matchProp hyp prop of
    Nothing -> pure Nothing
    Just sigma -> do
      rule <- substRule sigma rule
      pure (Just rule)

type TermSubst
  = Map Name Term

-- | Variables in the left prop will be substituted for variables in the right
-- | prop. In other words, the left is _expected_ and the right prop is
-- | _actual_.
matchProp :: Prop -> Prop -> Maybe TermSubst
matchProp p1 p2 = Nothing

substRule ::
  forall m.
  MonadThrow Err m =>
  TermSubst -> Rule -> m Rule
substRule sigma (Rule rule) = do
  unless (Map.keys sigma `Set.subset` Map.keys rule.params) do
    throwError
      { source: "substRule"
      , description: "all variables in `sigma` must appear in `rule.params`"
      }
  params <- pure (rule.params `Map.difference` sigma)
  hypotheses <- rule.hypotheses # traverse (substProp sigma)
  conclusion <- rule.conclusion # substProp sigma
  pure (Rule { params, hypotheses, conclusion })

substProp :: forall m. MonadThrow Err m => TermSubst -> Prop -> m Prop
substProp = todo "substProp"

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
