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
nat :: Lazy Module
nat =
  Lazy.defer \_ ->
    let
      doc =
        [ [ "This program implements a parser for the following context-free grammar:"
          , ""
          , "  N → Z"
          , "  N → SN"
          , ""
          , "The input string is: "
          , ""
          , "    " <> (input # Array.intercalate "")
          , ""
          ]
        ]
          # Array.concat
          # Array.intercalate "\n"

      input :: Array String
      input = [ "S", "S", "Z" ]

      latticeTypeDefs = [ name."Ast" /\ LatticeTypeDef (ltyAst `sumLir` ltyUnit) ]

      renderAst :: Term -> RenderM Htmls
      renderAst = case _ of
        LeftTerm s -> [ HH.text "S" :: Html ] ⊕ renderAst s ⊕ mempty
        RightTerm _z -> [ HH.text "Z" :: Html ] ⊕ mempty
        t -> render t

      rules =
        [ let
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
                      parse (right termUnit) (VarTerm i0) (VarTerm i1)
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
                      parse (left (VarTerm n)) (VarTerm i0) (VarTerm i2)
                  }
        ]
    in
      make_example { doc, input, latticeTypeDefs, renderAst, rules }

assoc :: Lazy Module
assoc =
  Lazy.defer \_ ->
    let
      doc =
        [ [ "This program implements a parser for the following context-free grammar:"
          , ""
          , "  E → x"
          , "  E → E + E"
          , ""
          , "The input string is: "
          , ""
          , "    " <> (input # Array.intercalate "")
          , ""
          ]
        ]
          # Array.concat
          # Array.intercalate "\n"

      input :: Array String
      input = "x+x+x" # CodeUnits.toCharArray # map (pure >>> CodeUnits.fromCharArray)

      latticeTypeDefs = [ name."Ast" /\ LatticeTypeDef ((ltyAst `prod12` ltyAst) `sumLir` ltyUnit) ]
      -- latticeTypeDefs = [ name."Ast" /\ LatticeTypeDef ((ltyAst `prod12` ltyAst) `sumLgtr` ltyUnit) ]
      -- latticeTypeDefs = [ name."Ast" /\ LatticeTypeDef ((ltyAst `prod12` ltyAst) `sumLltr` ltyUnit) ]

      renderAst :: Term -> RenderM Htmls
      renderAst = case _ of
        LeftTerm (PairTerm l r) -> [ HH.text "(" :: Html ] ⊕ renderAst l ⊕ [ HH.text "+" :: Html ] ⊕ renderAst r ⊕ [ HH.text ")" :: Html ] ⊕ mempty
        RightTerm _ -> [ HH.text "x" :: Html ] ⊕ mempty
        t -> render t

      rules =
        [ let
            i0 = newVarName "i0"

            i1 = newVarName "i1"
          in
            FixedName "x"
              /\ Rule
                  { hypotheses:
                      [ Hypothesis (token (LiteralTerm "x" dtyString) (VarTerm i0) (VarTerm i1)) []
                      ]
                        # List.fromFoldable
                  , conclusion:
                      parse (right termUnit) (VarTerm i0) (VarTerm i1)
                  }
        , let
            l = newVarName "l"

            r = newVarName "r"

            i0 = newVarName "i0"

            i1 = newVarName "i1"

            i2 = newVarName "i2"

            i3 = newVarName "i3"
          in
            FixedName "E + E"
              /\ Rule
                  { hypotheses:
                      [ Hypothesis (parse (VarTerm l) (VarTerm i0) (VarTerm i1)) []
                      , Hypothesis (token (LiteralTerm "+" dtyString) (VarTerm i1) (VarTerm i2)) []
                      , Hypothesis (parse (VarTerm r) (VarTerm i2) (VarTerm i3)) []
                      ]
                        # List.fromFoldable
                  , conclusion:
                      parse (left (VarTerm l `pair` VarTerm r)) (VarTerm i0) (VarTerm i3)
                  }
        ]
    in
      make_example { doc, input, latticeTypeDefs, renderAst, rules }

make_example ::
  forall a.
  Render a =>
  { doc :: String
  , input :: Array String
  , latticeTypeDefs :: Array (FixedName /\ LatticeTypeDef)
  , renderAst :: Term -> a
  , rules :: Array (FixedName /\ Rule)
  } ->
  Module
make_example spec =
  Module
    { name: FixedName ("Parsing . Nat")
    , doc: spec.doc # Just
    , initialGas: 40
    , dataTypeDefs:
        [ dataTypeDef_Int
        , dataTypeDef_String
        ]
          # Map.fromFoldable
    , latticeTypeDefs:
        [ [ latticeTypeDef_Int
          , latticeTypeDef_String
          , latticeTypeDef_Symbol
          , latticeTypeDef_Index
          ]
        , spec.latticeTypeDefs
        ]
          # Array.concat
          # Map.fromFoldable
    , functionDefs:
        []
          # Map.fromFoldable
    , relations:
        [ relation_Token
        , relation_Parse spec.renderAst
        ]
          # Map.fromFoldable
    , rules:
        [ compileInput spec.input
        , spec.rules
        ]
          # Array.concat
          # Map.fromFoldable
    }

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
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

ltyInt = NamedLatticeType name."Int"

ltyString = NamedLatticeType name."String"

ltySymbol = NamedLatticeType name."Symbol"

ltyIndex = NamedLatticeType name."Index"

ltyAst = NamedLatticeType name."Ast"

dtyString = NamedDataType name."String"

dataTypeDef_Int = name."Int" /\ ExternalDataTypeDef "Int"

latticeTypeDef_Int = name."Int" /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare."Int" }

dataTypeDef_String = name."String" /\ ExternalDataTypeDef "String"

latticeTypeDef_String = name."String" /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare."String" }

latticeTypeDef_Index = name."Index" /\ LatticeTypeDef (DiscreteLatticeType ltyInt)

latticeTypeDef_Symbol = name."Symbol" /\ LatticeTypeDef (DiscreteLatticeType ltyString)

relation_Token =
  name."Token"
    /\ Relation
        { domain: (ltyIndex `prod12` ltyIndex) `prod12` ltySymbol
        , render:
            case _ of
              PairTerm (PairTerm i0 i1) s -> do
                i0 <- i0 # render
                i1 <- i1 # render
                [ HH.sub_ i0 :: Html ] ⊕ s ⊕ [ HH.sub_ i1 :: Html ] ⊕ mempty
              t -> unsafeCrashWith ("invalid Token term: " <> show t)
        , canonical_term: (VarTerm (newVarName "i0") `pair` VarTerm (newVarName "i1")) `pair` VarTerm (newVarName "s")
        }

relation_Parse renderAst =
  name."Parse"
    /\ Relation
        { domain: (ltyIndex `prod12` ltyIndex) `prod12` ltyAst
        , render:
            case _ of
              PairTerm (PairTerm i0 i1) ast -> do
                i0 <- i0 # render
                i1 <- i1 # render
                [ HH.sub_ i0 :: Html ] ⊕ renderAst ast ⊕ [ HH.sub_ i1 :: Html ] ⊕ mempty
              t -> unsafeCrashWith ("invalid Parse term: " <> show t)
        , canonical_term: (VarTerm (newVarName "i0") `pair` VarTerm (newVarName "i1")) `pair` VarTerm (newVarName "ast")
        }

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
token str i j = Prop name."Token" ((i `pair` j) `pair` str)

parse :: Term -> Term -> Term -> Prop
parse ast i j = Prop name."Parse" ((i `pair` j) `pair` ast)
