module Foliage.Example.ShiftReduceParsing where

import Foliage.Program
import Prelude
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT)
import Control.Plus (empty)
import Data.Array as Array
import Data.Either (Either)
import Data.Homogeneous.Record (Homogeneous, fromHomogeneous, homogeneous)
import Data.Identity (Identity)
import Data.Int as Int
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List (List(..))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.String as String
import Data.String.CodeUnits as CodeUnits
import Data.String.CodeUnits as String.CodeUnits
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Common (Exc(..), Htmls, Opaque(..), Html, _error)
import Foliage.Example.Library (left, ltyUnit, pair, prod12, right, sumLgtr, sumLir, sumLltr, termUnit)
import Foliage.Example.Library as Library
import Halogen.HTML as HH
import Partial.Unsafe (unsafeCrashWith)
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
test :: Lazy Module
test =
  Lazy.defer \_ ->
    let
      input = []
    in
      Module
        { name: FixedName "Shift-Reduce Parsing . Nat"
        , doc: "TODO" # Just
        , initialGas: 50
        , dataTypeDefs:
            [ dtyd_Int
            , dtyd_String
            ]
              # Map.fromFoldable
        , latticeTypeDefs:
            [ ltyd_Int
            , ltyd_String
            , ltyd_Index
            , ltyd_Symbol
            ]
              # Map.fromFoldable
        , functionDefs: [] # Map.fromFoldable
        , relations:
            -- [ name_Parse
            --     /\ Relation
            --         { domain: lty_Index `prod12` lty_List_Token `prod12` lty_List_Token `prod12` ?a
            --         , render: todo "Parse.render"
            --         , canonical_term: todo "Parse.canonical_term"
            --         }
            -- ]
            []
              # Map.fromFoldable
        , rules: [] # Map.fromFoldable
        }

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name_Int = FixedName "Int"

name_String = FixedName "String"

name_Symbol = FixedName "Symbol"

name_Index = FixedName "Index"

lty_Int = NamedLatticeType name_Int

lty_String = NamedLatticeType name_String

lty_Symbol = NamedLatticeType name_Symbol

lty_Index = NamedLatticeType name_Index

dtyString = NamedDataType name_String

dtyd_Int = name_Int /\ ExternalDataTypeDef "Int"

ltyd_Int = name_Int /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare_Int }

ltyd_String = name_String /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare_String }

ltyd_Index = name_Index /\ LatticeTypeDef (FlatLatticeType lty_Int)

ltyd_Symbol = name_Symbol /\ LatticeTypeDef (FlatLatticeType lty_String)

compare_Int =
  Opaque (Proxy :: Proxy "compare") case _ of
    LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
      | n1 == FixedName "Int" && n2 == FixedName "Int" -> do
        x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
        x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
        pure (Prelude.compare x1 x2 /\ empty)
    t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })

dtyd_String = FixedName "String" /\ ExternalDataTypeDef "String"

compare_String =
  Opaque (Proxy :: Proxy "compare") case _ of
    LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
      | n1 == FixedName "String" && n2 == FixedName "String" -> do
        pure (Prelude.compare s1 s2 /\ empty)
    t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.String", description: "inputs are not literal Strings: " <> show t1 <> ", " <> show t2 })

name_Parse = FixedName "Parse"
