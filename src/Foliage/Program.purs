module Foliage.Program where

import Prelude

import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT, Except)
import Control.Monad.State (evalState, get, modify_)
import Data.Either (Either(..))
import Data.Eq.Generic (genericEq)
import Data.Foldable (class Foldable, null)
import Data.Generic.Rep (class Generic)
import Data.List (List(..), (:))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Ord.Generic (genericCompare)
import Data.Show.Generic (genericShow)
import Data.Traversable (class Traversable, traverse)
import Data.Tuple.Nested (type (/\))
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Foliage.Common (Exc, Opaque)
import Record as Record

data Program
  = Program
    { name :: FixedName
    , doc :: Maybe String
    , modules :: Map FixedName Module
    }

derive instance _Generic_Program :: Generic Program _

instance _Eq_Program :: Eq Program where
  eq x = genericEq x

instance _Show_Program :: Show Program where
  show x = genericShow x

lookupModule label k = (\(Module mod) -> mod) >>> Record.get label >>> Map.lookup k

data Module
  = Module
    { name :: FixedName
    , doc :: Maybe String
    , initialGas :: Int
    , dataTypeDefs :: Map FixedName DataTypeDef
    , latticeTypeDefs :: Map FixedName LatticeTypeDef
    , functionDefs :: Map FixedName FunctionDef
    , relations :: Map FixedName Relation
    , rules :: Map FixedName Rule
    }

derive instance _Generic_Module :: Generic Module _

instance _Eq_Module :: Eq Module where
  eq x = genericEq x

instance _Show_Module :: Show Module where
  show x = genericShow x

data DataTypeDef
  = ExternalDataTypeDef String
  | DataTypeDef DataType

derive instance _Generic_DataTypeDef :: Generic DataTypeDef _

instance _Eq_DataTypeDef :: Eq DataTypeDef where
  eq x = genericEq x

instance _Show_DataTypeDef :: Show DataTypeDef where
  show x = genericShow x

data DataType
  = UnitDataType
  | NamedDataType FixedName
  | SumDataType DataType DataType
  | ProductDataType DataType DataType
  | SetDataType DataType

derive instance _Generic_DataType :: Generic DataType _

instance _Eq_DataType :: Eq DataType where
  eq x = genericEq x

instance _Show_DataType :: Show DataType where
  show x = genericShow x

data LatticeTypeDef
  = LatticeTypeDef LatticeType
  | ExternalLatticeTypeDef
    { name :: String
    , compare_impl :: Opaque "compare" (Term /\ Term -> ExceptT (Exc "error") (Except (Exc "compare")) LatticeOrdering)
    }

derive instance _Generic_LatticeTypeDef :: Generic LatticeTypeDef _

instance _Eq_LatticeTypeDef :: Eq LatticeTypeDef where
  eq x = genericEq x

instance _Show_LatticeTypeDef :: Show LatticeTypeDef where
  show x = genericShow x

data LatticeType
  = NamedLatticeType FixedName
  | UnitLatticeType
  | SumLatticeType SumLatticeTypeOrdering LatticeType LatticeType
  | ProductLatticeType ProductLatticeTypeOrdering LatticeType LatticeType
  | SetLatticeType SetOrdering LatticeType
  | OppositeLatticeType LatticeType
  | DiscreteLatticeType LatticeType
  | PowerLatticeType LatticeType

derive instance _Generic_LatticeType :: Generic LatticeType _

instance _Eq_LatticeType :: Eq LatticeType where
  eq x = genericEq x

instance _Show_LatticeType :: Show LatticeType where
  show x = genericShow x

data SumLatticeTypeOrdering
  = LeftGreaterThanRight_SumLatticeTypeOrdering
  | LeftLessThanRight_SumLatticeTypeOrdering
  | LeftIncomparableRight_SumLatticeTypeOrdering
  | LeftEqualRight_SumLatticeTypeOrdering

derive instance _Generic_SumLatticeTypeOrdering :: Generic SumLatticeTypeOrdering _

instance _Eq_SumLatticeTypeOrdering :: Eq SumLatticeTypeOrdering where
  eq x = genericEq x

instance _Show_SumLatticeTypeOrdering :: Show SumLatticeTypeOrdering where
  show x = genericShow x

data ProductLatticeTypeOrdering
  = FirstThenSecond_ProductLatticeTypeOrdering

derive instance _Generic_ProductLatticeTypeOrdering :: Generic ProductLatticeTypeOrdering _

instance _Eq_ProductLatticeTypeOrdering :: Eq ProductLatticeTypeOrdering where
  eq x = genericEq x

instance _Show_ProductLatticeTypeOrdering :: Show ProductLatticeTypeOrdering where
  show x = genericShow x

data SetOrdering
  = SetOrdering

derive instance _Generic_SetOrdering :: Generic SetOrdering _

