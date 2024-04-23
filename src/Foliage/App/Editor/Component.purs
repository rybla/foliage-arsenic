module Foliage.App.Editor.Component where

import Foliage.Program
import Prelude
import Data.Array as Array
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as Map
import Data.Maybe (Maybe, fromMaybe)
import Data.Newtype (unwrap)
import Effect.Aff (Aff)
import Foliage.App.Style as Style
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

type Input
  = { program :: Maybe Program
    }

component :: forall query output. Component query Input output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState input =
    { program:
        input.program
          # fromMaybe
              ( Program
                  { modules:
                      Map.singleton mainModuleName
                        ( Module
                            { name: mainModuleName
                            , dataTypeDefs: Map.empty
                            , latticeTypeDefs: Map.empty
                            , functionDefs: Map.empty
                            , relations: Map.empty
                            , rules: Map.empty
                            }
                        )
                  }
              )
    }

  eval = mkEval defaultEval

  render state =
    HH.div [ Style.style $ Style.rounded <> Style.padding_big <> Style.shadowed <> Style.font_code ]
      [ renderProgram state.program
      ]

renderProgram (Program program) =
  HH.div [ Style.style $ Style.flex_column <> [ "gap: 1.0em" ] ] $ Array.concat
    $ [ [ renderStructural "Program" ]
      , program.modules
          # map renderModule
          # Map.values
          # Array.fromFoldable
      ]

renderModule (Module mod) =
  HH.div [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
    [ renderLine [ renderStructural "Module", renderName mod.name ]
    , renderSection
        $ Array.concat
            [ mod.latticeTypeDefs
                # mapWithIndex
                    ( \name latticeTypeDef ->
                        let
                          latticeTypeDef_html = case latticeTypeDef of
                            LatticeTypeDef lty -> renderLatticeType lty
                        in
                          HH.div [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
                            [ HH.div [ Style.style $ Style.font_size_small ]
                                [ renderStructural "Lattice Type" ]
                            , renderLine [ renderName name, renderStructural "=" ]
                            , renderSection [ latticeTypeDef_html ]
                            ]
                    )
                # Map.values
                # Array.fromFoldable
            , mod.dataTypeDefs
                # mapWithIndex
                    ( \name dataTypeDef ->
                        let
                          dataTypeDef_html = case dataTypeDef of
                            DataTypeDef dty -> [ renderDataType dty ]
                            ExternalDataTypeDef name -> [ HH.div [] [ renderLine [ renderStructural "external" ] ] ]
                        in
                          HH.div [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
                            [ HH.div [ Style.style $ Style.font_size_small ]
                                [ renderStructural "Data Type" ]
                            , renderLine $ [ renderName name, renderStructural "=" ]
                            , renderSection dataTypeDef_html
                            ]
                    )
                # Map.values
                # Array.fromFoldable
            ]
    ]
  where
  renderLatticeType = case _ of
    UnitLatticeType -> renderPrimitive "Unit"
    SumLatticeType o l r -> renderLine [ renderStructural "(", renderLatticeType l, renderStructural "+", renderLatticeType r, renderStructural ")" ]
    ProductLatticeType o f s -> renderPrimitive "Prod"
    SetLatticeType o d -> renderPrimitive "Set"
    OppositeLatticeType l -> renderPrimitive "Op"
    PowerLatticeType l -> renderPrimitive "Pow"

  renderDataType = case _ of
    UnitDataType -> renderPrimitive "Unit"
    SumDataType l r -> renderLine [ renderStructural "(", renderDataType l, renderStructural "+", renderDataType r, renderStructural ")" ]
    ProductDataType f s -> renderPrimitive "Prod"
    SetDataType d -> renderPrimitive "Set"

renderLine = HH.div [ Style.style $ Style.flex_row <> [ "display: inline-flex", "white-space: flex-wrap" ] ]

renderStructural label = HH.div [ Style.style $ Style.bold <> [ "color: black" ] ] [ HH.text label ]

renderPrimitive label = HH.div [ Style.style $ Style.bold <> [ "color: purple" ] ] [ HH.text label ]

renderName name = HH.div [ Style.style $ Style.italic <> [ "color: green" ] ] [ HH.text (unwrap name) ]

renderSection = HH.div [ Style.style $ Style.flex_column <> Style.padding_horizontal_big ]
