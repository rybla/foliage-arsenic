module Foliage.Example.Blank where

import Foliage.Program
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map as Map
import Data.Maybe (Maybe(..))

blank :: Lazy Program
blank =
  Lazy.defer \_ ->
    Program
      { name: staticName "Blank"
      , doc: Nothing
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , doc: Nothing
                , initialGas: 100
                , dataTypeDefs: Map.empty
                , functionDefs: Map.empty
                , latticeTypeDefs: Map.empty
                , relations: Map.empty
                , rules: Map.empty
                }
            )
      }
