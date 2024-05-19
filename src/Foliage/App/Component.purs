module Foliage.App.Component where

import Prelude

import Control.Monad.Except (runExceptT)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (runWriterT)
import Data.Either (Either(..))
import Data.Lazy as Lazy
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested ((/\))
import Debug as Debug
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Console.Component (Query(..))
import Foliage.App.Console.Component as Console.Component
import Foliage.App.Editor.Component as Editor.Component
import Foliage.App.Style as Style
import Foliage.App.Viewer.Component as Viewer.Component
import Foliage.Example.Dijkstra as Example.Dijkstra
import Foliage.Example.Parsing as Example.Parsing
import Foliage.Example.Typing as Example.Typing
import Foliage.Interpretation as Interpretation
import Halogen (Component, defaultEval, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))
import Unsafe as Unsafe

-- default_mod = Example.Dijkstra.diamond
-- default_mod = Example.Dijkstra.cycle
-- default_mod = Example.Parsing.nat
-- default_mod = Example.Parsing.assoc
default_mod = Example.Typing.example

data Action
  = EditorOutput Editor.Component.Output
  | ViewerOutput Viewer.Component.Output
  | ConsoleOutput Console.Component.Output

component :: forall query input output. Component query input output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState _input = { mod: default_mod # Lazy.force }

  eval = mkEval defaultEval { handleAction = handleAction }

  handleAction = case _ of
    EditorOutput output -> case output of
      Editor.Component.UpdatedModule mod -> do
        -- clear output
        H.modify_ _ { mod = mod }
        H.tell _viewer unit (Viewer.Component.SetResult Nothing)
        H.tell _console unit (Console.Component.SetLogs [])
        pure unit
    ViewerOutput output -> case output of
      Viewer.Component.Ran -> do
        mod <- H.request _editor unit Editor.Component.GetModule <#> Unsafe.fromJust "editor must exist"
        H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.PendingResult)))
        Console.log "[App.run]"
        ( Interpretation.interpModule mod
            # ( runWriterT
                  >=> \(a /\ logs) -> do
                      H.tell _console unit (SetLogs logs) # lift
                      pure a
              )
            # runExceptT
        )
          >>= case _ of
              Left err -> do
                Debug.traceM (show err)
                H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.ErrResult { err, env: Nothing })))
              Right (mb_err /\ env) -> do
                case mb_err of
                  Nothing -> H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.OkResult { env })))
                  Just err -> H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.ErrResult { err, env: Just env })))
        pure unit
    ConsoleOutput output -> case output of
      Console.Component.ShowIntermediateEnv env -> do
        H.tell _viewer unit (Viewer.Component.SetIntermediateEnv (Just env))
        pure unit
      Console.Component.HideIntermediateEnv -> do
        H.tell _viewer unit (Viewer.Component.SetIntermediateEnv Nothing)
        pure unit

  render state =
    HH.div [ Style.style $ [ "width: 100%", "background-color: rgba(10, 43, 54, 0.0)" ] ]
      [ HH.div [ Style.style $ Style.padding_big <> Style.flex_column <> [ "align-items: center" ] ]
          [ HH.div [ Style.style $ [ "height: 2em" ] <> [ "vertical-align: center", "text-align: center" ] <> Style.font_fancy <> Style.underline ] [ HH.text "Foliage" ]
          , HH.div [ Style.style $ [ "width: calc(100vw - 2em)", "height: calc(100vh - 5em)" ] <> Style.flex_row <> [ "gap: 0" ] ]
              [ HH.div [ Style.style $ [ "height: 100%", "width: 50%", "overflow: scroll" ] <> Style.flex_column ]
                  [ HH.div [ Style.style $ Style.padding_small ]
                      [ HH.slot _editor unit Editor.Component.component { mod: Just (default_mod # Lazy.force) } EditorOutput ]
                  ]
              , HH.div [ Style.style $ [ "height: 100%", "width: 50%", "overflow: scroll" ] <> Style.flex_column ]
                  [ HH.div [ Style.style $ Style.padding_small ]
                      [ HH.slot _viewer unit Viewer.Component.component { mod: state.mod } ViewerOutput ]
                  ]
              , HH.div [ Style.style $ [ "height: 100%", "width: 50%", "overflow: scroll" ] <> Style.flex_column ]
                  [ HH.div [ Style.style $ Style.padding_small ]
                      [ HH.slot _console unit Console.Component.component {} ConsoleOutput ]
                  ]
              ]
          ]
      ]

_viewer = Proxy :: Proxy "viewer"

_editor = Proxy :: Proxy "editor"

_console = Proxy :: Proxy "console"
