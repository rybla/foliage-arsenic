module Foliage.Example.Parsing where

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
import Data.String.CodeUnits as String.CodeUnits
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Common (Exc(..), Opaque(..), _error)
import Foliage.Example.Library as Library
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
abc :: Lazy Program
abc =
  make_parsing "ABC"
    ( Grammar
        [ "A" /\ [ "a", "b", "c" ]
        ]
    )
    ( Input
        ( "abc"
            # String.CodeUnits.toCharArray
            # map (String.CodeUnits.fromCharArray <<< pure)
        )
    )

nat :: Lazy Program
nat =
  make_parsing "Nat"
    ( Grammar
        [ "N" /\ [ "S", "N" ]
        , "N" /\ [ "Z" ]
        ]
    )
    ( Input
        ( "SSSZ"
            # String.CodeUnits.toCharArray
            # map (String.CodeUnits.fromCharArray <<< pure)
        )
    )

-- so yeah, this works, but it's not obvious in the output since Parse 0 5 looks
-- the same no matter the derivation
ambiguous :: Lazy Program
ambiguous =
  make_parsing "Ambiguous"
    ( Grammar
        [ "Term" /\ [ "Term", "+", "Term" ]
        , "Term" /\ [ "x" ]
        , "Term" /\ [ "y" ]
        , "Term" /\ [ "z" ]
        ]
    )
    ( Input
        ( "x+y+z"
            # String.CodeUnits.toCharArray
            # map (String.CodeUnits.fromCharArray <<< pure)
        )
    )

binary_tree :: Lazy Program
binary_tree =
  make_parsing "Binary Tree"
    ( Grammar
        [ "A" /\ [ "(", "A", "A", ")" ]
        , "A" /\ [ "•" ]
        ]
    )
    ( Input
        ( "((••)(••))"
            # String.CodeUnits.toCharArray
            # map (String.CodeUnits.fromCharArray <<< pure)
        )
    )

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name ::
  Record
    ( "Index" :: Name
    , "Int" :: Name
    , "List String" :: Name
    , "Parse" :: Name
    , "String" :: Name
    , "Symbol" :: Name
    , joinStrings :: Name
    )
name =
  { "Int": "Int"
  , "Index": "Index"
  , "Symbol": "Symbol"
  , "Parse": "Parse"
  , "String": "String"
  , "List String": "List String"
  , "joinStrings": "joinStrings"
  }
    # homogeneous
    # map Name
    # fromHomogeneous

from_StringList :: Term -> Either String (List String)
from_StringList = case _ of
  ConTerm "cons" (PairTerm (LiteralTerm s (NamedDataType (Name "String"))) t) -> Cons s <$> from_StringList t
  ConTerm "nil" UnitTerm -> pure mempty
  _ -> throwError "invalid"

function ::
  Record
    ( joinStrings :: Opaque "function" (Map String (TermF Name) -> Either String (TermF Name))
    )
