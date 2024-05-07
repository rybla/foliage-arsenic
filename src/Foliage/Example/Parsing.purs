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
import Data.String.CodeUnits as CodeUnits
import Data.String.CodeUnits as String.CodeUnits
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Common (Exc(..), Opaque(..), _error)
import Foliage.Example.Library (left, pair, prod12, right, sumLIR)
import Foliage.Example.Library as Library
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
nat :: Lazy Program
nat =
  Lazy.defer \_ ->
    let
      input = [ "S", "S", "Z" ]
    in
      Program
        { name: FixedName ("Parsing . Nat")
        , doc:
            [ [ "This program implements a parser for the following context-free grammar:"
              , ""
              , ""
              , "The input string is: "
              , ""
              , "    " <> (input # Array.intercalate "")
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
                      ]
                        # Map.fromFoldable
                  , latticeTypeDefs:
                      [ name."Int" /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare."Int" }
                      , name."String" /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare."String" }
                      , name."Index" /\ LatticeTypeDef (DiscreteLatticeType ltyInt)
                      , name."Symbol" /\ LatticeTypeDef (DiscreteLatticeType ltyString)
                      , name."Ast"
                          /\ LatticeTypeDef
                              ( (ltySymbol `prod12` ltyAst) -- S N
                                  `sumLIR`
                                    ltySymbol -- Z
                              )
                      ]
                        # Map.fromFoldable
                  , functionDefs:
                      []
                        # Map.fromFoldable
                  , relations:
                      [ name."Token" /\ Relation { domain: ltySymbol `prod12` (ltyIndex `prod12` ltyIndex) }
                      , name."Parse" /\ Relation { domain: ltyAst `prod12` (ltyIndex `prod12` ltyIndex) }
                      ]
                        # Map.fromFoldable
                  , rules:
                      [ [ let
                            i0 = newVarName "i0"

                            i1 = newVarName "i1"
                          in
                            FixedName "Z"
                              /\ Rule
                                  { hypotheses:
                                      [ Hypothesis (token (LiteralTerm "Z" dtyString) (VarTerm i0) (VarTerm i1)) []
                                      ]
                                        # List.fromFoldable
                                  , conclusion:
                                      parse (right (LiteralTerm "Z" dtyString)) (VarTerm i0) (VarTerm i1)
                                  }
                        , let
                            n = newVarName "n"

                            i0 = newVarName "i0"

                            i1 = newVarName "i1"

                            i2 = newVarName "i2"
                          in
                            FixedName "S"
                              /\ Rule
                                  { hypotheses:
                                      [ Hypothesis (token (LiteralTerm "S" dtyString) (VarTerm i0) (VarTerm i1)) []
                                      , Hypothesis (parse (VarTerm n) (VarTerm i1) (VarTerm i2)) []
                                      ]
                                        # List.fromFoldable
                                  , conclusion:
                                      parse (left (LiteralTerm "S" dtyString `pair` VarTerm n)) (VarTerm i0) (VarTerm i2)
                                  }
                        ]
                      , compileInput input
                      ]
                        # Array.concat
                        # Map.fromFoldable
                  }
              )
        }
  where
  compileInput :: Array String -> Array (FixedName /\ Rule)
  compileInput ss =
    ss
      # Array.mapWithIndex \i s ->
          (FixedName (s <> "#" <> show i))
            /\ Rule
                { hypotheses: mempty
                , conclusion: token (LiteralTerm s (NamedDataType name."String")) (LiteralTerm (show i) (NamedDataType name."Int")) (LiteralTerm (show (i + 1)) (NamedDataType name."Int"))
                }

  token :: Term -> Term -> Term -> Prop
  token str i j = Prop name."Token" (str `pair` (i `pair` j))

  parse :: Term -> Term -> Term -> Prop
  parse ast i j = Prop name."Parse" (ast `pair` (i `pair` j))

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
ltyInt = NamedLatticeType name."Int"

