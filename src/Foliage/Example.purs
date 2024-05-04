module Foliage.Example (examples) where

import Data.Lazy (Lazy)
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Example.Blank as Blank
import Foliage.Example.Dijkstra as Dijkstra
import Foliage.Program (Program)

examples :: Array (String /\ Lazy Program)
examples =
  [ "Blank" /\ Blank.blank
  , "Dijkstra . Diamond" /\ Dijkstra.diamond
  , "Dijkstra . Cycle" /\ Dijkstra.cycle
  ]
