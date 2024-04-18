module Foliage.Interpretation where

import Foliage.Program
import Prelude
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadAsk, runReaderT)
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
  Nil -> case fromConcreteProp conclusion of
    Nothing -> learnAbstractProp conclusion
    Just conclusion -> learnConcreteProp conclusion
  hypothesis : hypotheses ->
    deriveProp hypothesis
      >>= traverse_ \{ sigma } -> do
          let
            rule = Rule { hypotheses, conclusion } # substRule sigma
          enqueue_active_rule rule

deriveProp ::
  forall m.
  MonadState Env m =>
  Prop -> m (List { prop :: Prop, sigma :: TermSubst })
deriveProp prop = do
  -- look in concreteProps and abstractProps for any props that can satisfy
  -- `hypothesis`
  { concreteProps, abstractProps } <- get
  ((concreteProps <#> toAbstractProp) <> abstractProps)
    # List.foldr
        ( \prop' results -> case compareProp prop prop' of
            Just (LessThan sigma) -> { prop: prop', sigma } : results
            _ -> results
        )
        Nil
    # pure

learnConcreteProp ::
  forall m.
  MonadState Env m =>
  ConcreteProp -> m Unit
learnConcreteProp prop = do
  { concreteProps } <- get
  keep_prop /\ concreteProps <-
    let
      f prop' (keep_prop /\ concreteProps') = case compareProp (toAbstractProp prop) (toAbstractProp prop') of
        -- prop >< prop' ==> keep prop'
        Nothing -> (keep_prop /\ prop' : concreteProps')
        -- prop < prop' ==> prop is subsumed; keep prop'
        Just (LessThan _) -> (false /\ prop' : concreteProps')
        -- prop = prop' ==> prop is subsumed; keep prop'
        Just (Equal _) -> (false /\ prop' : concreteProps')
        -- prop > prop' ==> prop' is subsumed so drop prop'
        Just (GreaterThan _) -> (keep_prop /\ concreteProps')
    in
      concreteProps # List.foldr f (true /\ Nil) # pure
  modify_ _ { concreteProps = (if keep_prop then (prop : _) else identity) concreteProps }

learnAbstractProp ::
  forall m.
  MonadState Env m =>
  Prop -> m Unit
learnAbstractProp prop = do
  { abstractProps } <- get
  keep_prop /\ abstractProps <-
    let
      f prop' (keep_prop /\ abstractProps') = case compareProp prop prop' of
        -- prop >< prop' ==> keep prop'
        Nothing -> (keep_prop /\ prop' : abstractProps')
        -- prop < prop' ==> prop is subsumed; keep prop'
        Just (LessThan _) -> (false /\ prop' : abstractProps')
        -- prop = prop' ==> prop is subsumed; keep prop'
        Just (Equal _) -> (false /\ prop' : abstractProps')
        -- prop > prop' ==> prop' is subsumed so drop prop'
        Just (GreaterThan _) -> (keep_prop /\ abstractProps')
    in
      abstractProps # List.foldr f (true /\ Nil) # pure
  modify_ _ { abstractProps = (if keep_prop then (prop : _) else identity) abstractProps }

-- -- | Variables in the left prop will be substituted for variables in the right
-- -- | prop. In other words, the left is _expected_ and the right is _actual_.
-- matchProp ::
--   forall m.
--   MonadThrow Err m =>
--   MonadPlus m =>
--   Prop -> Prop -> m TermSubst
-- matchProp (Prop p1 t1) (Prop p2 t2)
--   | p1 == p2 = matchTerm t1 t2
-- matchProp (Prop p1 t1) (Prop p2 t2) = empty
-- -- | Variables in the left term will be substituted for variables in the right
-- -- | term. In other words, the left is _expected_ and the right is _actual_.
-- matchTerm ::
--   forall m.
--   MonadThrow Err m =>
--   MonadPlus m =>
--   Term -> Term -> m TermSubst
-- matchTerm (VarTerm lty x1) t2 = Map.singleton x1 t2 # pure
-- matchTerm (UnitTerm lty1) (UnitTerm lty2) = Map.empty # pure
-- matchTerm (LeftTerm lty1 t1) (LeftTerm lty2 t2) = matchTerm t1 t2
-- matchTerm (RightTerm lty1 t1) (RightTerm lty2 t2) = matchTerm t1 t2
-- matchTerm (PairTerm lty1 s1 t1) (PairTerm lty2 s2 t2) = do
--   sigma1 <- matchTerm s1 s2
--   t2 <- substTerm sigma1 t2
--   matchTerm t1 t2
-- matchTerm (SetTerm lty1 t1) (SetTerm lty2 t2) = todo "matchTerm SetTerm"
-- matchTerm _ _ = empty
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

toAbstractProp :: forall x. ConcreteProp -> PropF LatticeType x
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