instance _Eq_SetOrdering :: Eq SetOrdering where
  eq x = genericEq x

instance _Show_SetOrdering :: Show SetOrdering where
  show x = genericShow x

data FunctionDef
  = ExternalFunctionDef
    { name :: String
    , inputs :: Array (String /\ DataType)
    , output :: DataType
    , impl :: Opaque "function" (Map String Term -> Either String Term)
    }

derive instance _Generic_FunctionDef :: Generic FunctionDef _

instance _Eq_FunctionDef :: Eq FunctionDef where
  eq x = genericEq x

instance _Show_FunctionDef :: Show FunctionDef where
  show x = genericShow x

data Relation
  = Relation
    { domain :: LatticeType
    }

derive instance _Generic_Relation :: Generic Relation _

instance _Eq_Relation :: Eq Relation where
  eq x = genericEq x

instance _Show_Relation :: Show Relation where
  show x = genericShow x

type Rule
  = RuleF VarName

data RuleF x
  = Rule
    { hypotheses :: List (HypothesisF x)
    , conclusion :: PropF x
    }

derive instance _Generic_RuleF :: Generic (RuleF x) _

derive instance _Functor_RuleF :: Functor RuleF

derive instance _Foldable_RuleF :: Foldable RuleF

derive instance _Traversable_RuleF :: Traversable RuleF

instance _Eq_Rule :: Eq Rule where
  eq x = genericEq x

instance _Show_Rule :: Show Rule where
  show x = genericShow x

type RipeRule
  = RipeRuleF VarName

