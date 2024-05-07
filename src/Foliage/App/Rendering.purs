module Foliage.App.Rendering where

import Data.Tuple.Nested
import Foliage.Program
import Prelude
import Data.Array as Array
import Data.FunctorWithIndex (mapWithIndex)
import Data.List as List
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (unwrap)
import Foliage.App.Style as Style
import Halogen.HTML (PlainHTML)
import Halogen.HTML as HH
import Unsafe (todo)

class Render a where
  render :: a -> Htmls

instance _Render_Htmls :: Render Htmls where
  render = identity

append_render :: forall a. Render a => a -> Htmls -> Htmls
append_render a = append (render a)

infixr 5 append_render as ⊕

type Html
  = HH.PlainHTML

type Htmls
  = Array Html

divs :: _ -> Array Htmls -> Html
divs props = HH.div props <<< Array.concat

instance _Render_Program :: Render Program where
  render (Program prog) =
    [ divs [ Style.style $ Style.flex_column <> [ "gap: 1.0em" ] ]
        $ [ line (Punc "program" ⊕ prog.name ⊕ [])
          , prog.doc # maybe [] doc_block
          , prog.modules
              # map render
              # Map.values
              # Array.fromFoldable
              # Array.concat
          ]
    ]

doc_block :: String -> Htmls
doc_block s =
  [ HH.div [ Style.style $ Style.padding_small <> Style.font_prose <> [ "max-width: 30em", "background-color: rgba(0, 0, 0, 0.1)", "white-space: pre-wrap" ] ]
      [ HH.text s ]
  ]

