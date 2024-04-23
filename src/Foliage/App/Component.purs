module Foliage.App.Component where

import Data.Tuple.Nested
import Prelude
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Foliage.App.Editor.Component as EditorComponent
import Foliage.Program
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))

component :: forall query input output. Component query input output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState _input = {}

  eval = mkEval defaultEval

  render _state =
    HH.div [ HP.style $ "padding: 1em; width: calc(100vw - 2em); height: calc(100vh - 2em); " <> debug_backround ]
      [ HH.div [ HP.style $ "width: 100%; height: 100%; display: flex; flex-direction: column; gap: 0.5em;" ]
          [ HH.div [] [ HH.text "Foliage" ]
          , HH.div [ HP.style $ "width: 100%; height: 0.1em; background-color: black;" ] []
          , HH.div [ HP.style $ "width: 100%; height: 100%; display: flex; flex-direction: row; gap: 0.5em;" ]
              [ HH.div [ HP.style $ "flex-grow: 1; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 0.5em; " <> debug_backround ]
                  [ HH.div [ HP.style $ "flex-grow: 1; " <> debug_backround ] [ HH.slot (Proxy :: Proxy "editor") unit EditorComponent.component { program: Just example_program } absurd ]
                  , HH.div [ HP.style $ "" <> debug_backround ] [ HH.text "{console}" ]
                  ]
              , HH.div [ HP.style $ "flex-grow: 1; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 0.5em; " <> debug_backround ]
                  [ HH.div [ HP.style $ "flex-grow: 1; " <> debug_backround ] [ HH.text "{output}" ]
                  ]
              ]
          ]
      ]

debug_backround = if false then "background-color: rgba(0, 0, 0, 0.2);" else ""

example_program =
  Program
    { modules:
        Map.singleton mainModuleName
          ( Module
              { name: mainModuleName
              , dataTypeDefs:
                  Map.fromFoldable
                    [ Name "Boolean"
                        /\ DataTypeDef (SumDataType UnitDataType UnitDataType)
                    , Name "FancyBoolean"
                        /\ ExternalDataTypeDef (Name "FancyBoolean")
                    ]
              , latticeTypeDefs:
                  Map.fromFoldable
                    [ Name "Boolean"
                        /\ LatticeTypeDef (SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering UnitLatticeType UnitLatticeType)
                    , Name "Troolean"
                        /\ LatticeTypeDef (SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering UnitLatticeType (SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering UnitLatticeType UnitLatticeType))
                    ]
              , functionDefs: Map.empty
              , relations: Map.empty
              , rules: Map.empty
              }
          )
    }
