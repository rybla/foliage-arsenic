module Foliage.Example.Dijkstra (diamond, cycle) where

import Foliage.Program
import Prelude
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
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.App.Style as Style
import Foliage.Common (Exc(..), Opaque(..), Html, _error)
import Foliage.Example.Library (pair)
import Halogen.HTML as HH
import Partial.Unsafe (unsafeCrashWith)
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
name :: Homogeneous _ FixedName
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
    # map FixedName

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
    (Opaque "compare" (Tuple Term Term -> ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map VarName Term)))
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

ltyWeight = NamedLatticeType (name `Homo.get` _.weight)

ltyNode = NamedLatticeType (name `Homo.get` _.node)

dtyWeight = NamedDataType (name `Homo.get` _.weight)

dtyNode = NamedDataType (name `Homo.get` _.node)

make_dijkstra :: String -> Graph -> Lazy Program
make_dijkstra label graph =
  Lazy.defer \_ ->
    let
      lex = ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering
    in
      Program
        { name: FixedName ("Dijstra . " <> label)
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
                        [ (name `Homo.get` _.edge)
                            /\ Relation
                                { domain: (ltyNode `lex` ltyNode) `lex` ltyWeight
                                , render:
                                    case _ of
                                      PairTerm (PairTerm n1 n2) w -> do
                                        w <- w ⊕ mempty
                                        n1 <- n1 ⊕ mempty
                                        n2 <- n2 ⊕ mempty
                                        -- ➡
                                        pure
                                          [ HH.div [ Style.style [ "display: inline-flex", "flex-direction: row", "gap: 0.5em", "align-items: center", "justify-content: center" ] ]
                                              [ HH.div [] n1
                                              , HH.div [ Style.style [ "display: flex", "flex-direction: column", "gap: 0", "align-items: center", "justify-content: center" ] ]
                                                  [ HH.div [ Style.style [ "margin-bottom: -1.2em", "font-size: 0.7em" ] ] w
                                                  , HH.div [ Style.style [ "font-size: 1.5em" ] ] [ HH.text "⟶" ]
                                                  ]
                                              , HH.div [] n2
                                              ]
                                          ]
                                      t -> unsafeCrashWith ("[render] invalid edge term: " <> show t)
                                , canonical_term: (VarTerm (newVarName "n1") `pair` VarTerm (newVarName "n2")) `pair` VarTerm (newVarName "w")
                                }
                        , (name `Homo.get` _.dist)
                            /\ Relation
                                { domain: (ltyNode `lex` ltyNode) `lex` ltyWeight
                                , render:
                                    case _ of
                                      PairTerm (PairTerm n1 n2) w -> do
                                        w <- w ⊕ mempty
                                        n1 <- n1 ⊕ mempty
                                        n2 <- n2 ⊕ mempty
                                        pure
                                          [ HH.div [ Style.style [ "display: inline-flex", "flex-direction: row", "gap: 0.5em", "align-items: center", "justify-content: center" ] ]
                                              [ HH.div [] n1
                                              , HH.div [ Style.style [ "display: flex", "flex-direction: column", "gap: 0", "align-items: center", "justify-content: center" ] ]
                                                  [ HH.div [ Style.style [ "margin-bottom: -0.8em", "font-size: 0.7em" ] ] w
                                                  , HH.div [ Style.style [ "font-size: 1.5em" ] ] [ HH.text "⇒" ]
                                                  ]
                                              , HH.div [] n2
                                              ]
                                          ]
                                      t -> unsafeCrashWith ("[render] invalid dist term: " <> show t)
                                , canonical_term: (VarTerm (newVarName "n1") `pair` VarTerm (newVarName "n2")) `pair` VarTerm (newVarName "w")
                                }
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
                                  { n1, n2, n3, w1, w2, w3 } = { n1: newVarName "n1", n2: newVarName "n2", n3: newVarName "n3", w1: newVarName "w1", w2: newVarName "w2", w3: newVarName "w3" }
                                in
                                  Rule
                                    { hypotheses:
                                        List.fromFoldable
                                          [ Hypothesis (Prop (name `Homo.get` _.dist) ((VarTerm n1 `PairTerm` VarTerm n2) `PairTerm` VarTerm w1)) []
                                          , Hypothesis (Prop (name `Homo.get` _.edge) ((VarTerm n2 `PairTerm` VarTerm n3) `PairTerm` VarTerm w2))
                                              [ FunctionSideHypothesis
                                                  { resultVarVarName: w3
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

compileGraph :: Graph -> Array (FixedName /\ Rule)
compileGraph (Graph { start_node: n, edges: es }) =
  Array.cons
    ( FixedName (show n <> " ⇔ " <> show n)
        /\ Rule
            { hypotheses: Nil
            , conclusion: Prop (name `Homo.get` _.dist) ((LiteralTerm (show n) (NamedDataType (name `Homo.get` _.int)) `PairTerm` LiteralTerm (show n) (NamedDataType (name `Homo.get` _.int))) `PairTerm` LiteralTerm (show 0) (NamedDataType (name `Homo.get` _.int)))
            }
    )
    (es <#> f)
  where
  f ((n1 /\ n2) /\ w) =
    (FixedName (show n1 <> " → " <> show n2))
      /\ Rule
          { hypotheses: Nil
          , conclusion: Prop (name `Homo.get` _.edge) ((LiteralTerm (show n1) (NamedDataType (name `Homo.get` _.int)) `PairTerm` LiteralTerm (show n2) (NamedDataType (name `Homo.get` _.int))) `PairTerm` LiteralTerm (show w) (NamedDataType (name `Homo.get` _.int)))
          }
