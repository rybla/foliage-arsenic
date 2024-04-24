module Foliage.Example.Blank where

import Prelude
import Foliage.Program
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map as Map

blank :: Lazy Program
blank =
  Lazy.defer \_ ->
    Program
      { name: Name "Main"
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , dataTypeDefs: Map.empty
                , functionDefs: Map.empty
                , latticeTypeDefs: Map.empty
                , relations: Map.empty
                , rules: Map.empty
                }
            )
      }
