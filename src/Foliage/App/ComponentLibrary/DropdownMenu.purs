module Foliage.App.ComponentLibrary.DropdownMenu where

import Data.Tuple.Nested
import Prelude
import Data.Tuple (Tuple(..))
import Effect.Class (class MonadEffect, liftEffect)
import Foliage.App.Style as Style
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE
import Record as Record
import Type.Proxy (Proxy(..))
import Web.Event.Event as Event
import Web.UIEvent.MouseEvent (MouseEvent)
import Web.UIEvent.MouseEvent as MouseEvent

type Key
  = String

type Input output
  = { title :: HH.PlainHTML
    , items :: Array (HH.PlainHTML /\ output)
    }

data Action output
  = Select output MouseEvent
  | Toggle MouseEvent
  | MouseLeave MouseEvent

component :: forall query output m. MonadEffect m => H.Component query (Input output) output m
component = H.mkComponent { initialState, eval, render }
  where
  initialState input = input `Record.merge` { open: false }

  eval = H.mkEval H.defaultEval { handleAction = handleAction }

  handleAction = case _ of
    Select key event -> do
      event # MouseEvent.toEvent # Event.stopPropagation # liftEffect
      H.modify_ (Record.modify (Proxy :: Proxy "open") (const false))
      H.raise key
    Toggle event -> do
      event # MouseEvent.toEvent # Event.stopPropagation # liftEffect
      H.modify_ (Record.modify (Proxy :: Proxy "open") not)
    MouseLeave event -> do
      event # MouseEvent.toEvent # Event.stopPropagation # liftEffect
      H.modify_ (Record.modify (Proxy :: Proxy "open") (const false))

  render state =
    HH.div []
      [ HH.div
          [ HE.onClick Toggle
          ]
          [ state.title # HH.fromPlainHTML ]
      , HH.div [ Style.style $ (if state.open then [] else Style.hidden) <> [ "position: relative" ] ]
          [ HH.div
              [ HE.onMouseLeave MouseLeave
              , Style.style $ Style.flex_column <> [ "position: absolute", "top: 0.5em", "max-height: 16em", "overflow-y: scroll", "background-color: gray" ] <> Style.rounded <> Style.shadowed
              ]
              ( state.items
                  <#> \(label /\ output) ->
                      HH.div
                        [ HE.onClick (Select output)
                        ]
                        [ label # HH.fromPlainHTML ]
              )
          ]
      ]
