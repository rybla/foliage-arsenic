module Foliage.Example (examples) where

import Data.Lazy (Lazy)
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Example.Blank as Blank
import Foliage.Example.Dijkstra as Dijkstra
import Foliage.Example.Parsing as Parsing
import Foliage.Program (Module)

examples :: Array (String /\ Lazy Module)
examples =
  [ "Blank" /\ Blank.blank
  , "Dijkstra . Diamond" /\ Dijkstra.diamond
  , "Dijkstra . Cycle" /\ Dijkstra.cycle
  -- , "Parsing . ABC" /\ Parsing.abc
  , "Parsing . Nat" /\ Parsing.nat
  -- , "Parsing . Binary Tree" /\ Parsing.binary_tree
  -- , "Parsing . Ambiguous" /\ Parsing.ambiguous
  ]
