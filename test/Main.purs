module Test.Main where

import Foliage.Program
import Prelude
import Control.Monad.Except (runExceptT)
import Control.Monad.Writer (runWriterT)
import Data.Either (Either(..))
import Data.Foldable (traverse_)
import Data.List (List(..), (:))
import Data.List as List
import Data.Map as Map
import Data.Tuple.Nested ((/\))
import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Class.Console as Console
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
        prog =
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
                                    { hypotheses: Prop (Name "R") UnitTerm : Nil
                                    , conclusion: Prop (Name "S") UnitTerm
                                    }
                            ]
                      }
                  )
            }
      let
        handleLogs = traverse_ Console.logShow
      props <-
        interpProgram prog
          # ( runWriterT
                >=> \(a /\ logs) -> do
                    logs # handleLogs
                    pure a
            )
          # runExceptT
      shouldEqual
        props
        ( (Right <<< List.fromFoldable)
            [ Prop (Name "S") UnitTerm
            , Prop (Name "R") UnitTerm
            ]
        )
