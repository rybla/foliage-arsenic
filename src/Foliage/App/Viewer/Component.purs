module Foliage.App.Viewer.Component where

import Prelude

import Control.Monad.State (modify_)
import Data.Array as Array
import Data.List (List)
import Data.List as List
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (unwrap)
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Foliage.App.Rendering (line)
import Foliage.App.Rendering as Rendering
import Foliage.App.Style as Style
import Foliage.Common (Exc)
import Foliage.Interpretation (Env(..))
import Foliage.Interpretation as Foliage.Interpretation
import Foliage.Program (Prop, from_RipeRule_to_Rule)
import Halogen (Component, mkComponent)
import Halogen as H
import Halogen.HTML as HH
import Halogen.HTML.Events as HE

data Query a
  = SetResult (Maybe Result) a
  | SetIntermediateEnv (Maybe Env) a

type Input
  = {}

type State
  = { result :: Maybe Result
    , intermediate_env :: Maybe Env
    }

data Result
  = OkResult { env :: Env }
  | PendingResult
  | ErrResult { err :: Exc "error", env :: Maybe Env }

data Output
  = Ran

data Action
  = Run

component :: Component Query Input Output Aff
component = mkComponent { initialState, eval, render }
  where
  initialState :: Input -> State
  initialState _input =
    { result: Nothing
    , intermediate_env: Nothing
    }

  eval = H.mkEval H.defaultEval { handleQuery = handleQuery, handleAction = handleAction }

  handleQuery :: forall a. Query a -> _ (Maybe a)
  handleQuery = case _ of
    SetResult result a -> do
      modify_ _ { result = result }
      pure (Just a)
    SetIntermediateEnv mb_env a -> do
      modify_ _ { intermediate_env = mb_env }
      pure (Just a)

  handleAction = case _ of
    Run -> H.raise Ran

  renderEnv (Env env) =
    [ HH.div [ Style.style $ Style.flex_column ]
        ( [ [ HH.div [ Style.style $ Style.bold ] [ HH.text "known_props" ] ]
              <> ( env.known_props
                    # Map.values
                    # List.fold
                    # map (Rendering.render >>> Rendering.line >>> HH.span_ >>> HH.fromPlainHTML)
                    # Array.fromFoldable
                )
          , [ HH.div [ Style.style $ Style.bold ] [ HH.text "active_props" ] ]
              <> ( env.active_props
                    # map
                        ( \{ prop, isNew } ->
                            HH.div [ Style.style $ Style.flex_row ]
                              [ [ HH.text $ "[new:" <> (if isNew then "T" else "F") <> "]" ] # HH.div []
                              , prop # Rendering.render # Rendering.line # HH.div [] # HH.fromPlainHTML
                              ]
                        )
                    # Array.fromFoldable
                )
          , [ HH.div [ Style.style $ Style.bold ] [ HH.text "ripe_rules" ] ]
              <> ( env.ripe_rules
                    # Map.values
                    # map
                        ( HH.div [ Style.style $ Style.flex_column ]
                            <<< Array.fromFoldable
                            <<< map (from_RipeRule_to_Rule >>> Rendering.render >>> Rendering.line >>> HH.div [ Style.style $ Style.margin_small <> Style.padding_small <> Style.boundaries ] >>> HH.fromPlainHTML)
                        )
                    # Array.fromFoldable
                )
          ]
            # Array.concat
        )
    ]

  render state =
    HH.div [ Style.style $ Style.font_code <> Style.flex_column <> [ "gap: 1.0em" ] ]
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
          , [ HH.div [ Style.style $ Style.font_code <> Style.flex_column <> [ "overflow: scroll" ] ] case state.intermediate_env of
                Just env -> renderEnv env
                Nothing -> case state.result of
                  Nothing -> []
                  Just (ErrResult res) -> case res.env of
                    Nothing -> [ show res.err # HH.text ]
                    Just env -> renderEnv env <> [ show res.err # HH.text ]
                  Just PendingResult ->
                    [ HH.div [ Style.style $ Style.font_prose ]
                        [ HH.text "running..." ]
                    ]
                  Just (OkResult res) -> renderEnv res.env
            ]
          ]
      )
