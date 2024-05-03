module Foliage.Example.Dijkstra (dijkstra) where

import Data.Tuple.Nested
import Foliage.Program
import Prelude hiding (compare)

import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT, Except)
import Control.Plus (empty)
import Data.Array as Array
import Data.Homogeneous.Record (fromHomogeneous, homogeneous)
import Data.Homogeneous.Record as Homo
import Data.Int as Int
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List (List(..), (:))
import Data.List as List
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (wrap)
import Data.String as String
import Data.Tuple (Tuple(..), curry)
import Data.Tuple.Nested ((/\))
import Foliage.Common (Exc(..), Opaque(..), _error)
import Prelude as Prelude
import Type.Proxy (Proxy(..))
import Unsafe (todo)

name =
  { int: "Int"
  , node: "Node"
  , weight: "Weight"
  , addWeight: "addWeight"
  , edge: "Edge"
  , dist: "Distance"
  , edge_distance: "EdgeDistance"
  , append_edge_distance: "AppendEdgeDistance"
  }
    # homogeneous
    # map Name
    # fromHomogeneous

function =
  { addWeight:
      \args -> do
        w1 <- args # getValidatedArg { f: "addWeight", x: "w1", dt: NamedDataType name.int, dt_name: "Int", fromString: Int.fromString }
        w2 <- args # getValidatedArg { f: "addWeight", x: "w2", dt: NamedDataType name.int, dt_name: "Int", fromString: Int.fromString }
        let
          w3 = w1 + w2
        pure (LiteralTerm (Int.toStringAs Int.decimal w3) (NamedDataType name.int))
  }
    # homogeneous
    # map (Opaque (Proxy :: Proxy "function"))

compare =
  { "Int":
      ( ( case _ of
            LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
              | n1 == name.int && n2 == name.int -> do
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

dijkstra :: Lazy Program
dijkstra =
  Lazy.defer \_ ->
    let
      lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering
    in
      Program
        { name: Name "Dijstra"
        , doc:
            """
This program implements Dijstra's algorithm for computing the shortest path in a graph from a starting node to any other node in the graph.
          """
              # String.trim
              # Just
        , modules:
            Map.singleton mainModuleName
              ( Module
                  { name: mainModuleName
                  , doc: Nothing
                  , dataTypeDefs:
                      Map.fromFoldable
                        [ name.int /\ ExternalDataTypeDef "Int"
                        , name.node /\ DataTypeDef (NamedDataType name.int)
                        , name.weight /\ DataTypeDef (NamedDataType name.int)
                        ]
                  , latticeTypeDefs:
                      Map.fromFoldable
                        [ name.int /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare `Homo.get` _."Int" }
                        , name.node /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType name.int))
                        , name.weight /\ LatticeTypeDef (OppositeLatticeType (NamedLatticeType name.int))
                        ]
                  , functionDefs:
                      Map.fromFoldable
                        [ name.addWeight
                            /\ ExternalFunctionDef
                                { name: "addWeight"
                                , inputs: [ "w1" /\ NamedDataType name.weight, "w2" /\ NamedDataType name.weight ]
                                , output: NamedDataType name.weight
                                , impl: function `Homo.get` _.addWeight
                                }
                        ]
                  , relations:
                      Map.fromFoldable
                        [ name.edge /\ Relation { domain: (NamedLatticeType name.node `lex` NamedLatticeType name.node) `lex` NamedLatticeType name.weight }
                        , name.dist /\ Relation { domain: (NamedLatticeType name.node `lex` NamedLatticeType name.node) `lex` NamedLatticeType name.weight }
                        ]
                  , rules:
                      Map.fromFoldable
                        ( [ [ {-Tuple name.edge_distance
                                let
                                  { n1, n2, w } = { n1: wrap "n1", n2: wrap "n2", w: wrap "w" }
                                in
                                  Rule
                                    { hypotheses:
                                        Hypothesis (Prop name.edge ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w)) []
                                          : Nil
                                    , conclusion: Prop name.dist ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w)
                                    }
                            , -} Tuple name.append_edge_distance
                                let
                                  { n1, n2, n3, w1, w2, w3 } = { n1: wrap "n1", n2: wrap "n2", n3: wrap "n3", w1: wrap "w1", w2: wrap "w2", w3: wrap "w3" }
                                in
                                  Rule
                                    { hypotheses:
                                        List.fromFoldable
                                          [ Hypothesis (Prop name.dist ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w1)) []
                                          , Hypothesis (Prop name.edge ((VarTerm n2 `PairTerm` VarTerm n3) `PairTerm` VarTerm w2))
                                              [ FunctionSideHypothesis
                                                  { resultVarName: w3
                                                  , functionName: name.addWeight
                                                  , args: [ VarTerm w1, VarTerm w2 ]
                                                  }
                                              ]
                                          ]
                                    , conclusion: Prop name.dist ((VarTerm n1 `PairTerm` VarTerm n3) `PairTerm` VarTerm w3)
                                    }
                            ]
                          , compileGraph graph1
                          ]
                            # Array.concat
                        )
                  }
              )
        }

-- | Directed Graph
data Graph
  = Graph Int (Array ((Int /\ Int) /\ Int))

compileGraph :: Graph -> Array (Name /\ Rule)
compileGraph (Graph n es) =
  Array.cons
    ( Name (show n <> " <==> " <> show n)
        /\ Rule
            { hypotheses: Nil
            , conclusion: Prop name.dist ((LiteralTerm (show n) (NamedDataType name.int) `PairTerm` LiteralTerm (show n) (NamedDataType name.int)) `PairTerm` LiteralTerm (show 0) (NamedDataType name.int))
            }
    )
    (es <#> f)
  where
  f ((n1 /\ n2) /\ w) =
    (wrap (show n1 <> " -> " <> show n2))
      /\ Rule
          { hypotheses: Nil
          , conclusion: Prop name.edge ((LiteralTerm (show n1) (NamedDataType name.int) `PairTerm` LiteralTerm (show n2) (NamedDataType name.int)) `PairTerm` LiteralTerm (show w) (NamedDataType name.int))
          }

graph1 :: Graph
graph1 =
  -- should try 0 --> 1 first, but then find that 0 --> 2 --> 3 is faster route to 3
  Graph
    0
    [ (0 /\ 1) /\ 10
    , (1 /\ 3) /\ 40
    , (0 /\ 2) /\ 20
    , (2 /\ 3) /\ 10
    ]
