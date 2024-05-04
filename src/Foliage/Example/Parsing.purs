module Foliage.Example.Parsing where

import Foliage.Program

import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.Map as Map
import Data.Maybe (Maybe(..))

parsing :: Lazy Program
parsing =
  Lazy.defer \_ ->
    Program
      { name: Name "Main"
      , doc: Nothing
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , doc: Nothing
                , initialGas: 40
                , dataTypeDefs: Map.empty
                , functionDefs: Map.empty
                , latticeTypeDefs: Map.empty
                , relations: Map.empty
                , rules: Map.empty
                }
            )
      }
