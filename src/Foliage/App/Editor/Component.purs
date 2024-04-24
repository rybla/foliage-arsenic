module Foliage.App.Editor.Component where

import Foliage.Program
import Prelude
import BrowserUtility (getJsonFromChangeInputFile, loadJson, saveJson)
import Control.Monad.State (get, modify_)
import Data.Argonaut (decodeJson, encodeJson, printJsonDecodeError)
import Data.Array as Array
import Data.Either (Either(..))
import Data.FunctorWithIndex (mapWithIndex)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Newtype (unwrap)
import Debug as Debug
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Style as Style
import Halogen (Component, defaultEval, liftAff, liftEffect, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Halogen.HTML.Properties as HP
import Unsafe as Unsafe
import Web.Event.Internal.Types (Event)
import Web.HTML.HTMLElement as HTMLElement

type Input
  = { program :: Maybe Program
    }

data Output
  = UpdatedProgram Program

type State
  = { program :: Program
    , load_error :: Maybe String
    }

data Action
  = Save
  | Load
  | ChangeProgramInput Event

component :: forall query. Component query Input Output Aff
component = mkComponent { initialState, eval, render }
  where
  program_input_ref = H.RefLabel "program_input"

  initialState :: Input -> State
  initialState input =
    { program:
        input.program
          # fromMaybe
              ( Program
                  { name: Name "Main"
                  , modules:
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
    , load_error: Nothing
    }

  set_program program = do
    modify_ _ { program = program }
    H.raise (UpdatedProgram program)

  eval = mkEval defaultEval { handleAction = handleAction }

  handleAction = case _ of
    Save -> do
      Console.log "[Editor.Save]"
      { program: program@(Program { name }) } <- get
      saveJson { json: encodeJson program, filename: unwrap name <> ".json" } # liftEffect
    Load -> do
      Console.log "[Editor.Load]"
      e <- H.getHTMLElementRef program_input_ref # map (Unsafe.fromJust "program_input_ref should exist")
      e # HTMLElement.click # liftEffect
    ChangeProgramInput event -> do
      Console.log "[Editor.ChangeProgramInput]"
      getJsonFromChangeInputFile { event } # liftAff
        >>= case _ of
            Nothing -> pure unit
            Just json -> case decodeJson json :: _ Program of
              Left err -> do
                modify_ _ { load_error = printJsonDecodeError err # Just }
              Right program -> do
                modify_ _ { load_error = Nothing }
                set_program program

  render state =
    HH.div [ Style.style $ Style.rounded <> Style.padding_big <> Style.shadowed <> Style.font_code <> Style.flex_column <> [ "gap: 1.0em" ] ]
      ( Array.concat
          [ [ HH.div [ Style.style $ Style.flex_row ]
                ( Array.concat
                    [ [ HH.div []
                          [ HH.button
                              [ HE.onClick (const Save)
                              , Style.style Style.button
                              ]
                              [ HH.text "Save" ]
                          ]
                      , HH.div []
                          [ HH.button
                              [ HE.onClick (const Load)
                              , Style.style Style.button
                              ]
                              [ HH.text "Load" ]
                          , HH.input
                              [ HP.ref program_input_ref
                              , HP.type_ HP.InputFile
                              , HE.onChange ChangeProgramInput
                              , Style.style [ "display: none" ]
                              ]
                          ]
                      ]
                    ]
                )
            ]
          , case state.load_error of
              Nothing -> []
              Just err -> [ HH.div [ Style.style $ Style.color_error ] [ HH.text err ] ]
          , [ renderProgram state.program ]
          ]
      )

renderProgram (Program program) =
  HH.div [ Style.style $ Style.flex_column <> [ "gap: 1.0em" ] ] $ Array.concat
    $ [ [ renderLine [ renderStructural "program", renderName program.name ] ]
      , program.modules
          # map renderModule
          # Map.values
          # Array.fromFoldable
      ]

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

renderDefinition sort name body =
  HH.div [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
    [ renderLine $ [ sort, name, renderStructural "=" ]
    , renderSection body
    ]

renderLine = HH.div [ Style.style $ Style.flex_row <> [ "display: inline-flex", "white-space: flex-wrap" ] ]

renderStructural label = HH.div [ Style.style $ Style.bold <> [ "color: black" ] ] [ HH.text label ]

renderPrimitive label = HH.div [ Style.style $ Style.italic <> [ "color: purple" ] ] [ HH.text label ]

renderName name = HH.div [ Style.style $ Style.italic <> [ "color: green" ] ] [ HH.text (unwrap name) ]

renderSection = HH.div [ Style.style $ Style.flex_column <> Style.padding_horizontal_big ]
