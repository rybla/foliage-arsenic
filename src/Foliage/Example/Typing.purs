module Foliage.Example.Typing where

import Foliage.Program
import Prelude
import Control.Monad.Except (ExceptT)
import Control.Plus (empty)
import Data.Either (Either)
import Data.Homogeneous.Record (Homogeneous, fromHomogeneous, homogeneous)
import Data.Identity (Identity)
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Common (Exc, Opaque(..), Html)
import Foliage.Example.Library (pair, prod12, sumLir, termUnit)
import Foliage.Example.Library as Library
import Halogen.HTML as HH
import Partial.Unsafe (unsafeCrashWith)
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe (todo)

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
test :: Lazy Program
test = make_typing "Test"

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name :: Record _
name =
  { "": ""
  -- external types 
  -- types
  , "Var": "Var"
  , "Term": "Term"
  , "Type": "Type"
  , "Context": "Context"
  -- relations
  , "Typed": "Typed"
  , "Typed Var": "Typed Var"
  , "Parsed": "Parsed"
  }
    # homogeneous
    # map FixedName
    # fromHomogeneous
    # Record.merge Library.name

function :: Record _
function =
  ( {}
      # homogeneous
      # map (Opaque (Proxy :: Proxy "function")) ::
      Homogeneous _
        (Opaque "function" (Map String Term -> Either String Term))
  )
    # fromHomogeneous

compare :: Record _
compare =
  {}
    # ( homogeneous ::
          Record _ ->
          Homogeneous _
            ( Term /\ Term ->
              ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map VarName Term)
            )
      )
    # map (Opaque (Proxy :: Proxy "compare"))
    # fromHomogeneous

dtyInt :: DataType
dtyInt = NamedDataType name."Int"

dtyString :: DataType
dtyString = NamedDataType name."String"

ltyString :: LatticeType
ltyString = NamedLatticeType name."String"

ltyIndex :: LatticeType
ltyIndex = NamedLatticeType name."Index"

ltySymbol :: LatticeType
ltySymbol = NamedLatticeType name."Symbol"

ltyType :: LatticeType
ltyType = NamedLatticeType name."Type"

ltyTerm :: LatticeType
ltyTerm = NamedLatticeType name."Term"

ltyContext :: LatticeType
ltyContext = NamedLatticeType name."Context"

ltyVar :: LatticeType
ltyVar = NamedLatticeType name."Var"

