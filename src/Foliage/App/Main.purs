module Foliage.App.Main where

import Prelude
import Effect (Effect)
import Effect.Class.Console as Console
import Foliage.App.Component (component)
import Halogen.Aff as HA
import Halogen.VDom.Driver as VDomDriver

main :: Effect Unit
main =
  HA.runHalogenAff do
    Console.log "[Foliage.App.Main]"
    VDomDriver.runUI component {} =<< HA.awaitBody
