module Foliage.App.Component where

import Data.Tuple.Nested
import Foliage.Program
import Prelude
import Control.Monad.Except (runExceptT)
import Control.Monad.Writer (runWriterT)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Lazy as Lazy
import Data.List (List(..))
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Editor.Component as Editor.Component
import Foliage.App.Viewer.Component as Viewer.Component
import Foliage.Example as Example
import Foliage.Interpretation as Interpretation
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP
import Type.Proxy (Proxy(..))
import Unsafe as Unsafe

data Action
  = EditorOutput Editor.Component.Output
  | ViewerOutput Viewer.Component.Output

component :: forall query input output. Component query input output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState _input = {}

  eval = mkEval defaultEval { handleAction = handleAction }

  handleAction = case _ of
    EditorOutput output -> case output of
      Editor.Component.UpdatedProgram program -> do
        -- clear output
        H.tell _viewer unit (Viewer.Component.SetResult Nothing)
        pure unit
    ViewerOutput output -> case output of
      Viewer.Component.Ran -> do
        -- TODO
        program <- H.request _editor unit Editor.Component.GetProgram <#> Unsafe.fromJust "editor must exist"
        Console.log "[App.run]"
        result <-
          Interpretation.interpProgram program
            # ( runWriterT
                  >=> \(a /\ logs) -> do
                      -- TODO: do anything with the logs?
                      pure a
              )
            # runExceptT
        Console.logShow { result }
        case result of
          Left err -> do
            H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.ErrResult { err })))
            pure unit
          Right props -> do
            H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.OkResult { props: props # Array.fromFoldable })))
            pure unit

  render _state =
    HH.div [ HP.style $ "padding: 1em; width: calc(100vw - 2em); height: calc(100vh - 2em); " ]
      [ HH.div [ HP.style $ "width: 100%; height: 100%; display: flex; flex-direction: column; gap: 1.0em;" ]
          [ HH.div [] [ HH.text "Foliage" ]
          , HH.div [ HP.style $ "width: 100%; height: 0.1em; background-color: black;" ] []
          , HH.div [ HP.style $ "width: 100%; height: 100%; display: flex; flex-direction: row; gap: 1.0em;" ]
              [ HH.div [ HP.style $ "flex-grow: 1; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 1.0em; " ]
                  [ HH.div [ HP.style $ "flex-grow: 1; " ]
                      [ HH.slot _editor unit Editor.Component.component { program: Just (Example.blank # Lazy.force) } EditorOutput ]
                  , HH.div [ HP.style $ "" ]
                      [ HH.text "{console}" ]
                  ]
              , HH.div [ HP.style $ "flex-grow: 1; width: 100%; height: 100%; display: flex; flex-direction: column; gap: 1.0em; " ]
                  [ HH.div [ HP.style $ "flex-grow: 1; " ]
                      [ HH.slot _viewer unit Viewer.Component.component {} ViewerOutput ]
                  ]
              ]
          ]
      ]

_viewer = Proxy :: Proxy "viewer"

_editor = Proxy :: Proxy "editor"
