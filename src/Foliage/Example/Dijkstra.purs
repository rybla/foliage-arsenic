module Foliage.Example.Dijkstra (diamond, cycle) where

import Prelude
import Foliage.Program (DataType(..), DataTypeDef(..), FunctionDef(..), Hypothesis(..), LatticeType(..), LatticeTypeDef(..), Module(..), Name(..), ProductLatticeTypeOrdering(..), Program(..), PropF(..), Relation(..), Rule(..), SideHypothesis(..), Term, TermF(..), getValidatedArg, mainModuleName)
import Data.Tuple.Nested (type (/\), (/\))
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT)
import Control.Plus (empty)
import Data.Array as Array
import Data.Either (Either)
import Data.Homogeneous.Record (Homogeneous, homogeneous)
import Data.Homogeneous.Record as Homo
import Data.Identity (Identity)
import Data.Int as Int
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List (List(..))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (wrap)
import Data.String as String
import Data.Tuple (Tuple(..))
import Foliage.Common (Exc(..), Opaque(..), _error)
import Prelude as Prelude
import Type.Proxy (Proxy(..))

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
diamond :: Lazy Program
diamond =
  make_dijkstra "Diamond"
    ( Graph
        { start_node: 0
        , edges:
            [ (0 /\ 1) /\ 10
            , (1 /\ 3) /\ 40
            , (0 /\ 2) /\ 20
            , (2 /\ 3) /\ 10
            ]
        }
    )

cycle :: Lazy Program
cycle =
  make_dijkstra "Cycle"
    ( Graph
        { start_node: 0
        , edges:
            [ (0 /\ 1) /\ 10
            , (1 /\ 0) /\ 11
            ]
        }
    )

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name ::
  Homogeneous
    ( addWeight :: Void
    , append_edge_distance :: Void
    , dist :: Void
    , edge :: Void
    , edge_distance :: Void
    , int :: Void
    , node :: Void
    , weight :: Void
    )
    Name
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

function ::
  Homogeneous
    ( addWeight :: Void
    )
    (Opaque "function" (Map String Term -> Either String Term))
function =
  { addWeight:
      \args -> do
        w1 <- args # getValidatedArg { f: "addWeight", x: "w1", dt: NamedDataType (name `Homo.get` _.int), dt_name: "Int", fromString: Int.fromString }
        w2 <- args # getValidatedArg { f: "addWeight", x: "w2", dt: NamedDataType (name `Homo.get` _.int), dt_name: "Int", fromString: Int.fromString }
        let
          w3 = w1 + w2
        pure (LiteralTerm (Int.toStringAs Int.decimal w3) (NamedDataType (name `Homo.get` _.int)))
  }
    # homogeneous
    # map (Opaque (Proxy :: Proxy "function"))

compare ::
  Homogeneous
    ( "Int" :: Void
    )
    (Opaque "compare" (Tuple Term Term -> ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map Name Term)))
compare =
  { "Int":
      case _ of
        LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
          | n1 == (name `Homo.get` _.int) && n2 == (name `Homo.get` _.int) -> do
            x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
            x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
            pure (Prelude.compare x1 x2 /\ empty)
        t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })
  }
    # homogeneous
    # map (Opaque (Proxy :: Proxy "compare"))

