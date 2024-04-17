module Test.Main where

import Prelude
import Data.Tuple.Nested ((/\))
import Foliage.Program (LatticeType(..), ModuleF(..), Name(..), ProgramF(..), PropF(..), Relation(..), RuleF(..), TermF(..), mainModuleName)
import Control.Monad.Except (runExceptT)
import Data.Either (Either(..))
import Data.List (List(..), (:))
import Data.List as List
import Data.Map as Map
import Effect (Effect)
import Effect.Aff (launchAff_)
import Foliage.Interpretation (interpProgram)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ (runSpec [ consoleReporter ] test)

test :: Spec Unit
test = do
  test_example

test_example :: Spec Unit
test_example =
  describe "example" do
    it "example 1" do
      let
        prog = Program { modules: Map.singleton mainModuleName mainModule }

        mainModule =
          Module
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
                          { params: Map.empty
                          , hypotheses: Nil
                          , conclusion: Prop (Name "R") (UnitTerm UnitLatticeType)
                          }
                  , Name "S1"
                      /\ Rule
                          { params: Map.empty
                          , hypotheses: Prop (Name "R") (UnitTerm UnitLatticeType) : Nil
                          , conclusion: Prop (Name "S") (UnitTerm UnitLatticeType)
                          }
                  ]
            }
      concreteProps <- interpProgram prog # runExceptT
      shouldEqual
        concreteProps
        ( (Right <<< List.fromFoldable)
            [ Prop (Name "S") (UnitTerm UnitLatticeType)
            , Prop (Name "R") (UnitTerm UnitLatticeType)
            ]
        )
