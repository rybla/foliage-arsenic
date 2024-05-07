module Foliage.Example.Library where

import Prelude
import Foliage.Program
import Control.Monad.Error.Class (throwError)
import Control.Plus (empty)
import Data.Array as Array
import Data.Either (Either)
import Data.Homogeneous.Record (Homogeneous, fromHomogeneous, homogeneous)
import Data.Int as Int
import Data.List (List(..))
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe, maybe)
import Data.String as String
import Data.Tuple.Nested ((/\))
import Foliage.Common (Exc(..), Opaque(..), _error)
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe (todo)

name :: Record _
name =
  { "": ""
  -- external type
  , "Int": "Int"
  , "String": "String"
  , "List String": "List String"
  -- type
  , "Index": "Index"
  , "Symbol": "Symbol"
  -- function
  , "joinStrings": "joinStrings"
  -- relation
  }
    # homogeneous
    # map FixedName
    # fromHomogeneous

-- from_StringList :: Term -> Either String (List String)
-- from_StringList = case _ of
--   ConTerm "cons" (PairTerm (LiteralTerm s (NamedDataType (VarName "String" _))) t) -> Cons s <$> from_StringList t
--   ConTerm "nil" UnitTerm -> pure mempty
--   _ -> throwError "invalid"
function :: Record _
function =
  ( { "joinStrings":
        \args -> do
          strs <-
            args
              # Map.lookup "strs"
              -- # maybe (throwError "did not find arg for parameter 'strs'") from_StringList
              
              # (todo "joinStrings" :: Maybe _ -> Either String (List _))
              # map Array.fromFoldable
          if Array.length strs <= 2 then
            pure (LiteralTerm (String.joinWith "" strs) (NamedDataType name."String"))
          else
            pure (LiteralTerm ("[" <> String.joinWith "" strs <> "]") (NamedDataType name."String"))
    }
      # homogeneous
      # map (Opaque (Proxy :: Proxy "function")) ::
      Homogeneous
        ( joinStrings :: Void
        )
        (Opaque "function" (Map String Term -> Either String Term))
  )
    # fromHomogeneous

dataTypeDefs :: Map FixedName DataTypeDef
dataTypeDefs =
  [ name."Int" /\ ExternalDataTypeDef "Int"
  , name."String" /\ ExternalDataTypeDef "String"
  , name."List String" /\ ExternalDataTypeDef "List String"
  ]
    # Map.fromFoldable

latticeTypeDefs :: Map FixedName LatticeTypeDef
latticeTypeDefs =
  [ name."Int"
      /\ ExternalLatticeTypeDef
          { name: "Int"
          , compare_impl:
              Opaque Proxy case _ of
                LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
                  | n1 == name."Int" && n2 == name."Int" -> do
                    x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
                    x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
                    pure (Prelude.compare x1 x2 /\ empty)
                t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })
          }
  , name."String"
      /\ ExternalLatticeTypeDef
          { name: "String"
          , compare_impl:
              Opaque Proxy case _ of
                LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
                  | n1 == name."String" && n2 == name."String" -> do
                    pure (Prelude.compare s1 s2 /\ empty)
                t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.String", description: "inputs are not literal Strings: " <> show t1 <> ", " <> show t2 })
          }
  , name."Index" /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType name."Int"))
  , name."Symbol" /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType name."String"))
  ]
    # Map.fromFoldable

functionDefs :: Map FixedName FunctionDef
functionDefs =
  [ name."joinStrings"
      /\ ExternalFunctionDef
          { name: "joinStrings"
          , inputs: [ "strs" /\ NamedDataType name."List String" ]
          , output: NamedDataType name."String"
          , impl: function."joinStrings"
          }
  ]
    # Map.fromFoldable

relations :: Map FixedName Relation
relations = empty

rules :: Map FixedName Rule
rules = empty

sumLir :: LatticeType -> LatticeType -> LatticeType
sumLir = SumLatticeType LeftIncomparableRight_SumLatticeTypeOrdering

sumLgtr :: LatticeType -> LatticeType -> LatticeType
sumLgtr = SumLatticeType LeftGreaterThanRight_SumLatticeTypeOrdering

sumLltr :: LatticeType -> LatticeType -> LatticeType
sumLltr = SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering

sumLeqr :: LatticeType -> LatticeType -> LatticeType
sumLeqr = SumLatticeType LeftEqualRight_SumLatticeTypeOrdering

left :: Term -> Term
left = LeftTerm

right :: Term -> Term
right = RightTerm

prod12 :: LatticeType -> LatticeType -> LatticeType
prod12 = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering

pair :: Term -> Term -> Term
pair = PairTerm

ltyUnit = UnitLatticeType

termUnit = UnitTerm