function =
  ( { "joinStrings":
        \args -> do
          strs <-
            args
              # Map.lookup "strs"
              # maybe (throwError "did not find arg for parameter 'strs'") from_StringList
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
make_parsing :: String -> Grammar -> Input -> Lazy Program
make_parsing label grammar@(Grammar grammar_rules) input@(Input input_string) =
  Lazy.defer \_ ->
    Program
      { name: Name ("Parsing . " <> label)
      , doc:
          [ [ "This program implements a parser for the following context-free grammar:"
            , ""
            ]
          , grammar_rules <#> \(s /\ ss) -> "    " <> s <> " → " <> (ss # Array.intercalate "")
          , [ ""
            , "The input string is: "
            , ""
            , "    " <> (input_string # Array.intercalate "")
            , ""
            ]
          ]
            # Array.concat
            # Array.intercalate "\n"
            # Just
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , doc: Nothing
                , initialGas: 40
                , dataTypeDefs:
                    [ name."Int" /\ ExternalDataTypeDef "Int"
                    , name."String" /\ ExternalDataTypeDef "String"
                    , name."List String" /\ ExternalDataTypeDef "List String"
                    ]
                      # Map.fromFoldable
                , latticeTypeDefs:
                    [ name."Int" /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare."Int" }
                    , name."String" /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare."String" }
                    , name."Index" /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType name."Int"))
                    , name."Symbol" /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType name."String"))
                    ]
                      # Map.fromFoldable
                , functionDefs:
                    [ name."joinStrings" /\ ExternalFunctionDef { name: "joinStrings", inputs: [ "strs" /\ NamedDataType name."List String" ], output: NamedDataType name."String", impl: function."joinStrings" } ]
                      # Map.fromFoldable
                , relations:
                    [ name."Parse" /\ Relation { domain: (NamedLatticeType name."Symbol" `lex` NamedLatticeType name."Symbol") `lex` (NamedLatticeType name."Index" `lex` NamedLatticeType name."Index") }
                    ]
                      # Map.fromFoldable
                , rules:
                    [ compileGrammar grammar
                    , compileInput input
                    ]
                      # Array.concat
                      # Map.fromFoldable
                }
            )
      }

lex :: LatticeType -> LatticeType -> LatticeType
lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering

pair :: Term -> Term -> Term
pair = PairTerm

parse :: String -> Term -> Term -> Term -> Prop
parse sym str i j =
  Prop name."Parse"
    ( (LiteralTerm sym (NamedDataType name."String") `pair` str)
        `pair`
          (i `pair` j)
    )

--------------------------------------------------------------------------------
-- Intermediate grammar representation
--------------------------------------------------------------------------------
-- | Simple CFG defined by an array of production rules of the form
-- |
-- | ```
-- | Nonterminal ::= (Terminal|Nonterminal)+
-- | ```
data Grammar
  = Grammar (Array (String /\ Array String))

compileGrammar :: Grammar -> Array (Name /\ Rule)
compileGrammar (Grammar prods) =
  prods
    # Array.mapWithIndex \i (nt /\ rhs) ->
        Name (nt <> "#" <> show i)
          /\ let
              make_index_var j = VarTerm (Name ("j" <> show j))

              make_str_var j = VarTerm (Name ("s" <> show j))

              res_var_name = Name "res"

              res_var = VarTerm res_var_name
            in
              Rule
                { hypotheses:
                    rhs
                      # Array.mapWithIndex (\j s -> Hypothesis (parse s (make_str_var j) (make_index_var j) (make_index_var (j + 1))) [])
                      # Array.modifyAt (Array.length rhs - 1)
                          ( \(Hypothesis prop _) ->
                              Hypothesis prop
                                [ FunctionSideHypothesis
                                    { resultVarName: res_var_name
                                    , functionName: name."joinStrings"
                                    , args:
                                        [ rhs
                                            # (Array.mapWithIndex \k _ -> make_str_var k)
                                            -- # (\ts -> [ LiteralTerm "⟬" (NamedDataType name."String") ] <> ts <> [ LiteralTerm "⟭" (NamedDataType name."String") ])
                                            
                                            # Array.foldr (\h t -> ConTerm "cons" (h `pair` t)) (ConTerm "nil" UnitTerm)
                                        ]
                                    }
                                ]
                          )
                      # Unsafe.fromJust "impossible"
                      # List.fromFoldable
                , conclusion: parse nt res_var (make_index_var 0) (make_index_var (Array.length rhs))
                }

-- | Input array of terminal
data Input
  = Input (Array String)

compileInput :: Input -> Array (Name /\ Rule)
compileInput (Input ss) =
  ss
    # Array.mapWithIndex \i s ->
        (Name (s <> "#" <> show i))
          /\ Rule
              { hypotheses: mempty
              , conclusion: parse s (LiteralTerm s (NamedDataType name."String")) (LiteralTerm (show i) (NamedDataType name."Int")) (LiteralTerm (show (i + 1)) (NamedDataType name."Int"))
              }
