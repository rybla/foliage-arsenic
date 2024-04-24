module BrowserUtility where

import Prelude
import Control.Promise (Promise, toAffE)
import Data.Argonaut (Json)
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Aff (Aff)
import Effect.Aff.Compat (fromEffectFnAff)
import Web.Event.Internal.Types (Event)

foreign import saveJson :: { json :: Json, filename :: String } -> Effect Unit

foreign import loadJson :: { onLoad :: Json -> Effect Unit } -> Effect Unit

foreign import getJsonFromChangeInputFile_ :: forall a. { err :: Maybe a, ok :: a -> Maybe a } -> { event :: Event } -> Effect (Promise (Maybe Json))

getJsonFromChangeInputFile :: _ -> Aff _
getJsonFromChangeInputFile args = getJsonFromChangeInputFile_ { err: Nothing, ok: Just } args # toAffE