ltyString = NamedLatticeType name."String"

ltySymbol = NamedLatticeType name."Symbol"

ltyIndex = NamedLatticeType name."Index"

ltyAst = NamedLatticeType name."Ast"

dtyString = NamedDataType name."String"

name :: Record _
name =
  { "Int": "Int"
  , "Index": "Index"
  , "Symbol": "Symbol"
  , "Token": "Token"
  , "Parse": "Parse"
  , "String": "String"
  , "Ast": "Ast"
  }
    # homogeneous
    # map FixedName
    # fromHomogeneous

-- from_StringList :: Term -> Either String (List String)
-- from_StringList = case _ of
--   ConTerm "cons" (PairTerm (LiteralTerm s (NamedDataType (VarName "String" _))) t) -> Cons s <$> from_StringList t
--   ConTerm "nil" UnitTerm -> pure mempty
--   _ -> throwError "invalid"
function ::
  Record
    ( joinStrings :: Opaque "function" (Map String (TermF VarName) -> Either String (TermF VarName))
    )
function =
  ( { "joinStrings":
        \args -> do
          strs <-
            args
              # Map.lookup "strs"
              # maybe (throwError "did not find arg for parameter 'strs'") (todo "joinStringList" :: _ -> Either _ (List _))
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
              ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map VarName Term)
            )
      )
    # map (Opaque (Proxy :: Proxy "compare"))
    # fromHomogeneous