type RipeRuleF x
  = { hypothesis :: HypothesisF x, rule' :: RuleF x }

from_RipeRule_to_Rule :: RipeRule -> Rule
from_RipeRule_to_Rule { hypothesis, rule': Rule { hypotheses, conclusion } } = Rule { hypotheses: hypothesis : hypotheses, conclusion }

fromNoHypothesesRule :: Rule -> Maybe Prop
fromNoHypothesesRule (Rule rule) =
  if null rule.hypotheses then
    Just rule.conclusion
  else
    Nothing

nextHypothesis :: Rule -> Either Prop RipeRule
nextHypothesis (Rule rule) = case rule.hypotheses of
  Nil -> Left rule.conclusion
  Cons hypothesis hypotheses -> Right { hypothesis, rule': Rule rule { hypotheses = hypotheses } }

type Hypothesis
  = HypothesisF VarName

data HypothesisF x
  = Hypothesis (PropF x) (Array (SideHypothesisF x))

derive instance _Generic_HypothesisF :: Generic (HypothesisF x) _

derive instance _Functor_HypothesisF :: Functor HypothesisF

derive instance _Foldable_HypothesisF :: Foldable HypothesisF

derive instance _Traversable_HypothesisF :: Traversable HypothesisF

instance _Eq_Hypothesis :: Eq Hypothesis where
  eq x = genericEq x

instance _Show_Hypothesis :: Show Hypothesis where
  show x = genericShow x

substHypothesis :: TermSubst -> Hypothesis -> Hypothesis
substHypothesis sigma = case _ of
  Hypothesis prop sides -> Hypothesis (prop # substProp sigma) (sides <#> substSideHypothesis sigma)

type SideHypothesis
  = SideHypothesisF VarName

data SideHypothesisF x
  = FunctionSideHypothesis
    { resultVarVarName :: x
    , functionName :: FixedName
    , args :: Array (TermF x)
    }

derive instance _Generic_SideHypothesisF :: Generic (SideHypothesisF x) _

derive instance _Functor_SideHypothesisF :: Functor SideHypothesisF

derive instance _Foldable_SideHypothesisF :: Foldable SideHypothesisF

derive instance _Traversable_SideHypothesisF :: Traversable SideHypothesisF

instance _Eq_SideHypothesis :: Eq SideHypothesis where
  eq x = genericEq x

instance _Show_SideHypothesis :: Show SideHypothesis where
  show x = genericShow x

substSideHypothesis :: TermSubst -> SideHypothesis -> SideHypothesis
substSideHypothesis sigma = case _ of
  FunctionSideHypothesis side -> FunctionSideHypothesis side { args = side.args <#> substTerm sigma }

type Prop
  = PropF VarName

type ConcreteProp
  = PropF Void

data PropF x
  = Prop FixedName (TermF x)

derive instance _Generic_PropF :: Generic (PropF x) _

derive instance _Functor_PropF :: Functor PropF

derive instance _Foldable_PropF :: Foldable PropF

derive instance _Traversable_PropF :: Traversable PropF

instance _Eq_PropF :: Eq x => Eq (PropF x) where
  eq x = genericEq x

instance _Show_PropF :: Show x => Show (PropF x) where
  show x = genericShow x

type Term
  = TermF VarName

data TermF x
  = VarTerm x
  | UnitTerm
  | LiteralTerm String DataType
  | LeftTerm (TermF x)
  | RightTerm (TermF x)
  | PairTerm (TermF x) (TermF x)
  | SetTerm (Array (TermF x))

derive instance _Generic_TermF :: Generic (TermF x) _

derive instance _Functor_TermF :: Functor (TermF)

derive instance _Foldable_TermF :: Foldable (TermF)

derive instance _Traversable_TermF :: Traversable (TermF)

instance _Eq_Term :: Eq x => Eq (TermF x) where
  eq x = genericEq x

instance _Show_Term :: Show x => Show (TermF x) where
  show x = genericShow x

type TermSubst
  = Map VarName Term

substRule :: TermSubst -> Rule -> Rule
substRule sigma (Rule rule) =
  {- Debug.trace ("substRule.sigma: " <> show sigma) \_ ->
    Debug.trace ("substRule.before: " <> show (Rule rule)) \_ ->
      Debug.spyWith "substRule.after: " show
        $ -}
  Rule
    { hypotheses: rule.hypotheses <#> substHypothesis sigma
    , conclusion: rule.conclusion # substProp sigma
    }

substProp :: TermSubst -> Prop -> Prop
substProp sigma (Prop p t) = Prop p (substTerm sigma t)

substTerm :: TermSubst -> Term -> Term
substTerm sigma (VarTerm x) = Map.lookup x sigma # fromMaybe (VarTerm x)

substTerm _sigma (LiteralTerm s dty) = LiteralTerm s dty

substTerm _sigma UnitTerm = UnitTerm

substTerm sigma (LeftTerm t) = LeftTerm (substTerm sigma t)

substTerm sigma (RightTerm t) = RightTerm (substTerm sigma t)

substTerm sigma (PairTerm s t) = PairTerm (substTerm sigma s) (substTerm sigma t)

substTerm sigma (SetTerm ts) = SetTerm (ts <#> substTerm sigma)

freshenVarName :: VarName -> VarName
freshenVarName (VarName s _) =
  unsafePerformEffect do
    n <- freshVarNameIndexRef # Ref.read # map (\i -> VarName s i)
    freshVarNameIndexRef # Ref.modify_ (_ + 1)
    pure n

freshVarNameIndexRef :: Ref Int
freshVarNameIndexRef =
  unsafePerformEffect do
    0 # Ref.new

-- | LatticeOrdering:
-- | - `a = b` if there exists a substitution of `a` and a substitution of `b`
-- |   such that `a === b`
-- | - `a < b` if there exists a substitution of `b` such that `a` is subsumed
-- |   by `b`
-- | - `a > b` if `b < a`.
type LatticeOrdering
  = Ordering /\ TermSubst

data VarName
  = VarName String Int

derive instance _Generic_VarName :: Generic VarName _

instance _Eq_VarName :: Eq VarName where
  eq = genericEq

instance _Ord_VarName :: Ord VarName where
  compare = genericCompare

instance _Eq_Show :: Show VarName where
  show = genericShow

newVarName :: String -> VarName
newVarName s = VarName s 0

newtype FixedName
  = FixedName String

derive instance _Newtype_FixedName :: Newtype FixedName _

derive newtype instance _Eq_FixedName :: Eq FixedName

derive newtype instance _Ord_FixedName :: Ord FixedName

derive newtype instance _Show_FixedName :: Show FixedName

mainModuleName :: FixedName
mainModuleName = FixedName "Main"

--  Utilities for defining external functions
getValidatedArg ::
  forall r a.
  { dt :: DataType
  , dt_name :: String
  , f :: String
  , fromString :: String -> Maybe a
  , x :: String
  | r
  } ->
  Map String Term -> Either String a
getValidatedArg { f, x, dt, dt_name, fromString } args =
  Map.lookup x args
    # maybe (throwExternalFunctionCallError f $ "no arg for " <> show x) pure
    # bindFlipped case _ of
        LiteralTerm s dt'
          | dt == dt' -> s # fromString # maybe (throwExternalFunctionCallError f $ s <> " is not a " <> dt_name) pure
        t -> throwExternalFunctionCallError f $ "expected arg " <> x <> " = " <> show t <> " to be a " <> dt_name

throwExternalFunctionCallError :: forall a. String -> String -> Either String a
throwExternalFunctionCallError f msg = throwError $ "when calling external function " <> f <> ", " <> msg

-- | For each variable name in `f`, maps it to a fresh version of that name.
freshenVarNames :: forall f. Traversable f => f VarName -> f VarName
freshenVarNames = traverse f >>> flip evalState Map.empty
  where
  f x = do
    sigma <- get
    case Map.lookup x sigma of
      Nothing -> do
        let
          y = freshenVarName x
        modify_ (Map.insert x y)
        pure y
      Just y -> pure y
