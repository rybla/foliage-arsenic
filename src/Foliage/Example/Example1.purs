module Foliage.Example.Example1 where

import Prelude
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List (List(..), (:))
import Data.Map as Map
import Data.Tuple.Nested ((/\))
import Foliage.Program (Hypothesis(..), LatticeType(..), Module(..), Name(..), Program(..), PropF(..), Relation(..), Rule(..), TermF(..), mainModuleName)

example1 :: Lazy Program
example1 =
  Lazy.defer \_ ->
    Program
      { name: Name "Example 1"
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , dataTypeDefs: Map.empty
                , functionDefs: Map.empty
                , latticeTypeDefs: Map.empty
                , relations:
                    Map.fromFoldable
                      [ Name "R" /\ Relation { domain: UnitLatticeType }
                      , Name "S" /\ Relation { domain: UnitLatticeType }
                      ]
                , rules:
                    Map.fromFoldable
                      [ Name "R1"
                          /\ Rule
                              { hypotheses: Nil
                              , conclusion: Prop (Name "R") UnitTerm
                              }
                      , Name "S1"
                          /\ Rule
                              { hypotheses: Hypothesis (Prop (Name "R") UnitTerm) [] : Nil
                              , conclusion: Prop (Name "S") UnitTerm
                              }
                      ]
                }
            )
      }
