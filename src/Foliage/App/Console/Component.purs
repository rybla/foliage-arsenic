module Foliage.App.Console.Component where

import Control.Monad.State
import Prelude
import Data.Array as Array
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Foliage.App.Rendering (Html, (⊕))
import Foliage.App.Rendering as Rendering
import Foliage.App.Style as Style
import Foliage.Interpretation (Log(..), LogMessage(..))
import Foliage.Program (from_RipeRule_to_Rule)
import Halogen as H
import Halogen.HTML as HH

data Query a
  = AddLog Log a
  | SetLogs (Array Log) a

component :: forall input output. H.Component Query input output Aff
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

  handleAction _ = pure unit

  renderLog (Log log) =
    HH.div [ Style.style $ Style.flex_column <> [] ]
      [ HH.div [ Style.style $ Style.bold <> [ "box-shadow: 0 0 0 1px black", "padding-right: 0.5em" ] ] [ HH.text log.label :: Html ]
      , HH.div [ Style.style $ [ "padding-left: 1.0em", "display: flex", "flex-direction: column", "gap: 0.5em" ] ]
          (log.messages # map (renderLogMessage >>> HH.div [ Style.style $ [ "display: flex", "flex-direction: row", "gap: 0.2em" ] <> [ "border-bottom: 1px solid black" ] ]))
      ]

  renderLogMessage = case _ of
    StringLogMessage str -> [ HH.div [] [ HH.text str :: Html ] ]
    RuleLogMessage label rule -> [ HH.div [ Style.style $ Style.underline <> [ "padding-right: 0.2em", "width: 6em", "text-align: right", "border-right: 1px solid black" ] ] [ label # HH.text :: Html ] ] ⊕ rule ⊕ []
    RipeRuleLogMessage label ripe_rule -> [ HH.div [ Style.style $ Style.underline <> [ "padding-right: 0.2em", "width: 6em", "text-align: right", "border-right: 1px solid black" ] ] [ label # HH.text :: Html ] ] ⊕ from_RipeRule_to_Rule ripe_rule ⊕ []
    PropLogMessage label prop -> [ HH.div [ Style.style $ Style.underline <> [ "padding-right: 0.2em", "width: 6em", "text-align: right", "border-right: 1px solid black" ] ] [ label # HH.text :: Html ] ] ⊕ prop ⊕ []
    TermLogMessage label term -> [ HH.div [ Style.style $ Style.underline <> [ "padding-right: 0.2em", "width: 6em", "text-align: right", "border-right: 1px solid black" ] ] [ label # HH.text :: Html ] ] ⊕ term ⊕ []
    LatticeTypeLogMessage label lty -> [ HH.div [ Style.style $ Style.underline <> [ "padding-right: 0.2em", "width: 6em", "text-align: right", "border-right: 1px solid black" ] ] [ label # HH.text :: Html ] ] ⊕ lty ⊕ []

  render state =
    HH.div [ Style.style $ Style.flex_column <> Style.font_code <> [ "gap: 1.0em" ] ]
      [ HH.div [ Style.style $ Style.flex_row ]
          [ HH.button [ Style.style $ Style.button ] [ HH.text "Clear" ] ]
      , HH.div [ Style.style $ Style.padding_small <> Style.flex_column <> [ "gap: 2em", "overflow: scroll" ] ]
          (state.logs <#> renderLog >>> HH.fromPlainHTML)
      ]
