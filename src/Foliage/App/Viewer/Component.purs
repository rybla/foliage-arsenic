module Foliage.App.Viewer.Component where

import Prelude

import Data.Array as Array
import Data.List (List)
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Rendering (renderProp)
import Foliage.App.Style as Style
import Foliage.Interpretation as Foliage.Interpretation
import Foliage.Program (Prop)
import Halogen (Component, mkComponent)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE

data Query a
  = SetResult (Maybe Result) a

type Input
  = {}

type State
  = { result :: Maybe Result }

data Result
  = OkResult { props :: Array Prop }
  | ErrResult { err :: Foliage.Interpretation.Err }

data Output
  = Ran

data Action
  = Run

component :: Component Query Input Output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState :: Input -> State
  initialState _input = { result: Nothing }

  eval = H.mkEval H.defaultEval { handleQuery = handleQuery, handleAction = handleAction }

  handleQuery :: forall a. Query a -> _ (Maybe a)
  handleQuery = case _ of
    SetResult result a -> do
      H.modify_ _ { result = result }
      pure (Just a)

  handleAction = case _ of
    Run -> H.raise Ran

  render state =
    HH.div [ Style.style $ Style.rounded <> Style.padding_big <> Style.shadowed <> Style.font_code <> Style.flex_column <> [ "gap: 1.0em" ] ]
      ( Array.concat
          [ [ HH.div []
                [ HH.div [ Style.style $ Style.flex_row ]
                    ( [ HH.div []
                          [ HH.button
                              [ HE.onClick (const Run)
                              , Style.style Style.button
                              ]
                              [ HH.text "Run" ]
                          ]
                      ]
                    )
                ]
            ]
          , case state.result of
              Nothing -> []
              Just (ErrResult res) ->
                [ HH.div [ Style.style $ Style.font_code <> Style.flex_column ]
                    [ HH.div [ Style.style $ Style.color_error ]
                        [ show res.err # HH.text ]
                    ]
                ]
              Just (OkResult res) ->
                [ HH.div [ Style.style $ Style.font_code <> Style.flex_column ]
                    (res.props # map \prop -> HH.div [] [ prop # renderProp ])
                ]
          ]
      )
