module Test.Main where

import Data.Tuple.Nested
import Foliage.Program
import Prelude

import Control.Monad.Except (Except, ExceptT(..), runExcept, runExceptT, throwError)
import Control.Monad.Reader (runReaderT)
import Control.Monad.State (evalStateT)
import Control.Monad.Writer (runWriterT)
import Control.Plus (empty)
import Data.Either (Either(..))
import Data.Homogeneous.Record (fromHomogeneous, homogeneous)
import Data.Homogeneous.Record as Homo
import Data.Int as Int
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple (fst)
import Effect (Effect)
import Effect.Aff (launchAff_)
import Foliage.Common (Exc(..), Opaque(..), _error)
import Foliage.Example.Library (pair, termUnit)
import Foliage.Interpretation (Ctx(..), compareProp)
import Partial.Unsafe (unsafeCrashWith)
import Prelude as Prelude
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Test.Spec.Runner.Event (Name)
import Type.Proxy (Proxy(..))
import Unsafe (todo)

main :: Effect Unit
main = launchAff_ (runSpec [ consoleReporter ] test)

test :: Spec Unit
test = do
  test_comparisons
  pure unit

test_comparisons :: Spec Unit
test_comparisons =
  describe "comparisons" do
    it "OppositeLatticeType" do
      let
        eval :: _ -> Maybe Ordering
        eval m =
          m
            # runExceptT
            # runWriterT
            # map fst
            # flip runReaderT ctx
            # runExcept
            # case _ of
                Left error_exc -> unsafeCrashWith $ show error_exc
                Right (Left compare_exc) -> Nothing
                Right (Right (o /\ sigma)) -> Just o
      shouldEqual
        ( compareProp
            (Prop (FixedName "P") (PairTerm (PairTerm (LiteralTerm "0" intDty) (LiteralTerm "0" intDty)) (LiteralTerm "1" intDty)))
            (Prop (FixedName "P") (PairTerm (PairTerm (LiteralTerm "0" intDty) (LiteralTerm "0" intDty)) (LiteralTerm "0" intDty)))
            # eval
        )
        (Just LT)
      shouldEqual
        ( compareProp
            (Prop (FixedName "P") (PairTerm (PairTerm (LiteralTerm "0" intDty) (LiteralTerm "0" intDty)) (LiteralTerm "0" intDty)))
            (Prop (FixedName "P") (PairTerm (PairTerm (LiteralTerm "0" intDty) (LiteralTerm "0" intDty)) (LiteralTerm "1" intDty)))
            # eval
        )
        (Just GT)
  where
  ctx = Ctx { modules: Map.singleton mainModuleName mainModule, focusModule: mainModule }

  mainModule =
    Module
      { name: FixedName "Main"
      , doc: Nothing
      , initialGas: 0
      , dataTypeDefs: Map.fromFoldable []
      , functionDefs: Map.fromFoldable []
      , latticeTypeDefs:
          Map.fromFoldable
            [ name `Homo.get` _.int /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare `Homo.get` _."Int" } ]
      , relations:
          Map.fromFoldable
            {-[ name `Homo.get` _.p /\ Relation { domain: (intLty `lex` intLty) `lex` intLty } ]-}
            [ name `Homo.get` _.p
                /\ Relation
                    { domain: (intLty `lex` intLty) `lex` OppositeLatticeType intLty
                    , render: \_ -> todo "render P"
                    , canonical_term: (VarTerm (newVarName "m") `pair` VarTerm (newVarName "n")) `pair` VarTerm (newVarName "l")
                    }
            ]
      , rules: empty
      }

  lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering

  intDty = NamedDataType (FixedName "Int")

  intLty = NamedLatticeType (FixedName "Int")

  name =
    { int: "Int"
    , p: "P"
    }
      # homogeneous
      # map FixedName

  compare =
    { "Int":
        ( ( case _ of
              LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
                | n1 == name `Homo.get` _.int && n2 == name `Homo.get` _.int -> do
                  x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
                  x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
                  pure (Prelude.compare x1 x2 /\ empty)
              t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })
          ) ::
            Term /\ Term -> ExceptT (Exc "error") (Except (Exc "compare")) LatticeOrdering
        )
    }
      # homogeneous
      # map (Opaque (Proxy :: Proxy "compare"))

-- import Foliage.Program
-- import Control.Monad.Except (runExceptT)
-- import Control.Monad.Writer (runWriterT)
-- import Data.Either (Either(..))
-- import Data.Foldable (traverse_)
-- import Data.List (List(..), (:))
-- import Data.List as List
-- import Data.Map as Map
-- import Data.Newtype (unwrap)
-- import Data.Tuple.Nested ((/\))
-- import Effect (Effect)
-- import Effect.Aff (launchAff_)
-- import Effect.Class.Console as Console
-- import Foliage.Interpretation (interpProgram)
-- import Test.Spec (Spec, describe, it)
-- import Test.Spec.Assertions (shouldEqual)
-- import Test.Spec.Reporter (consoleReporter)
-- import Test.Spec.Runner (runSpec)
-- main :: Effect Unit
-- main = launchAff_ (runSpec [ consoleReporter ] test)
-- test :: Spec Unit
-- test = do
--   test_example
-- test_example :: Spec Unit
-- test_example =
--   describe "example" do
--     it "example 1" do
--       let
--         prog =
--           Program
--             { name: Name "Example 1"
--             , modules:
--                 Map.singleton mainModuleName
--                   ( Module
--                       { name: mainModuleName
--                       , dataTypeDefs: Map.empty
--                       , functionDefs: Map.empty
--                       , latticeTypeDefs: Map.empty
--                       , relations:
--                           Map.fromFoldable
--                             [ Name "R" /\ Relation { domain: UnitLatticeType }
--                             , Name "S" /\ Relation { domain: UnitLatticeType }
--                             ]
--                       , rules:
--                           Map.fromFoldable
--                             [ Name "R1"
--                                 /\ Rule
--                                     { hypotheses: Nil
--                                     , conclusion: Prop (Name "R") UnitTerm
--                                     }
--                             , Name "S1"
--                                 /\ Rule
--                                     { hypotheses: Hypothesis (Prop (Name "R") UnitTerm) [] : Nil
--                                     , conclusion: Prop (Name "S") UnitTerm
--                                     }
--                             ]
--                       }
--                   )
--             }
--       let
--         handleLogs = traverse_ (Console.logShow <<< unwrap)
--       props <-
--         interpProgram prog
--           # ( runWriterT
--                 >=> \(a /\ logs) -> do
--                     logs # handleLogs
--                     pure a
--             )
--           # runExceptT
--       shouldEqual
--         props
--         ( (Right <<< List.fromFoldable)
--             [ Prop (Name "S") UnitTerm
--             , Prop (Name "R") UnitTerm
--             ]
--         )
