module Foliage.App.Template where

import Prelude
import Halogen.HTML as HH
import Halogen.HTML.Properties as HP

row props = HH.div ([ HP.style "display: flex; flex-direction: row; gap: 0.5em" ] <> props)

column props = HH.div ([ HP.style "display: flex; flex-direction: column; gap: 0.5em" ] <> props)
