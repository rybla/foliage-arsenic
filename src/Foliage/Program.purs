module Foliage.Program where

import Prelude
import Data.Either (Either(..))
import Data.Eq.Generic (genericEq)
import Data.Foldable (class Foldable, null)
import Data.Generic.Rep (class Generic)
import Data.List (List(..))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Show.Generic (genericShow)
import Data.Traversable (class Traversable)
import Data.Tuple.Nested (type (/\), (/\))
import Partial.Unsafe (unsafeCrashWith)

data Program
  = Program
    { modules :: Map Name Module
    }

derive instance _Generic_Program :: Generic Program _

instance _Eq_Program :: Eq Program where
  eq x = genericEq x

instance _Show_Program :: Show Program where
  show x = genericShow x

data Module
  = Module
    { name :: Name
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
  = ExternalDataTypeDef Name
  | DataTypeDef DataType

derive instance _Generic_DataTypeDef :: Generic DataTypeDef _

instance _Eq_DataTypeDef :: Eq DataTypeDef where
  eq x = genericEq x

instance _Show_DataTypeDef :: Show DataTypeDef where
  show x = genericShow x

data DataType
  = UnitDataType
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

derive instance _Generic_LatticeTypeDef :: Generic LatticeTypeDef _

instance _Eq_LatticeTypeDef :: Eq LatticeTypeDef where
  eq x = genericEq x

instance _Show_LatticeTypeDef :: Show LatticeTypeDef where
  show x = genericShow x

data LatticeType
  = UnitLatticeType
  | SumLatticeType SumLatticeTypeOrdering LatticeType LatticeType
  | ProductLatticeType ProductLatticeTypeOrdering LatticeType LatticeType
  | SetLatticeType SetOrdering LatticeType
  | OppositeLatticeType LatticeType
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
  = ExternalFunctionDef Name

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
    { hypotheses :: List (PropF Name)
    , conclusion :: PropF Name
    }

derive instance _Generic_Rule :: Generic Rule _

instance _Eq_Rule :: Eq Rule where
  eq x = genericEq x

instance _Show_Rule :: Show Rule where
  show x = genericShow x

fromNoHypothesesRule :: Rule -> Maybe Prop
fromNoHypothesesRule (Rule rule) =
  if null rule.hypotheses then
    Just rule.conclusion
  else
    Nothing

nextHypothesis ::
  Rule ->
  Either
    Prop
    (Prop /\ Rule)
nextHypothesis (Rule rule) = case rule.hypotheses of
  Nil -> Left rule.conclusion
  Cons p ps -> Right (p /\ Rule rule { hypotheses = ps })

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
  | LeftTerm (TermF x)
  | RightTerm (TermF x)
  | PairTerm (TermF x) (TermF x)
  | SetTerm (Array (TermF x))

derive instance _Generic_TermF :: Generic (TermF x) _

instance _Eq_Term :: Eq x => Eq (TermF x) where
  eq x = genericEq x

instance _Show_Term :: Show x => Show (TermF x) where
  show x = genericShow x

derive instance _Functor_TermF :: Functor (TermF)

derive instance _Foldable_TermF :: Foldable (TermF)

derive instance _Traversable_TermF :: Traversable (TermF)

type TermSubst
  = Map Name Term

substRule :: TermSubst -> Rule -> Rule
substRule sigma (Rule rule) =
  Rule
    { hypotheses: rule.hypotheses <#> substProp sigma
    , conclusion: rule.conclusion # substProp sigma
    }

substProp :: TermSubst -> Prop -> Prop
substProp sigma (Prop p t) = Prop p (substTerm sigma t)

substTerm :: TermSubst -> Term -> Term
substTerm sigma (VarTerm x) = Map.lookup x sigma # fromMaybe (VarTerm x)

substTerm _sigma UnitTerm = UnitTerm

substTerm sigma (LeftTerm t) = LeftTerm (substTerm sigma t)

substTerm sigma (RightTerm t) = RightTerm (substTerm sigma t)

substTerm sigma (PairTerm s t) = PairTerm (substTerm sigma s) (substTerm sigma t)

substTerm sigma (SetTerm ts) = SetTerm (ts <#> substTerm sigma)

freshName :: Unit -> Name
freshName _ = unsafeCrashWith "freshName"

-- | LatticeOrdering:
-- | - `a = b` if there exists a substitution of `a` and a substitution of `b`
-- |   such that `a === b`
-- | - `a < b` if there exists a substitution of `b` such that `a` is subsumed
-- |   by `b`
-- | - `a > b` if `b < a`.
data LatticeOrdering
  = LessThan TermSubst
  | GreaterThan TermSubst
  | Equal TermSubst

newtype Name
  = Name String

derive newtype instance _Eq_Name :: Eq Name

derive newtype instance _Ord_Name :: Ord Name

derive newtype instance _Show_Name :: Show Name

mainModuleName :: Name
mainModuleName = Name "Main"
