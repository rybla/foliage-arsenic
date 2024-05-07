module Foliage.App.Editor.Component where

import Prelude

import Control.Monad.State (get, modify_)
import Data.Array as Array
import Data.Lazy as Lazy
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe)
import Data.Tuple.Nested ((/\))
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.ComponentLibrary.DropdownMenu as DropdownMenu
import Foliage.App.Rendering as Rendering
import Foliage.App.Style as Style
import Foliage.Example as Example
import Foliage.Program (Module(..), Name(..), Program(..), mainModuleName)
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Type.Proxy (Proxy(..))

data Query a
  = GetProgram (Program -> a)

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
  -- | Save
  -- | Load
  -- | ChangeProgramInput Event
  = SetProgram Program

component :: Component Query Input Output Aff
component = mkComponent { initialState, eval, render }
  where
  program_input_ref = H.RefLabel "program_input"

  initialState :: Input -> State
  initialState input =
    { program:
        input.program
          # fromMaybe
              ( Program
                  { name: mainModuleName
                  , doc: Nothing
                  , modules:
                      Map.singleton mainModuleName
                        ( Module
                            { name: mainModuleName
                            , doc: Nothing
                            , initialGas: 40
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

  eval = mkEval defaultEval { handleAction = handleAction, handleQuery = handleQuery }

  handleQuery :: forall a. Query a -> _ (Maybe a)
  handleQuery = case _ of
    GetProgram k -> do
      { program } <- get
      pure (Just (k program))

  handleAction = case _ of
    -- Save -> do
    --   Console.log "[Editor.Save]"
    --   { program: program@(Program { name }) } <- get
    --   saveJson { json: encodeJson program, filename: unwrap name <> ".json" } # liftEffect
    -- Load -> do
    --   Console.log "[Editor.Load]"
    --   e <- H.getHTMLElementRef program_input_ref # map (Unsafe.fromJust "program_input_ref should exist")
    --   e # HTMLElement.click # liftEffect
    -- ChangeProgramInput event -> do
    --   Console.log "[Editor.ChangeProgramInput]"
    --   getJsonFromChangeInputFile { event } # liftAff
    --     >>= case _ of
    --         Nothing -> pure unit
    --         Just json -> case decodeJson json :: _ Program of
    --           Left err -> do
    --             modify_ _ { load_error = printJsonDecodeError err # Just }
    --           Right program -> do
    --             modify_ _ { load_error = Nothing }
    --             set_program program
    SetProgram program -> do
      Console.log "[Editor.SetProgram]"
      set_program program

  render state =
    HH.div [ Style.style $ Style.font_code <> Style.flex_column <> [ "gap: 1.0em" ] ]
      ( Array.concat
          [ [ HH.div [ Style.style $ Style.flex_row ]
                let
                  button onClick label =
                    HH.div []
                      [ HH.button
                          [ HE.onClick onClick
                          , Style.style Style.button
                          ]
                          [ HH.text label ]
                      ]
                in
                  -- [ button (const Save) "Save"
                  -- , button (const Load) "Load"
                  [ {-HH.input
                      [ HP.ref program_input_ref
                      , HP.type_ HP.InputFile
                      , HE.onChange ChangeProgramInput
                      , Style.style [ "display: none" ]
                      ]
                  , -} HH.slot (Proxy :: Proxy "dropdown") "examples" DropdownMenu.component
                      { title:
                          HH.div [ Style.style $ Style.button ]
                            [ HH.text "Examples" ]
                      , items:
                          let
                            label str =
                              HH.div [ Style.style $ Style.button_secondary <> [ "width: 20em" ] ]
                                [ HH.text str ]
                          in
                            Example.examples <#> \(s /\ lazy_prog) -> label s /\ lazy_prog
                      }
                      (SetProgram <<< Lazy.force)
                  ]
            ]
          , case state.load_error of
              Nothing -> []
              Just err -> [ HH.div [ Style.style $ Style.color_error ] [ HH.text err ] ]
          , [ HH.div [ Style.style $ Style.flex_column <> [ "overflow: scroll" ] ]
                (state.program # Rendering.render # map HH.fromPlainHTML)
            ]
          ]
      )