instance _Render_Module :: Render Module where
  render (Module mod) =
    definition
      (mod.doc <#> doc_block)
      ("module" # Punc # render)
      (mod.name # render)
      ( let
          renderModDefinition :: forall a. Htmls -> (a -> Htmls) -> _ a -> Htmls
          renderModDefinition label renderBody items =
            items
              # mapWithIndex (\name body -> definition Nothing label (render name) (renderBody body))
              # Map.values
              # Array.fromFoldable
              # Array.concat
        in
          Array.concat
            [ mod.dataTypeDefs
                # renderModDefinition (Punc "data type" ⊕ []) case _ of
                    DataTypeDef dty -> line (dty ⊕ [])
                    ExternalDataTypeDef str -> line (Punc "external" ⊕ Raw str ⊕ [])
            , mod.functionDefs
                # renderModDefinition (Punc "function" ⊕ []) case _ of
                    ExternalFunctionDef def -> line (Raw def.name ⊕ Punc "(" ⊕ ((def.inputs <#> \(x /\ dty) -> Raw x ⊕ Punc ":" ⊕ dty ⊕ []) # Array.intercalate (Punc "," ⊕ [])) ⊕ Punc ")" ⊕ Punc "→" ⊕ def.output ⊕ [])
            , mod.latticeTypeDefs
                # renderModDefinition (Punc "lattice type" ⊕ []) case _ of
                    LatticeTypeDef lty -> line (lty ⊕ [])
                    ExternalLatticeTypeDef def -> line (Punc "external" ⊕ Raw def.name ⊕ [])
            , mod.relations
                # renderModDefinition (Punc "relation" ⊕ []) \(Relation rel) ->
                    line (Punc "ℛ" ⊕ rel.domain ⊕ [])
            , mod.rules
                # renderModDefinition (Punc "rule" ⊕ []) (render >>> HH.div [ Style.style $ [ "display: inline-flex", "flex-direction: row" ] ] >>> pure)
            ]
      )

definition :: Maybe Htmls -> Htmls -> Htmls -> Htmls -> Htmls
definition mb_doc sort name body =
  [ divs [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
      [ mb_doc # maybe [] (HH.div [] >>> pure)
      , line (sort ⊕ name ⊕ Punc "=" ⊕ [])
      , section body
      ]
  ]

instance _Render_Rule :: Render Rule where
  render (Rule rule) =
    [ HH.div [ Style.style $ Style.flex_column ]
        if List.null rule.hypotheses then
          line (rule.conclusion ⊕ [])
        else
          [ rule.hypotheses # map render # List.fold
          , [ HH.div [ Style.style $ Style.horizontal_bar ] [] ]
          , line (rule.conclusion ⊕ [])
          ]
            # Array.concat
    ]

instance _Render_LatticeType :: Render LatticeType where
  render = case _ of
    NamedLatticeType x -> x ⊕ []
    UnitLatticeType -> Prim "Unit" ⊕ []
    SumLatticeType o l r -> Punc "(" ⊕ l ⊕ [ plus_sup ] ⊕ Punc ")" ⊕ []
      where
      plus_sup =
        HH.span [ Style.style [ "display: flex", "flex-direction: row" ] ]
          (Punc "+" ⊕ [ HH.sup [] [ HH.text sup ] ])

      sup = case o of
        LeftGreaterThanRight_SumLatticeTypeOrdering -> "L>R"
        LeftLessThanRight_SumLatticeTypeOrdering -> "L<R"
        LeftIncomparableRight_SumLatticeTypeOrdering -> "L⋈R"
        LeftEqualRight_SumLatticeTypeOrdering -> "L=R"
    ProductLatticeType o f s -> Punc "(" ⊕ f ⊕ [ prod_sup ] ⊕ s ⊕ Punc ")" ⊕ []
      where
      prod_sup =
        HH.span [ Style.style [ "display: flex", "flex-direction: row" ] ]
          (Punc "×" ⊕ [ HH.sup [] [ HH.text sup ] ])

      sup = case o of
        FirstThenSecond_ProductLatticeTypeOrdering -> "1,2"
    SetLatticeType o d -> Prim "Set" ⊕ Punc "(" ⊕ d ⊕ Punc ")" ⊕ []
    OppositeLatticeType l -> Prim "Opposite" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ []
    DiscreteLatticeType l -> Prim "Discrete" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ []
    PowerLatticeType l -> Prim "Power" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ []

instance _Render_DataType :: Render DataType where
  render = case _ of
    NamedDataType x -> x ⊕ []
    UnitDataType -> Prim "Unit" ⊕ []
    SumDataType l r -> Punc "(" ⊕ l ⊕ Punc "+" ⊕ r ⊕ Punc ")" ⊕ []
    SetDataType d -> Prim "Set" ⊕ d ⊕ []
    ProductDataType f s -> Punc "(" ⊕ f ⊕ Punc "*" ⊕ s ⊕ Punc ")" ⊕ []

line :: Htmls -> Htmls
line = HH.div [ Style.style $ Style.flex_row <> [ "gap: 0.5em", "display: inline-flex", "white-space: flex-wrap" ] ] >>> pure

-- | Puntuation
newtype Punc
  = Punc String

instance _Render_Punc :: Render Punc where
  render (Punc s) = HH.div [ Style.style $ Style.bold <> [ "color: black" ] ] [ HH.text s ] # pure

-- | Primitive
newtype Prim
  = Prim String

instance _Render_Prim :: Render Prim where
  render (Prim s) = HH.div [ Style.style $ [ "color: purple" ] ] [ HH.text s ] # pure

instance _Render_Name :: Render Name where
  render (Name s _) = HH.div [ Style.style $ [ "color: darkgreen" ] ] [ HH.text s ] # pure

instance _Render_Hypothesis :: Render Hypothesis where
  render (Hypothesis prop sides) = line (prop ⊕ []) ⊕ (sides # map (render >>> line) # Array.fold) ⊕ []

instance _Render_SideHypothesis :: Render SideHypothesis where
  render = case _ of
    FunctionSideHypothesis side -> Punc "let" ⊕ side.resultVarName ⊕ Punc "=" ⊕ side.functionName ⊕ Punc "(" ⊕ ((side.args <#> render) # Array.intercalate (Punc "," ⊕ [])) ⊕ Punc ")" ⊕ []

instance _Render_Prop :: Render Prop where
  render (Prop p t) = p ⊕ t ⊕ []

instance _Render_Term :: Render Term where
  render = case _ of
    VarTerm x -> x ⊕ []
    LiteralTerm l _ -> Lit l ⊕ []
    UnitTerm -> Prim "●" ⊕ []
    LeftTerm t -> Punc "(" ⊕ Prim "Left" ⊕ t ⊕ Punc ")" ⊕ []
    RightTerm t -> Punc "(" ⊕ Prim "Right" ⊕ t ⊕ Punc ")" ⊕ []
    PairTerm t1 t2 -> Punc "⟨" ⊕ t1 ⊕ Punc "," ⊕ t2 ⊕ Punc "⟩" ⊕ []
    SetTerm ts -> Punc "{" ⊕ ((ts <#> render) # Array.intercalate (Punc "," ⊕ [])) ⊕ Punc "}" ⊕ []

section :: Htmls -> Htmls
section = HH.div [ Style.style $ Style.flex_column <> Style.padding_horizontal_big ] >>> pure

-- | Raw String
newtype Raw
  = Raw String

instance _Render_Raw :: Render Raw where
  render (Raw s) = [ HH.div [ Style.style $ [ "color: blue" ] ] [ HH.text s ] ]

-- | Lit String
newtype Lit
  = Lit String

instance _Render_Lit :: Render Lit where
  render (Lit s) = [ HH.div [ Style.style $ Style.italic <> [ "color: #e67e00" ] ] [ HH.text s ] ]
