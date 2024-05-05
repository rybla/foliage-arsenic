module Foliage.Example.Typing where

import Prelude
import Foliage.Program
import Data.Tuple.Nested (type (/\), (/\))
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
import Foliage.Common (Exc, Opaque(..))
import Foliage.Example.Library (pair, prod12, sumLIR)
import Foliage.Example.Library as Library
import Record as Record
import Type.Proxy (Proxy(..))

--------------------------------------------------------------------------------
-- Examples
--------------------------------------------------------------------------------
test :: Lazy Program
test = make_typing "Test"

--------------------------------------------------------------------------------
-- Definitions
--------------------------------------------------------------------------------
name ::
  Record
    ( "" :: Name
    , "Context" :: Name
    , "Index" :: Name
    , "Int" :: Name
    , "List String" :: Name
    , "Parsed" :: Name
    , "String" :: Name
    , "Symbol" :: Name
    , "Term" :: Name
    , "Type" :: Name
    , "Typed" :: Name
    , "Typed Var" :: Name
    , "Var" :: Name
    , joinStrings :: Name
    )
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
    # map Name
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
              ExceptT (Exc "error") (ExceptT (Exc "compare") Identity) (Ordering /\ Map Name Term)
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
      { name: Name ("Typing . " <> label)
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
                                `sumLIR`
                                  (ltySymbol {- unit -})
                            )
                    , name."Term"
                        /\ LatticeTypeDef
                            ( (ltySymbol {- lam -} `prod12` ltyTerm)
                                `sumLIR`
                                  (ltySymbol {- var -} `prod12` ltyVar)
                            )
                    , name."Context"
                        /\ LatticeTypeDef
                            ( ltySymbol {- extend -} `prod12` (ltyType `prod12` ltyContext)
                                `sumLIR`
                                  ltySymbol {- empty -}
                            )
                    , name."Var" /\ LatticeTypeDef ltyIndex
                    ]
                      # Map.fromFoldable
                      # Map.union Library.latticeTypeDefs
                , relations:
                    -- Parsed (Term * (Index * Index))
                    [ name."Parsed" /\ Relation { domain: ltyTerm `prod12` (ltyIndex `prod12` ltyIndex) }
                    -- Typed ((Term * (Index * Index)) * (Context * Type))
                    , name."Typed"
                        /\ Relation { domain: (ltyTerm `prod12` (ltyIndex `prod12` ltyIndex)) `prod12` (ltyContext `prod12` ltyType) }
                    ]
                      # Map.fromFoldable
                      # Map.union Library.relations
                , functionDefs:
                    []
                      # Map.fromFoldable
                      # Map.union Library.functionDefs
                , rules:
                    [ let
                        ctx = Name "ctx"

                        α = Name "α"

                        β = Name "β"

                        b = Name "b"

                        i0 = Name "i0"

                        i1 = Name "i1"

                        i2 = Name "i2"

                        i3 = Name "i3"
                      in
                        Name "lam"
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
                    , Name "var #0"
                        /\ let
                            x = Name "x"

                            i0 = Name "i0"

                            i1 = Name "i1"

                            ctx = Name "ctx"

                            α = Name "α"
                          in
                            Rule
                              { hypotheses: empty
                              , conclusion:
                                  -- Γ ⊢ #0 : α [i0 -> i1]
                                  typed (varTerm (LiteralTerm (show 0) dtyInt)) (VarTerm i0) (VarTerm i1) (extendContext (VarTerm α) (VarTerm ctx)) (VarTerm α)
                              }
                    -- input parsed term: lam (lam #1)
                    , Name "lam | 1 -> 4" /\ Rule { hypotheses: empty, conclusion: parsed (lamTerm (varTerm (LiteralTerm (show 0) dtyInt))) (LiteralTerm (show 1) dtyInt) (LiteralTerm (show 4) dtyInt) }
                    , Name "#0 | 2 -> 3" /\ Rule { hypotheses: empty, conclusion: parsed (varTerm (LiteralTerm (show 0) dtyInt)) (LiteralTerm (show 2) dtyInt) (LiteralTerm (show 3) dtyInt) }
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
