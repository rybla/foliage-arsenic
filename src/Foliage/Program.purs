module Foliage.Program where

import Prelude
import Data.Either (Either(..))
import Data.Eq.Generic (genericEq)
import Data.Foldable (null)
import Data.Generic.Rep (class Generic)
import Data.List (List(..))
import Data.Map (Map)
import Data.Maybe (Maybe(..))
import Data.Show.Generic (genericShow)
import Data.Tuple.Nested (type (/\), (/\))

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
    { name :: String
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
  | SumLatticeType SumOrdering LatticeType LatticeType
  | ProductLatticeType ProductOrdering LatticeType LatticeType
  | SetLatticeType SetOrdering LatticeType

derive instance _Generic_LatticeType :: Generic LatticeType _

instance _Eq_LatticeType :: Eq LatticeType where
  eq x = genericEq x

instance _Show_LatticeType :: Show LatticeType where
  show x = genericShow x

data SumOrdering
  = SumOrdering

derive instance _Generic_SumOrdering :: Generic SumOrdering _

instance _Eq_SumOrdering :: Eq SumOrdering where
  eq x = genericEq x

instance _Show_SumOrdering :: Show SumOrdering where
  show x = genericShow x

data ProductOrdering
  = ProductOrdering

derive instance _Generic_ProductOrdering :: Generic ProductOrdering _

instance _Eq_ProductOrdering :: Eq ProductOrdering where
  eq x = genericEq x

instance _Show_ProductOrdering :: Show ProductOrdering where
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
    { params :: Map Name LatticeType
    , hypotheses :: List Prop
    , conclusion :: Prop
    }

derive instance _Generic_Rule :: Generic Rule _

instance _Eq_Rule :: Eq Rule where
  eq x = genericEq x

instance _Show_Rule :: Show Rule where
  show x = genericShow x

type NoParamsNorHypothesisRule
  = { conclusion :: Prop }

fromNoParamsNorHypothesesRule :: Rule -> Maybe NoParamsNorHypothesisRule
fromNoParamsNorHypothesesRule (Rule rule)
  | null rule.params
  , null rule.hypotheses = Just { conclusion: rule.conclusion }

fromNoParamsNorHypothesesRule _ = Nothing

fromNoHypothesesRule :: Rule -> Maybe NoHypothesisRule
fromNoHypothesesRule (Rule rule)
  | null rule.hypotheses =
    Just
      { params: rule.params
      , conclusion: rule.conclusion
      }

fromNoHypothesesRule _ = Nothing

type NoHypothesisRule
  = { params :: Map Name LatticeType
    , conclusion :: Prop
    }

nextHypothesis ::
  Rule ->
  Either
    NoHypothesisRule
    (Prop /\ Rule)
nextHypothesis (Rule rule) = case rule.hypotheses of
  Nil -> Left { params: rule.params, conclusion: rule.conclusion }
  Cons p ps -> Right (p /\ Rule rule { hypotheses = ps })

data Prop
  = Prop Name Term

derive instance _Generic_Prop :: Generic Prop _

instance _Eq_Prop :: Eq Prop where
  eq x = genericEq x

instance _Show_Prop :: Show Prop where
  show x = genericShow x

data Term
  = VarTerm Name
  | UnitTerm
  | LeftTerm Term
  | RightTerm Term
  | PairTerm Term Term
  | SetTerm (Array Term)

derive instance _Generic_Term :: Generic Term _

instance _Eq_Term :: Eq Term where
  eq x = genericEq x

instance _Show_Term :: Show Term where
  show x = genericShow x

newtype Name
  = Name String

derive newtype instance _Eq_Name :: Eq Name

derive newtype instance _Ord_Name :: Ord Name

derive newtype instance _Show_Name :: Show Name

mainModuleName :: Name
mainModuleName = Name "Main"