make_dijkstra :: String -> Graph -> Lazy Program
make_dijkstra label graph =
  Lazy.defer \_ ->
    let
      lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering
    in
      Program
        { name: Name ("Dijstra . " <> label)
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
                  , initialGas: 50
                  , dataTypeDefs:
                      Map.fromFoldable
                        [ (name `Homo.get` _.int) /\ ExternalDataTypeDef "Int"
                        , (name `Homo.get` _.node) /\ DataTypeDef (NamedDataType (name `Homo.get` _.int))
                        , (name `Homo.get` _.weight) /\ DataTypeDef (NamedDataType (name `Homo.get` _.int))
                        ]
                  , latticeTypeDefs:
                      Map.fromFoldable
                        [ (name `Homo.get` _.int) /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare `Homo.get` _."Int" }
                        , (name `Homo.get` _.node) /\ LatticeTypeDef (DiscreteLatticeType (NamedLatticeType (name `Homo.get` _.int)))
                        , (name `Homo.get` _.weight) /\ LatticeTypeDef (OppositeLatticeType (NamedLatticeType (name `Homo.get` _.int)))
                        ]
                  , functionDefs:
                      Map.fromFoldable
                        [ name `Homo.get` _.addWeight
                            /\ ExternalFunctionDef
                                { name: "addWeight"
                                , inputs: [ "w1" /\ NamedDataType (name `Homo.get` _.weight), "w2" /\ NamedDataType (name `Homo.get` _.weight) ]
                                , output: NamedDataType (name `Homo.get` _.weight)
                                , impl: function `Homo.get` _.addWeight
                                }
                        ]
                  , relations:
                      Map.fromFoldable
                        [ (name `Homo.get` _.edge) /\ Relation { domain: (NamedLatticeType (name `Homo.get` _.node) `lex` NamedLatticeType (name `Homo.get` _.node)) `lex` NamedLatticeType (name `Homo.get` _.weight) }
                        , (name `Homo.get` _.dist) /\ Relation { domain: (NamedLatticeType (name `Homo.get` _.node) `lex` NamedLatticeType (name `Homo.get` _.node)) `lex` NamedLatticeType (name `Homo.get` _.weight) }
                        ]
                  , rules:
                      Map.fromFoldable
                        ( [ [ {-Tuple (name `Homo.get` _.edge)_distance
                                let
                                  { n1, n2, w } = { n1: wrap "n1", n2: wrap "n2", w: wrap "w" }
                                in
                                  Rule
                                    { hypotheses:
                                        Hypothesis (Prop (name `Homo.get` _.edge) ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w)) []
                                          : Nil
                                    , conclusion: Prop (name `Homo.get` _.dist) ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w)
                                    }
                            , -} Tuple (name `Homo.get` _.append_edge_distance)
                                let
                                  { n1, n2, n3, w1, w2, w3 } = { n1: wrap "n1", n2: wrap "n2", n3: wrap "n3", w1: wrap "w1", w2: wrap "w2", w3: wrap "w3" }
                                in
                                  Rule
                                    { hypotheses:
                                        List.fromFoldable
                                          [ Hypothesis (Prop (name `Homo.get` _.dist) ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w1)) []
                                          , Hypothesis (Prop (name `Homo.get` _.edge) ((VarTerm n2 `PairTerm` VarTerm n3) `PairTerm` VarTerm w2))
                                              [ FunctionSideHypothesis
                                                  { resultVarName: w3
                                                  , functionName: name `Homo.get` _.addWeight
                                                  , args: [ VarTerm w1, VarTerm w2 ]
                                                  }
                                              ]
                                          ]
                                    , conclusion: Prop (name `Homo.get` _.dist) ((VarTerm n1 `PairTerm` VarTerm n3) `PairTerm` VarTerm w3)
                                    }
                            ]
                          , compileGraph graph
                          ]
                            # Array.concat
                        )
                  }
              )
        }

--------------------------------------------------------------------------------
-- Intermediate graph representation
--------------------------------------------------------------------------------
-- | Directed Graph, encoded by the head node (where Dijstra's algorithm starts)
-- | and edges each encode in the following form:
-- | 
-- | ```
-- | ((<edge source node>, <edge target node>), <edge weight>)
-- | ```
data Graph
  = Graph { start_node :: Int, edges :: (Array ((Int /\ Int) /\ Int)) }

compileGraph :: Graph -> Array (Name /\ Rule)
compileGraph (Graph { start_node: n, edges: es }) =
  Array.cons
    ( Name (show n <> " <==> " <> show n)
        /\ Rule
            { hypotheses: Nil
            , conclusion: Prop (name `Homo.get` _.dist) ((LiteralTerm (show n) (NamedDataType (name `Homo.get` _.int)) `PairTerm` LiteralTerm (show n) (NamedDataType (name `Homo.get` _.int))) `PairTerm` LiteralTerm (show 0) (NamedDataType (name `Homo.get` _.int)))
            }
    )
    (es <#> f)
  where
  f ((n1 /\ n2) /\ w) =
    (wrap (show n1 <> " -> " <> show n2))
      /\ Rule
          { hypotheses: Nil
          , conclusion: Prop (name `Homo.get` _.edge) ((LiteralTerm (show n1) (NamedDataType (name `Homo.get` _.int)) `PairTerm` LiteralTerm (show n2) (NamedDataType (name `Homo.get` _.int))) `PairTerm` LiteralTerm (show w) (NamedDataType (name `Homo.get` _.int)))
          }
