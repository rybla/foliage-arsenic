module Foliage.App.Editor.Component where

import Prelude
import Control.Monad.Reader (runReader)
import Control.Monad.State (get, modify_)
import Data.Array as Array
import Data.Lazy as Lazy
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, fromMaybe')
import Data.Tuple.Nested ((/\))
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.ComponentLibrary.DropdownMenu as DropdownMenu
import Foliage.App.Style as Style
import Foliage.Example as Example
import Foliage.Program (Module(..), RenderCtx(..), VarName(..))
import Foliage.Program as Program
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Foliage.Example.Blank as Example.Blank

data Query a
  = GetModule (Module -> a)

type Input
  = { mod :: Maybe Module
    }

data Output
  = UpdatedModule Module

type State
  = { mod :: Module
    , load_error :: Maybe String
    }

data Action
  -- | Save
  -- | Load
  -- | ChangeModuleInput Event
  = SetModule Module

component :: Component Query Input Output Aff
component = mkComponent { initialState, eval, render }
  where
  mod_input_ref = H.RefLabel "mod_input"

  initialState :: Input -> State
  initialState input =
    { mod: input.mod # fromMaybe' (\_ -> Lazy.force Example.Blank.blank)
    , load_error: Nothing
    }

  set_mod mod = do
    modify_ _ { mod = mod }
    H.raise (UpdatedModule mod)

  eval = mkEval defaultEval { handleAction = handleAction, handleQuery = handleQuery }

  handleQuery :: forall a. Query a -> _ (Maybe a)
  handleQuery = case _ of
    GetModule k -> do
      { mod } <- get
      pure (Just (k mod))

  handleAction = case _ of
    -- Save -> do
    --   Console.log "[Editor.Save]"
    --   { mod: mod@(Module { name }) } <- get
    --   saveJson { json: encodeJson mod, filename: unwrap name <> ".json" } # liftEffect
    -- Load -> do
    --   Console.log "[Editor.Load]"
    --   e <- H.getHTMLElementRef mod_input_ref # map (Unsafe.fromJust "mod_input_ref should exist")
    --   e # HTMLElement.click # liftEffect
    -- ChangeModuleInput event -> do
    --   Console.log "[Editor.ChangeModuleInput]"
    --   getJsonFromChangeInputFile { event } # liftAff
    --     >>= case _ of
    --         Nothing -> pure unit
    --         Just json -> case decodeJson json :: _ Module of
    --           Left err -> do
    --             modify_ _ { load_error = printJsonDecodeError err # Just }
    --           Right mod -> do
    --             modify_ _ { load_error = Nothing }
    --             set_mod mod
    SetModule mod -> do
      Console.log "[Editor.SetModule]"
      set_mod mod

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
                      [ HP.ref mod_input_ref
                      , HP.type_ HP.InputFile
                      , HE.onChange ChangeModuleInput
                      , Style.style [ "display: none" ]
                      ]
                  ,  HH.slot (Proxy :: Proxy "dropdown") "examples" DropdownMenu.component
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
                      (SetModule <<< Lazy.force) -}
                  ]
            ]
          , case state.load_error of
              Nothing -> []
              Just err -> [ HH.div [ Style.style $ Style.color_error ] [ HH.text err ] ]
          , [ HH.div [ Style.style $ Style.flex_column <> [ "overflow: scroll" ] ]
                let
                  renderCtx = RenderCtx { mod: state.mod }
                in
                  (state.mod # Program.render # flip runReader renderCtx # map HH.fromPlainHTML)
            ]
          ]
      )
