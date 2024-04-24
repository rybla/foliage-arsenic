module Foliage.App.Rendering where

import Prelude
import Data.Array as Array
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as Map
import Data.Newtype (unwrap)
import Foliage.App.Style as Style
import Foliage.Program
import Halogen.HTML as HH

renderProgram :: Program -> HH.HTML _ _
renderProgram (Program program) =
  HH.div [ Style.style $ Style.flex_column <> [ "gap: 1.0em" ] ] $ Array.concat
    $ [ [ renderLine [ renderStructural "program", renderName program.name ] ]
      , program.modules
          # map renderModule
          # Map.values
          # Array.fromFoldable
      ]

renderModule :: Module -> HH.HTML _ _
renderModule (Module mod) =
  renderDefinition
    (renderStructural "module")
    (renderName mod.name)
    ( Array.concat
        [ mod.latticeTypeDefs
            # mapWithIndex
                ( \name latticeTypeDef ->
                    renderDefinition (renderStructural "data type") (renderName name) case latticeTypeDef of
                      LatticeTypeDef lty -> [ renderLatticeType lty ]
                )
            # Map.values
            # Array.fromFoldable
        , mod.dataTypeDefs
            # mapWithIndex
                ( \name dataTypeDef ->
                    renderDefinition (renderStructural "data type") (renderName name) case dataTypeDef of
                      DataTypeDef dty -> [ renderDataType dty ]
                      ExternalDataTypeDef name -> [ HH.div [] [ renderLine [ renderStructural "external" ] ] ]
                )
            # Map.values
            # Array.fromFoldable
        ]
    )
  where
  renderLatticeType = case _ of
    UnitLatticeType -> renderPrimitive "Unit"
    SumLatticeType o l r -> renderLine [ renderStructural "(", renderLatticeType l, renderStructural "+", renderLatticeType r, renderStructural ")" ]
    ProductLatticeType o f s -> renderLine [ renderStructural "(", renderLatticeType f, renderStructural "*", renderLatticeType s, renderStructural ")" ]
    SetLatticeType o d -> renderPrimitive "Set"
    OppositeLatticeType l -> renderPrimitive "Op"
    PowerLatticeType l -> renderPrimitive "Pow"

  renderDataType = case _ of
    UnitDataType -> renderPrimitive "Unit"
    SumDataType l r -> renderLine [ renderStructural "(", renderDataType l, renderStructural "+", renderDataType r, renderStructural ")" ]
    ProductDataType f s -> renderPrimitive "Prod"
    SetDataType d -> renderPrimitive "Set"

renderDefinition :: HH.HTML _ _ -> HH.HTML _ _ -> Array (HH.HTML _ _) -> HH.HTML _ _
renderDefinition sort name body =
  HH.div [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
    [ renderLine $ [ sort, name, renderStructural "=" ]
    , renderSection body
    ]

renderLine :: Array (HH.HTML _ _) -> HH.HTML _ _
renderLine = HH.div [ Style.style $ Style.flex_row <> [ "display: inline-flex", "white-space: flex-wrap" ] ]

renderStructural :: String -> HH.HTML _ _
renderStructural label = HH.div [ Style.style $ Style.bold <> [ "color: black" ] ] [ HH.text label ]

renderPrimitive :: String -> HH.HTML _ _
renderPrimitive label = HH.div [ Style.style $ Style.italic <> [ "color: purple" ] ] [ HH.text label ]

renderName :: Name -> HH.HTML _ _
renderName name = HH.div [ Style.style $ Style.italic <> [ "color: green" ] ] [ HH.text (unwrap name) ]

renderProp :: Prop -> HH.HTML _ _
renderProp (Prop p t) = renderLine ([ renderName p ] <> renderTerm t)

renderTerm :: Term -> Array (HH.HTML _ _)
renderTerm = case _ of
  VarTerm x -> [ renderName x ]
  UnitTerm -> [ renderPrimitive "●" ]
  LeftTerm t -> [ renderPrimitive "Left" ] <> renderTerm t
  RightTerm t -> [ renderPrimitive "Right" ] <> renderTerm t
  PairTerm t1 t2 -> [ renderPrimitive "Pair" ] <> renderTerm t1 <> renderTerm t2
  SetTerm ts -> [ renderPrimitive "{" ] <> ((ts <#> renderTerm) # Array.intercalate [ renderPrimitive "," ]) <> [ renderPrimitive "}" ]

renderSection :: Array (HH.HTML _ _) -> HH.HTML _ _
renderSection = HH.div [ Style.style $ Style.flex_column <> Style.padding_horizontal_big ]
