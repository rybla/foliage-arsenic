module Foliage.App.Component where

import Foliage.Program
import Prelude
import Control.Monad.Except (runExceptT)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (runWriterT)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Lazy as Lazy
import Data.Maybe (Maybe(..), maybe)
import Data.Traversable (traverse_)
import Data.Tuple.Nested ((/\))
import Debug as Debug
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Console.Component (Query(..))
import Foliage.App.Console.Component as Console.Component
import Foliage.App.Editor.Component as Editor.Component
import Foliage.App.Style as Style
import Foliage.App.Viewer.Component as Viewer.Component
import Foliage.Example as Example
import Foliage.Interpretation (Env(..))
import Foliage.Interpretation as Interpretation
import Halogen (Component, HalogenM, defaultEval, mkComponent, mkEval)
import Halogen as H
import Halogen.HTML as HH
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
        H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.PendingResult)))
        Console.log "[App.run]"
        ( Interpretation.interpProgram program
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
                H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.ErrResult { err })))
              Right (mb_err /\ Env env) -> do
                mb_err
                  # maybe (pure unit) \err -> do
                      Debug.traceM (show err)
                      H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.ErrResult { err })))
                H.tell _viewer unit (Viewer.Component.SetResult (Just (Viewer.Component.OkResult { props: env.known_props # Array.fromFoldable })))
        pure unit

  render state =
    HH.div [ Style.style $ [ "width: 100%" ] ]
      [ HH.div [ Style.style $ Style.padding_big <> Style.flex_column <> [ "align-items: center" ] ]
          [ HH.div [ Style.style $ [ "height: 2em" ] <> [ "vertical-align: center", "text-align: center" ] <> Style.font_fancy <> Style.underline ] [ HH.text "Foliage" ]
          , HH.div [ Style.style $ [ "width: calc(100vw - 2em)", "height: calc(100vh - 5em)" ] <> Style.flex_row <> [ "gap: 0" ] ]
              [ HH.div [ Style.style $ [ "height: 100%", "width: 50%", "overflow: scroll" ] <> Style.flex_column ]
                  [ HH.div [ Style.style $ Style.padding_small ]
                      [ HH.slot _editor unit Editor.Component.component { program: Just (Example.dijkstra # Lazy.force) } EditorOutput ]
                  ]
              , HH.div [ Style.style $ [ "height: 100%", "width: 50%" ] <> Style.flex_column ]
                  [ HH.div [ Style.style $ [ "flex-grow: 1", "flex-shrink: 1", "min-height: 10em", "overflow: scroll" ] <> Style.padding_small ]
                      [ HH.slot _viewer unit Viewer.Component.component {} ViewerOutput ]
                  , HH.div [ Style.style $ [ "flex-grow: 1", "flex-shrink: 1", "min-height: 10em", "overflow: scroll" ] <> Style.padding_small ]
                      [ HH.slot _console unit Console.Component.component {} absurd ]
                  ]
              ]
          ]
      ]

_viewer = Proxy :: Proxy "viewer"

_editor = Proxy :: Proxy "editor"

_console = Proxy :: Proxy "console"
