module Foliage.Example.Typing where

import Data.Either.Nested
import Data.Tuple.Nested
import Foliage.Program
import Prelude
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT)
import Control.Plus (empty)
import Data.Array as Array
import Data.Either (Either(..), either)
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
import Data.String.CodeUnits (toCharArray)
import Data.String.CodeUnits as String.CodeUnits
import Foliage.Common (Exc(..), Opaque(..), _error)
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
-- TODO: examples
--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name :: Record _
name =
  { "Int": "Int"
  , "Index": "Index"
  , "Symbol": "Symbol"
  , "Typed": "Typed"
  , "String": "String"
  }
    # homogeneous
    # map Name
    # fromHomogeneous

function :: Record _
function =
  ( {}
      # homogeneous
      # map (Opaque (Proxy :: Proxy "function")) ::
      Homogeneous _ (Opaque "function" (Map String Term -> Either String Term))
  )
    # fromHomogeneous

compare :: Record _
compare =
  { "Int":
      case _ of
        LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
          | n1 == name."Int" && n2 == name."Int" -> do
            x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
            x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
            pure (Prelude.compare x1 x2 /\ empty)
        t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })
  , "String":
      case _ of
        LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
          | n1 == name."String" && n2 == name."String" -> do
            pure (Prelude.compare s1 s2 /\ empty)
        t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.String", description: "inputs are not literal Strings: " <> show t1 <> ", " <> show t2 })
  }
    # ( homogeneous ::
          Record _ ->
          Homogeneous _
            ( Term /\ Term ->
              ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map Name Term)
            )
      )
    # map (Opaque (Proxy :: Proxy "compare"))
    # fromHomogeneous

--------------------------------------------------------------------------------
-- Program
--------------------------------------------------------------------------------
make_typing :: Lazy Program
make_typing =
  Lazy.defer \_ ->
    todo ""

lex :: LatticeType -> LatticeType -> LatticeType
lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering

pair :: Term -> Term -> Term
pair = PairTerm

typed :: String -> Term -> Term -> Term -> Prop
typed sym str i j =
  Prop name."Typed"
    ( (LiteralTerm sym (NamedDataType name."String") `pair` str)
        `pair`
          (i `pair` j)
    )

--------------------------------------------------------------------------------
-- Intermediate typing rules representation
--------------------------------------------------------------------------------
data Lang = Lang  (Array (String /\ Array (String)))
