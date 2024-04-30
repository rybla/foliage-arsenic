module Foliage.App.Console.Component where

import Control.Monad.State
import Prelude
import Data.Array as Array
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Foliage.App.Rendering (Html, (⊕))
import Foliage.App.Rendering as Rendering
import Foliage.App.Style as Style
import Foliage.Interpretation (Log(..))
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
    [ HH.div [ Style.style $ Style.italic <> Style.underline <> [ "padding-right: 0.5em" ] ] [ HH.text log.label :: Html ] ]
      ⊕ [ HH.div [] [ HH.text log.message :: Html ] ]
      ⊕ []

  render state =
    HH.div [ Style.style $ Style.flex_column <> Style.font_code ]
      [ HH.div [ Style.style $ Style.flex_row ]
          [ HH.button [ Style.style $ Style.button ] [ HH.text "Clear" ] ]
      , HH.div [ Style.style $ Style.flex_column <> [ "gap: 1.5em", "overflow: scroll" ] ]
          (state.logs <#> renderLog >>> (HH.div [ Style.style $ [ "display: inline-flex", "flex-direction: row", "gap: 0.5em", "flex-wrap: wrap" ] ]) >>> HH.fromPlainHTML)
      ]