--------------------------------------------------------------------------------
-- Program
--------------------------------------------------------------------------------
make_typing :: String -> Lazy Program
make_typing label =
  Lazy.defer \_ ->
    Program
      { name: FixedName ("Typing . " <> label)
      , doc: Nothing
      , modules:
          Map.singleton mainModuleName
            ( Module
                { name: mainModuleName
                , doc: Nothing
                , initialGas: 20
                , dataTypeDefs:
                    []
                      # Map.fromFoldable
                      # Map.union Library.dataTypeDefs
                , latticeTypeDefs:
                    [ name."Type"
                        /\ LatticeTypeDef
                            ( (ltySymbol {- arrow -} `prod12` (ltyType `prod12` ltyType))
                                `sumLir`
                                  (ltySymbol {- unit -})
                            )
                    , name."Term"
                        /\ LatticeTypeDef
                            ( (ltySymbol {- lam -} `prod12` ltyTerm)
                                `sumLir`
                                  (ltySymbol {- var -} `prod12` ltyVar)
                            )
                    , name."Context"
                        /\ LatticeTypeDef
                            ( ltySymbol {- extend -} `prod12` (ltyType `prod12` ltyContext)
                                `sumLir`
                                  ltySymbol {- empty -}
                            )
                    , name."Var" /\ LatticeTypeDef ltyIndex
                    ]
                      # Map.fromFoldable
                      # Map.union Library.latticeTypeDefs
                , relations:
                    -- Parsed (Term * (Index * Index))
                    [ name."Parsed"
                        /\ Relation
                            { domain: ltyTerm `prod12` (ltyIndex `prod12` ltyIndex)
                            , render:
                                case _ of
                                  PairTerm ast (PairTerm i0 i1) -> do
                                    i0 <- i0 # render
                                    i1 <- i1 # render
                                    [ HH.sub_ i0 :: Html ] ⊕ ast ⊕ [ HH.sub_ i1 :: Html ] ⊕ mempty
                                  t -> unsafeCrashWith ("invalid Parsed term: " <> show t)
                            , canonical_term: VarTerm (newVarName "t : Term") `pair` (VarTerm (newVarName "i0 : Index") `pair` VarTerm (newVarName "i1 : Index"))
                            }
                    -- Typed ((Term * (Index * Index)) * (Context * Type))
                    , name."Typed"
                        /\ Relation
                            { domain: (ltyTerm `prod12` (ltyIndex `prod12` ltyIndex)) `prod12` (ltyContext `prod12` ltyType)
                            , render:
                                case _ of
                                  PairTerm (PairTerm ast (PairTerm i0 i1)) (PairTerm ctx ty) -> do
                                    i0 <- i0 # render
                                    i1 <- i1 # render
                                    [ HH.sub_ i0 :: Html ] ⊕ ast ⊕ [ HH.sub_ i1 :: Html ] ⊕ [ HH.text ":" :: Html ] ⊕ ctx ⊕ [ HH.text "⊢" :: Html ] ⊕ ty ⊕ mempty
                                  t -> unsafeCrashWith ("invalid Typed term: " <> show t)
                            , canonical_term:
                                VarTerm (newVarName "t : Term")
                                  `pair`
                                    (VarTerm (newVarName "i0 : Index") `pair` VarTerm (newVarName "i1 : Index"))
                                  `pair`
                                    (VarTerm (newVarName "γ : Context") `pair` VarTerm (newVarName "α : Type"))
                            }
                    ]
                      # Map.fromFoldable
                      # Map.union Library.relations
                , functionDefs:
                    []
                      # Map.fromFoldable
                      # Map.union Library.functionDefs
                , rules:
                    [ let
                        ctx = newVarName "ctx"

                        α = newVarName "α"

                        β = newVarName "β"

                        b = newVarName "b"

                        i0 = newVarName "i0"

                        i1 = newVarName "i1"

                        i2 = newVarName "i2"

                        i3 = newVarName "i3"
                      in
                        FixedName "lam"
                          /\ Rule
                              { hypotheses:
                                  [ Hypothesis
                                      -- lam x α β | i0 -> i3
                                      (parsed (lamTerm (VarTerm b)) (VarTerm i0) (VarTerm i3))
                                      []
                                  , Hypothesis
                                      -- x : α , Γ ⊢ b : β | i1 -> i2
                                      (typed (VarTerm b) (VarTerm i1) (VarTerm i2) (extendContext (VarTerm α) (VarTerm ctx)) (VarTerm β))
                                      []
                                  ]
                                    # List.fromFoldable
                              , conclusion:
                                  -- Γ ⊢ lam x α b : a -> b | i0 -> i3
                                  typed (lamTerm (VarTerm b)) (VarTerm i0) (VarTerm i3) (VarTerm ctx) (arrowType (VarTerm α) (VarTerm β))
                              }
                    , FixedName "var #0"
                        /\ let
                            x = newVarName "x"

                            i0 = newVarName "i0"

                            i1 = newVarName "i1"

                            ctx = newVarName "ctx"

                            α = newVarName "α"
                          in
                            Rule
                              { hypotheses: empty
                              , conclusion:
                                  -- Γ ⊢ #0 : α [i0 -> i1]
                                  typed (varTerm (LiteralTerm (show 0) dtyInt)) (VarTerm i0) (VarTerm i1) (extendContext (VarTerm α) (VarTerm ctx)) (VarTerm α)
                              }
                    -- input parsed term: lam (lam #1)
                    , FixedName "lam | 1 -> 4" /\ Rule { hypotheses: empty, conclusion: parsed (lamTerm (varTerm (LiteralTerm (show 0) dtyInt))) (LiteralTerm (show 1) dtyInt) (LiteralTerm (show 4) dtyInt) }
                    , FixedName "#0 | 2 -> 3" /\ Rule { hypotheses: empty, conclusion: parsed (varTerm (LiteralTerm (show 0) dtyInt)) (LiteralTerm (show 2) dtyInt) (LiteralTerm (show 3) dtyInt) }
                    ]
                      # Map.fromFoldable
                      # Map.union Library.rules
                }
            )
      }

lamTerm :: Term -> Term
lamTerm b = LeftTerm ((LiteralTerm "lam" dtyString) `pair` b)

varTerm :: Term -> Term
varTerm x = RightTerm ((LiteralTerm "var" dtyString) `pair` x)

arrowType :: Term -> Term -> Term
arrowType α β = LeftTerm ((LiteralTerm "arrow" dtyString) `pair` (α `pair` β))

unitType :: forall x110. TermF x110
unitType = RightTerm ((LiteralTerm "unit" dtyString))

extendContext :: Term -> Term -> Term
extendContext α ctx = LeftTerm ((LiteralTerm "extend" dtyString `pair` (α `pair` ctx)))

emptyContext :: Term
emptyContext = RightTerm (LiteralTerm "empty" dtyString)

parsed :: Term -> Term -> Term -> Prop
parsed tm i j = Prop name."Parsed" (tm `pair` (i `pair` j))

typed :: Term -> Term -> Term -> Term -> Term -> Prop
typed tm i j ctx ty = Prop name."Typed" ((tm `pair` (i `pair` j)) `pair` (ctx `pair` ty))

--------------------------------------------------------------------------------
-- Intermediate typing rules representation
--------------------------------------------------------------------------------
data Lang
  = Lang (Array (String /\ Array LangRuleHyp))

data LangRuleHyp
  = TypeVar String
  | TypeConst String
