module Foliage.Program where

import Prelude
import Control.Alternative (guard)
import Control.Monad.Error.Class (class MonadThrow)
import Data.Either (Either(..))
import Data.Eq.Generic (genericEq)
import Data.Foldable (class Foldable, null)
import Data.Generic.Rep (class Generic)
import Data.List (List(..))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Show.Generic (genericShow)
import Data.Traversable (class Traversable, traverse)
import Data.Tuple.Nested (type (/\), (/\))
import Partial.Unsafe (unsafeCrashWith)

type Program
  = ProgramF LatticeType

data ProgramF ty
  = Program
    { modules :: Map Name (ModuleF ty)
    }

derive instance _Generic_Program :: Generic (ProgramF ty) _

instance _Eq_Program :: Eq ty => Eq (ProgramF ty) where
  eq x = genericEq x

instance _Show_Program :: Show ty => Show (ProgramF ty) where
  show x = genericShow x

type Module
  = ModuleF LatticeType

data ModuleF ty
  = Module
    { name :: Name
    , dataTypeDefs :: Map Name DataTypeDef
    , latticeTypeDefs :: Map Name LatticeTypeDef
    , functionDefs :: Map Name FunctionDef
    , relations :: Map Name Relation
    , rules :: Map Name (RuleF ty)
    }

derive instance _Generic_Module :: Generic (ModuleF ty) _

instance _Eq_Module :: Eq ty => Eq (ModuleF ty) where
  eq x = genericEq x

instance _Show_Module :: Show ty => Show (ModuleF ty) where
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
  = ProductLatticeTypeOrdering

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

type Rule
  = RuleF LatticeType

data RuleF ty
  = Rule
    { hypotheses :: List (PropF ty Name)
    , conclusion :: PropF ty Name
    }

derive instance _Generic_Rule :: Generic (RuleF ty) _

instance _Eq_Rule :: Eq ty => Eq (RuleF ty) where
  eq x = genericEq x

instance _Show_Rule :: Show ty => Show (RuleF ty) where
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
  = PropF LatticeType Name

type ConcreteProp
  = PropF LatticeType Void

data PropF ty x
  = Prop Name (TermF ty x)

derive instance _Generic_PropF :: Generic (PropF ty x) _

derive instance _Functor_PropF :: Functor (PropF ty)

derive instance _Foldable_PropF :: Foldable (PropF ty)

derive instance _Traversable_PropF :: Traversable (PropF ty)

instance _Eq_PropF :: (Eq ty, Eq x) => Eq (PropF ty x) where
  eq x = genericEq x

instance _Show_PropF :: (Show ty, Show x) => Show (PropF ty x) where
  show x = genericShow x

type Term
  = TermF LatticeType Name

data TermF ty x
  = VarTerm ty x
  | UnitTerm ty
  | LeftTerm ty (TermF ty x)
  | RightTerm ty (TermF ty x)
  | PairTerm ty (TermF ty x) (TermF ty x)
  | SetTerm ty (Array (TermF ty x))

derive instance _Generic_TermF :: Generic (TermF ty x) _

instance _Eq_Term :: (Eq ty, Eq x) => Eq (TermF ty x) where
  eq x = genericEq x

instance _Show_Term :: (Show ty, Show x) => Show (TermF ty x) where
  show x = genericShow x

derive instance _Functor_TermF :: Functor (TermF ty)

derive instance _Foldable_TermF :: Foldable (TermF ty)

derive instance _Traversable_TermF :: Traversable (TermF ty)

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
substTerm sigma (VarTerm lty x) = Map.lookup x sigma # fromMaybe (VarTerm lty x)

substTerm _sigma (UnitTerm lty) = UnitTerm lty

substTerm sigma (LeftTerm lty t) = LeftTerm lty (substTerm sigma t)

substTerm sigma (RightTerm lty t) = RightTerm lty (substTerm sigma t)

substTerm sigma (PairTerm lty s t) = PairTerm lty (substTerm sigma s) (substTerm sigma t)

substTerm sigma (SetTerm lty ts) = SetTerm lty (ts <#> substTerm sigma)

compareProp :: Prop -> Prop -> Maybe LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) =
  if p1 == p2 then
    compareTerm t1 t2
  else
    Nothing

freshName :: Unit -> Name
freshName _ = unsafeCrashWith "freshName"

-- | Requires the terms to have the same type type.
compareTerm :: Term -> Term -> Maybe LatticeOrdering
compareTerm (VarTerm ty1 x1) (VarTerm ty2 x2) =
  Equal
    ( Map.fromFoldable
        [ x1 /\ VarTerm ty1 (freshName unit)
        , x2 /\ VarTerm ty2 (freshName unit)
        ]
    )
    # Just

compareTerm (VarTerm ty1 x1) t2 =
  GreaterThan
    (Map.singleton x1 t2)
    # Just

compareTerm t1 (VarTerm ty2 x2) =
  LessThan
    (Map.singleton x2 t1)
    # Just

compareTerm (UnitTerm _) (UnitTerm _) =
  Equal Map.empty
    # Just

compareTerm (LeftTerm _ t1) (LeftTerm _ t2) = compareTerm t1 t2

compareTerm (LeftTerm _ t1) (RightTerm _ t2) = compareTerm t1 t2

compareTerm (RightTerm _ t1) (LeftTerm _ t2) = compareTerm t1 t2

compareTerm (RightTerm _ t1) (RightTerm _ t2) = compareTerm t1 t2

compareTerm t1 t2 = unsafeCrashWith "comapreTerm"

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

type Err
  = { source :: String
    , description :: String
    }
