module Foliage.Program where

import Prelude
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT, Except)
import Data.Either (Either(..))
import Data.Eq.Generic (genericEq)
import Data.Foldable (class Foldable, null)
import Data.Generic.Rep (class Generic)
import Data.List (List(..), (:))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype, wrap)
import Data.Show.Generic (genericShow)
import Data.Traversable (class Traversable)
import Data.Tuple.Nested (type (/\))
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Foliage.Common (Exc, Opaque)
import Record as Record

data Program
  = Program
    { name :: Name
    , doc :: Maybe String
    , modules :: Map Name Module
    }

derive instance _Generic_Program :: Generic Program _

instance _Eq_Program :: Eq Program where
  eq x = genericEq x

instance _Show_Program :: Show Program where
  show x = genericShow x

lookupModule label k = (\(Module mod) -> mod) >>> Record.get label >>> Map.lookup k

data Module
  = Module
    { name :: Name
    , doc :: Maybe String
    , initialGas :: Int
    , dataTypeDefs :: Map Name DataTypeDef
    , latticeTypeDefs :: Map Name LatticeTypeDef
    , functionDefs :: Map Name FunctionDef
    , relations :: Map Name Relation
    , rules :: Map Name Rule
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
  | NamedDataType Name
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
  = NamedLatticeType Name
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

data Rule
  = Rule
    { hypotheses :: List Hypothesis
    , conclusion :: Prop
    }

derive instance _Generic_Rule :: Generic Rule _

instance _Eq_Rule :: Eq Rule where
  eq x = genericEq x

instance _Show_Rule :: Show Rule where
  show x = genericShow x

type RipeRule
  = { hypothesis :: Hypothesis, rule' :: Rule }

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

data Hypothesis
  = Hypothesis Prop (Array SideHypothesis)

derive instance _Generic_Hypothesis :: Generic Hypothesis _

instance _Eq_Hypothesis :: Eq Hypothesis where
  eq x = genericEq x

instance _Show_Hypothesis :: Show Hypothesis where
  show x = genericShow x

substHypothesis :: TermSubst -> Hypothesis -> Hypothesis
substHypothesis sigma = case _ of
  Hypothesis prop sides -> Hypothesis (prop # substProp sigma) (sides <#> substSideHypothesis sigma)

data SideHypothesis
  = FunctionSideHypothesis
    { resultVarName :: Name
    , functionName :: Name
    , args :: Array Term
    }

derive instance _Generic_SideHypothesis :: Generic SideHypothesis _

instance _Eq_SideHypothesis :: Eq SideHypothesis where
  eq x = genericEq x

instance _Show_SideHypothesis :: Show SideHypothesis where
  show x = genericShow x

substSideHypothesis :: TermSubst -> SideHypothesis -> SideHypothesis
substSideHypothesis sigma = case _ of
  FunctionSideHypothesis side -> FunctionSideHypothesis side { args = side.args <#> substTerm sigma }

type Prop
  = PropF Name

type ConcreteProp
  = PropF Void

data PropF x
  = Prop Name (TermF x)

derive instance _Generic_PropF :: Generic (PropF x) _

derive instance _Functor_PropF :: Functor (PropF)

derive instance _Foldable_PropF :: Foldable (PropF)

derive instance _Traversable_PropF :: Traversable (PropF)

instance _Eq_PropF :: Eq x => Eq (PropF x) where
  eq x = genericEq x

instance _Show_PropF :: Show x => Show (PropF x) where
  show x = genericShow x

type Term
  = TermF Name

data TermF x
  = VarTerm x
  | UnitTerm
  | LiteralTerm String DataType
  | ConTerm String (TermF x)
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
  = Map Name Term

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

substTerm sigma (ConTerm s t) = ConTerm s (substTerm sigma t)

substTerm _sigma UnitTerm = UnitTerm

substTerm sigma (LeftTerm t) = LeftTerm (substTerm sigma t)

substTerm sigma (RightTerm t) = RightTerm (substTerm sigma t)

substTerm sigma (PairTerm s t) = PairTerm (substTerm sigma s) (substTerm sigma t)

substTerm sigma (SetTerm ts) = SetTerm (ts <#> substTerm sigma)

freshName :: Unit -> Name
freshName _ =
  unsafePerformEffect do
    n <- freshNameIndexRef # Ref.read # map (\i -> wrap (show i))
    freshNameIndexRef # Ref.modify_ (_ + 1)
    pure n

freshNameIndexRef :: Ref Int
freshNameIndexRef =
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

newtype Name
  = Name String

derive instance _Newtype_Name :: Newtype Name _

derive newtype instance _Eq_Name :: Eq Name

derive newtype instance _Ord_Name :: Ord Name

derive newtype instance _Show_Name :: Show Name

mainModuleName :: Name
mainModuleName = Name "Main"

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
