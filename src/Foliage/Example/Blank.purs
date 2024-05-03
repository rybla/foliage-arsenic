module Foliage.Example.Blank where

import Foliage.Program
import Prelude

import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map as Map
import Data.Maybe (Maybe(..))

blank :: Lazy Program
blank =
  Lazy.defer \_ ->
    Program
      { name: Name "Main"
      , doc: Nothing
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , doc: Nothing
                , dataTypeDefs: Map.empty
                , functionDefs: Map.empty
                , latticeTypeDefs: Map.empty
                , relations: Map.empty
                , rules: Map.empty
                }
            )
      }
