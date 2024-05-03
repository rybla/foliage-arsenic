module Foliage.App.Console.Component where

import Control.Monad.State
import Data.Tuple.Nested
import Prelude
import Data.Array as Array
import Data.Maybe (Maybe(..), maybe)
import Effect.Aff (Aff)
import Foliage.App.Rendering (Html, (⊕))
import Foliage.App.Rendering as Rendering
import Foliage.App.Style as Style
import Foliage.Interpretation (Env(..), Log(..))
import Foliage.Program (from_RipeRule_to_Rule)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Web.UIEvent.MouseEvent (MouseEvent)

data Query a
  = AddLog Log a
  | SetLogs (Array Log) a

data Output
  = ShowIntermediateEnv Env
  | HideIntermediateEnv

data Action
  = MouseEnterLogHeader (Maybe Env) MouseEvent
  | MouseLeaveLogHeader MouseEvent

component :: forall input. H.Component Query input Output Aff
component = H.mkComponent { initialState, eval, render }
  where
  initialState input = { logs: [] :: Array Log }

  eval = H.mkEval H.defaultEval { handleQuery = handleQuery, handleAction = handleAction }

  handleQuery :: forall a. _ a -> _ (Maybe a)
  handleQuery = case _ of
    AddLog log a -> do
      modify_ \state -> state { logs = Array.snoc state.logs log }
      pure (Just a)
    SetLogs logs a -> do
      modify_ _ { logs = logs }
      pure (Just a)

  handleAction = case _ of
    MouseEnterLogHeader mb_env event -> do
      mb_env # maybe (pure unit) \env -> H.raise (ShowIntermediateEnv env)
      pure unit
    MouseLeaveLogHeader event -> do
      H.raise HideIntermediateEnv
      pure unit

  renderLog (Log log env) =
    HH.div [ Style.style $ Style.flex_column <> [] ]
      [ HH.div
          [ Style.style $ Style.bold <> [ "background-color: rgba(0, 0, 0, 0.2)" ]
          , HE.onMouseEnter (MouseEnterLogHeader env)
          , HE.onMouseLeave MouseLeaveLogHeader
          ]
          [ HH.text log.label ]
      , HH.div [ Style.style $ Style.flex_column <> [ "padding-left: 1.0em", "gap: 1em" ] ]
          -- (log.messages # map (renderLogMessage >>> Rendering.line >>> HH.div [ Style.style $ [ "border-top: 1px solid black" ] ] >>> HH.fromPlainHTML))
          ( log.messages
              # map \(label /\ body) ->
                  HH.div [ Style.style $ Style.flex_row ]
                    [ label # HH.text # pure # HH.div [ Style.style $ Style.underline <> [ "flex-shrink: 0", "padding-right: 0.2em", "width: 8em", "text-align: right", "border-right: 1px solid black" ] ]
                    , body
                    ]
                    # HH.fromPlainHTML
          )
      ]

  render state =
    HH.div [ Style.style $ Style.flex_column <> Style.font_code <> [ "gap: 1.0em" ] ]
      [ HH.div [ Style.style $ Style.flex_row ]
          [ HH.button [ Style.style $ Style.button ] [ HH.text "Clear" ] ]
      , HH.div [ Style.style $ Style.padding_small <> Style.flex_column <> [ "gap: 2em", "overflow: scroll" ] ]
          (state.logs <#> renderLog)
      ]