-- --------------------------------------------------------------------------------
-- -- Examples
-- --------------------------------------------------------------------------------
-- abc :: Lazy Program
-- abc =
--   make_parsing "ABC"
--     ( Grammar
--         [ "A" /\ [ "a", "b", "c" ]
--         ]
--     )
--     ( Input
--         ( "abc"
--             # String.CodeUnits.toCharArray
--             # map (String.CodeUnits.fromCharArray <<< pure)
--         )
--     )
-- nat :: Lazy Program
-- nat =
--   make_parsing "Nat"
--     ( Grammar
--         [ "N" /\ [ "S", "N" ]
--         , "N" /\ [ "Z" ]
--         ]
--     )
--     ( Input
--         ( "SSSZ"
--             # String.CodeUnits.toCharArray
--             # map (String.CodeUnits.fromCharArray <<< pure)
--         )
--     )
-- -- so yeah, this works, but it's not obvious in the output since Parse 0 5 looks
-- -- the same no matter the derivation
-- ambiguous :: Lazy Program
-- ambiguous =
--   make_parsing "Ambiguous"
--     ( Grammar
--         [ "Term" /\ [ "Term", "+", "Term" ]
--         , "Term" /\ [ "x" ]
--         , "Term" /\ [ "y" ]
--         , "Term" /\ [ "z" ]
--         ]
--     )
--     ( Input
--         ( "x+y+z"
--             # String.CodeUnits.toCharArray
--             # map (String.CodeUnits.fromCharArray <<< pure)
--         )
--     )
-- binary_tree :: Lazy Program
-- binary_tree =
--   make_parsing "Binary Tree"
--     ( Grammar
--         [ "A" /\ [ "(", "A", "A", ")" ]
--         , "A" /\ [ "•" ]
--         ]
--     )
--     ( Input
--         ( "((••)(••))"
--             # String.CodeUnits.toCharArray
--             # map (String.CodeUnits.fromCharArray <<< pure)
--         )
--     )
-- --------------------------------------------------------------------------------
-- -- Definitions
-- --------------------------------------------------------------------------------
-- name :: Record _
-- name =
--   { "Int": "Int"
--   , "Index": "Index"
--   , "Symbol": "Symbol"
--   , "Parse": "Parse"
--   , "String": "String"
--   , "Ast": "Ast"
--   }
--     # homogeneous
--     # map newVarName
--     # fromHomogeneous
-- -- from_StringList :: Term -> Either String (List String)
-- -- from_StringList = case _ of
-- --   ConTerm "cons" (PairTerm (LiteralTerm s (NamedDataType (VarName "String" _))) t) -> Cons s <$> from_StringList t
-- --   ConTerm "nil" UnitTerm -> pure mempty
-- --   _ -> throwError "invalid"
-- function ::
--   Record
--     ( joinStrings :: Opaque "function" (Map String (TermF VarName) -> Either String (TermF VarName))
--     )
-- function =
--   ( { "joinStrings":
--         \args -> do
--           strs <-
--             args
--               # Map.lookup "strs"
--               # maybe (throwError "did not find arg for parameter 'strs'") (todo "joinStringList" :: _ -> Either _ (List _))
--               # map Array.fromFoldable
--           if Array.length strs <= 2 then
--             pure (LiteralTerm (String.joinWith "" strs) (NamedDataType name."String"))
--           else
--             pure (LiteralTerm ("[" <> String.joinWith "" strs <> "]") (NamedDataType name."String"))
--     }
--       # homogeneous
--       # map (Opaque (Proxy :: Proxy "function")) ::
--       Homogeneous
--         ( joinStrings :: Void
--         )
--         (Opaque "function" (Map String Term -> Either String Term))
--   )
--     # fromHomogeneous
-- compare :: Record _
-- compare =
--   { "Int":
--       case _ of
--         LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
--           | n1 == name."Int" && n2 == name."Int" -> do
--             x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
--             x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
--             pure (Prelude.compare x1 x2 /\ empty)
--         t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })
--   , "String":
--       case _ of
--         LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
--           | n1 == name."String" && n2 == name."String" -> do
--             pure (Prelude.compare s1 s2 /\ empty)
--         t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.String", description: "inputs are not literal Strings: " <> show t1 <> ", " <> show t2 })
--   }
--     # ( homogeneous ::
--           Record _ ->
--           Homogeneous _
--             ( Term /\ Term ->
--               ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map VarName Term)
--             )
--       )
--     # map (Opaque (Proxy :: Proxy "compare"))
--     # fromHomogeneous
-- --------------------------------------------------------------------------------
-- -- Program
-- --------------------------------------------------------------------------------
-- ltyInt = NamedLatticeType name."Int"
-- ltyString = NamedLatticeType name."String"
-- ltySymbol = NamedLatticeType name."Symbol"
-- ltyIndex = NamedLatticeType name."Index"
-- ltyAst = NamedLatticeType name."Ast"
-- make_parsing :: String -> Grammar -> Input -> Lazy Program
-- make_parsing label grammar@(Grammar grammar_rules) input@(Input input_string) =
--   Lazy.defer \_ ->
--     Program
--       { name: newVarName ("Parsing . " <> label)
--       , doc:
--           [ [ "This program implements a parser for the following context-free grammar:"
--             , ""
--             ]
--           , grammar_rules <#> \(s /\ ss) -> "    " <> s <> " → " <> (ss # Array.intercalate "")
--           , [ ""
--             , "The input string is: "
--             , ""
--             , "    " <> (input_string # Array.intercalate "")
--             , ""
--             ]
--           ]
--             # Array.concat
--             # Array.intercalate "\n"
--             # Just
--       , modules:
--           Map.singleton mainModuleName
--             ( Module
--                 { name: mainModuleName
--                 , doc: Nothing
--                 , initialGas: 40
--                 , dataTypeDefs:
--                     [ name."Int" /\ ExternalDataTypeDef "Int"
--                     , name."String" /\ ExternalDataTypeDef "String"
--                     ]
--                       # Map.fromFoldable
--                 , latticeTypeDefs:
--                     [ name."Int" /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare."Int" }
--                     , name."String" /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare."String" }
--                     , name."Index" /\ LatticeTypeDef (DiscreteLatticeType ltyInt)
--                     , name."Symbol" /\ LatticeTypeDef (DiscreteLatticeType ltyString)
--                     , name."Ast"
--                         /\ LatticeTypeDef
--                             ( ?a
--                                 `sumLIR`
--                                   ?a
--                             )
--                     ]
--                       # Map.fromFoldable
--                 , functionDefs:
--                     []
--                       # Map.fromFoldable
--                 , relations:
--                     [ name."Parse" /\ Relation { domain: (ltySymbol `lex` ltyAst) `lex` (ltyIndex `lex` ltyIndex) }
--                     ]
--                       # Map.fromFoldable
--                 , rules:
--                     [ compileGrammar grammar
--                     , compileInput input
--                     ]
--                       # Array.concat
--                       # Map.fromFoldable
--                 }
--             )
--       }
-- lex :: LatticeType -> LatticeType -> LatticeType
-- lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering
-- pair :: Term -> Term -> Term
-- pair = PairTerm
-- parse :: String -> Term -> Term -> Term -> Prop
-- parse sym str i j =
--   Prop name."Parse"
--     ( (LiteralTerm sym (NamedDataType name."String") `pair` str)
--         `pair`
--           (i `pair` j)
--     )
-- --------------------------------------------------------------------------------
-- -- Intermediate grammar representation
-- --------------------------------------------------------------------------------
-- -- | Simple CFG defined by an array of production rules of the form
-- -- |
-- -- | ```
-- -- | Nonterminal ::= (Terminal|Nonterminal)+
-- -- | ```
-- data Grammar
--   = Grammar (Array (String /\ Array String))
-- compileGrammar :: Grammar -> Array (VarName /\ Rule)
-- compileGrammar (Grammar prods) =
--   prods
--     # Array.mapWithIndex \i (nt /\ rhs) ->
--         newVarName (nt <> "#" <> show i)
--           /\ let
--               make_index_var j = VarTerm (newVarName ("j" <> show j))
--               make_str_var j = VarTerm (newVarName ("s" <> show j))
--               res_var_name = newVarName "res"
--               res_var = VarTerm res_var_name
--             in
--               Rule
--                 { hypotheses:
--                     rhs
--                       # Array.mapWithIndex (\j s -> Hypothesis (parse s (make_str_var j) (make_index_var j) (make_index_var (j + 1))) [])
--                       # Array.modifyAt (Array.length rhs - 1)
--                           ( \(Hypothesis prop _) ->
--                               Hypothesis prop
--                                 -- [ FunctionSideHypothesis
--                                 --     { resultVarVarName: res_var_name
--                                 --     , functionName: name."joinStrings"
--                                 --     , args:
--                                 --         [ rhs
--                                 --             # (Array.mapWithIndex \k _ -> make_str_var k)
--                                 --             -- # (\ts -> [ LiteralTerm "⟬" (NamedDataType name."String") ] <> ts <> [ LiteralTerm "⟭" (NamedDataType name."String") ])
--                                 --             # todo "Array.foldr (\\h t -> ConTerm \"cons\" (h `pair` t)) (ConTerm \"nil\" UnitTerm)"
--                                 --         ]
--                                 --     }
--                                 -- ]
--                                 []
--                           )
--                       # Unsafe.fromJust "impossible"
--                       # List.fromFoldable
--                 , conclusion: parse nt res_var (make_index_var 0) (make_index_var (Array.length rhs))
--                 }
-- -- | Input array of terminal
-- data Input
--   = Input (Array String)
-- compileInput :: Input -> Array (VarName /\ Rule)
-- compileInput (Input ss) =
--   ss
--     # Array.mapWithIndex \i s ->
--         (newVarName (s <> "#" <> show i))
--           /\ Rule
--               { hypotheses: mempty
--               , conclusion: parse s (LiteralTerm s (NamedDataType name."String")) (LiteralTerm (show i) (NamedDataType name."Int")) (LiteralTerm (show (i + 1)) (NamedDataType name."Int"))
--               }
