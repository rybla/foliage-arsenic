module Foliage.Example.Typing where

import Foliage.Program
import Prelude
import Control.Monad.Except (ExceptT, throwError)
import Control.Monad.ST.Internal as ST
import Control.Monad.State (State, evalState, runState)
import Control.Monad.State as State
import Control.Plus (empty)
import Data.Array as Array
import Data.Array.ST (STArray)
import Data.Array.ST as STArray
import Data.Either (Either)
import Data.Homogeneous.Record (Homogeneous, fromHomogeneous, homogeneous)
import Data.Identity (Identity)
import Data.Int as Int
import Data.Lazy (Lazy)
import Data.Lazy as Lazy
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), maybe)
import Data.Tuple.Nested (type (/\), (/\))
import Foliage.Common (Exc(..), Html, Opaque(..), Htmls, _error)
import Foliage.Example.Library (left, pair, prod12, right, sumLir, termUnit)
import Foliage.Example.Library as Library
import Halogen.HTML as HH
import Partial.Unsafe (unsafeCrashWith)
import Prelude as Prelude
import Record as Record
import Type.Proxy (Proxy(..))
import Unsafe (todo)

example :: Lazy Program
example =
  Lazy.defer \_ ->
    let
      -- input = term_Var (LiteralTerm "0" dty_Int)
      -- input = term_Lam (term_Var (LiteralTerm "0" dty_Int))
      -- input = term_Lam (term_Lam (term_Var (LiteralTerm "0" dty_Int))) -- ignore
      -- input = term_Lam (term_Lam (term_Var (LiteralTerm "1" dty_Int))) -- const
      -- input =
      --   -- (λλ(0 1) λ0 λ0) : a -> a
      --   -- (fun f => fun x => f x) (fun x => x) (fun x => x) : a -> a 
      --   term_Lam
      --     ( term_Lam
      --         ( term_Var (LiteralTerm "1" dty_Int)
      --             `term_App`
      --               term_Var (LiteralTerm "0" dty_Int)
      --         )
      --     )
      --     `term_App`
      --       (term_Lam (term_Var (LiteralTerm "0" dty_Int)))
      --     `term_App`
      --       (term_Lam (term_Var (LiteralTerm "0" dty_Int)))
      input = term_Var (LiteralTerm "1" dty_Int) `term_App` term_Var (LiteralTerm "0" dty_Int)
    in
      Program
        { name: FixedName "Typing . Simply-Typed Lambda Calculus"
        , doc: Just "TODO"
        , modules:
            Map.singleton mainModuleName
              ( Module
                  { name: mainModuleName
                  , doc: Nothing
                  , initialGas: 40
                  , dataTypeDefs:
                      [ dtyd_Int
                      , dtyd_String
                      ]
                        # Map.fromFoldable
                  , latticeTypeDefs:
                      [ [ ltyd_Int
                        , ltyd_String
                        , ltyd_Symbol
                        , ltyd_Index
                        ]
                      , [ ltyd_Term
                        , ltyd_Type
                        , ltyd_Context
                        ]
                      ]
                        # Array.concat
                        # Map.fromFoldable
                  , functionDefs:
                      []
                        # Map.fromFoldable
                  , relations:
                      [ relation_Parsed
                      , relation_Typed
                      ]
                        # Map.fromFoldable
                  , rules:
                      [ [ FixedName "var 0"
                            /\ let
                                i0 = VarTerm (newVarName "i0")

                                i1 = VarTerm (newVarName "i1")

                                tm = term_Var (LiteralTerm "0" dty_Int)

                                ty = VarTerm (newVarName "α")

                                ctx = context_Cons ty (VarTerm (newVarName "Γ"))
                              in
                                Rule
                                  { hypotheses: [ Hypothesis (prop_Parsed { i0, i1, tm }) [] ] # List.fromFoldable
                                  , conclusion: prop_Typed { i0, i1, tm, ty, ctx }
                                  }
                        , FixedName "var 1"
                            /\ let
                                i0 = VarTerm (newVarName "i0")

                                i1 = VarTerm (newVarName "i1")

                                tm = term_Var (LiteralTerm "1" dty_Int)

                                α = VarTerm (newVarName "α")

                                β = VarTerm (newVarName "β")

                                ctx = β `context_Cons` (α `context_Cons` VarTerm (newVarName "Γ"))
                              in
                                Rule
                                  { hypotheses: [ Hypothesis (prop_Parsed { i0, i1, tm }) [] ] # List.fromFoldable
                                  , conclusion: prop_Typed { i0, i1, tm, ty: α, ctx }
                                  }
                        , FixedName "var 2"
                            /\ let
                                i0 = VarTerm (newVarName "i0")

                                i1 = VarTerm (newVarName "i1")

                                tm = term_Var (LiteralTerm "2" dty_Int)

                                α = VarTerm (newVarName "α")

                                β = VarTerm (newVarName "β")

                                γ = VarTerm (newVarName "γ")

                                ctx = γ `context_Cons` (β `context_Cons` (α `context_Cons` VarTerm (newVarName "Γ")))
                              in
                                Rule
                                  { hypotheses: [ Hypothesis (prop_Parsed { i0, i1, tm }) [] ] # List.fromFoldable
                                  , conclusion: prop_Typed { i0, i1, tm, ty: α, ctx }
                                  }
                        , FixedName "lam"
                            /\ let
                                i0 = VarTerm (newVarName "i0")

                                i1 = VarTerm (newVarName "i1")

                                i2 = VarTerm (newVarName "i2")

                                i3 = VarTerm (newVarName "i3")

                                α = VarTerm (newVarName "α")

                                β = VarTerm (newVarName "β")

                                b = VarTerm (newVarName "b")

                                ctx = VarTerm (newVarName "Γ")
                              in
                                Rule
                                  { hypotheses:
                                      [ Hypothesis (prop_Parsed { i0: i0, i1: i3, tm: term_Lam b }) []
                                      , Hypothesis (prop_Typed { i0: i1, i1: i2, tm: b, ctx: context_Cons α ctx, ty: β }) []
                                      ]
                                        # List.fromFoldable
                                  , conclusion: prop_Typed { i0: i0, i1: i3, tm: term_Lam b, ty: type_Arr α β, ctx: ctx }
                                  }
                        , FixedName "app"
                            /\ let
                                i0 = VarTerm (newVarName "i0")

                                i1 = VarTerm (newVarName "i1")

                                i2 = VarTerm (newVarName "i2")

                                i3 = VarTerm (newVarName "i3")

                                i4 = VarTerm (newVarName "i4")

                                α = VarTerm (newVarName "α")

                                β = VarTerm (newVarName "β")

                                f = VarTerm (newVarName "f")

                                a = VarTerm (newVarName "a")

                                ctx = VarTerm (newVarName "Γ")
                              in
                                Rule
                                  { hypotheses:
                                      [ Hypothesis (prop_Parsed { i0: i0, i1: i4, tm: term_App f a }) []
                                      , Hypothesis (prop_Typed { i0: i1, i1: i2, tm: f, ctx, ty: type_Arr α β }) []
                                      , Hypothesis (prop_Typed { i0: i3, i1: i4, tm: a, ctx, ty: α }) []
                                      ]
                                        # List.fromFoldable
                                  , conclusion: prop_Typed { i0: i0, i1: i4, tm: term_App f a, ty: β, ctx: ctx }
                                  }
                        ]
                      , compileInput input
                      ]
                        # Array.concat
                        # Map.fromFoldable
                  }
              )
        }

compileInput :: Term -> Array (FixedName /\ Rule)
compileInput tm_ =
  ST.run do
    i_ref <- ST.new 0
    rules_ref <- STArray.new
    let
      next_i = do
        i <- ST.read i_ref
        ST.modify (1 + _) i_ref # void
        pure i

      go :: Term -> _
      go tm = case tm of
        LeftTerm (LeftTerm (LiteralTerm n _)) -> do
          i0 <- next_i
          i1 <- next_i
          rules_ref
            # STArray.push
                ( FixedName ("@" <> n <> " " <> "[" <> show i0 <> "→" <> show i1 <> "]")
                    /\ Rule
                        { hypotheses: mempty
                        , conclusion: prop_Parsed { i0: LiteralTerm (show i0) dty_Int, i1: LiteralTerm (show i1) dty_Int, tm }
                        }
                )
            # void
        LeftTerm (RightTerm b) -> do
          i0 <- next_i
          go b
          i1 <- next_i
          rules_ref
            # STArray.push
                ( FixedName ("λ" <> " " <> "[" <> show i0 <> "→" <> show i1 <> "]")
                    /\ Rule
                        { hypotheses: mempty
                        , conclusion: prop_Parsed { i0: LiteralTerm (show i0) dty_Int, i1: LiteralTerm (show i1) dty_Int, tm }
                        }
                )
            # void
        RightTerm (PairTerm f a) -> do
          i0 <- next_i
          go f
          go a
          i1 <- next_i
          rules_ref
            # STArray.push
                ( FixedName ("app" <> " " <> "[" <> show i0 <> "→" <> show i1 <> "]")
                    /\ Rule
                        { hypotheses: mempty
                        , conclusion: prop_Parsed { i0: LiteralTerm (show i0) dty_Int, i1: LiteralTerm (show i1) dty_Int, tm }
                        }
                )
            # void
        t -> unsafeCrashWith $ "invalid input Term: " <> show t
    go tm_
    rules <- rules_ref # STArray.freeze
    pure rules

relation_Parsed :: FixedName /\ Relation
relation_Parsed =
  name_Parsed
    /\ Relation
        { domain: (lty_Index `prod12` lty_Index) `prod12` lty_Term
        , render:
            case _ of
              PairTerm (PairTerm i0 i1) tm -> do
                i0 <- i0 ⊕ mempty
                i1 <- i1 ⊕ mempty
                [ HH.sub_ i0 :: Html ] ⊕ render_Term tm ⊕ [ HH.sub_ i1 :: Html ] ⊕ mempty
              t -> unsafeCrashWith $ "invalid Typed term: " <> show t
        , canonical_term: prop_Parsed_term { i0: VarTerm (newVarName "i0"), i1: VarTerm (newVarName "i1"), tm: VarTerm (newVarName "a"), ctx: VarTerm (newVarName "Γ"), ty: VarTerm (newVarName "α") }
        }

prop_Parsed = Prop name_Parsed <<< prop_Parsed_term

prop_Parsed_term { i0, i1, tm } = ((i0 `pair` i1) `pair` tm)

relation_Typed :: FixedName /\ Relation
relation_Typed =
  name_Typed
    /\ Relation
        { domain: (lty_Index `prod12` lty_Index) `prod12` lty_Term `prod12` (lty_Context `prod12` lty_Type)
        , render:
            case _ of
              PairTerm (PairTerm (PairTerm i0 i1) tm) (PairTerm ctx ty) -> do
                i0 <- i0 ⊕ mempty
                i1 <- i1 ⊕ mempty
                render_Context ctx ⊕ [ HH.text "⊢" :: Html ] ⊕ [ HH.sub_ i0 :: Html ] ⊕ render_Term tm ⊕ [ HH.sub_ i1 :: Html ] ⊕ [ HH.text ":" :: Html ] ⊕ render_Type ty ⊕ mempty
              t -> unsafeCrashWith $ "invalid Typed term: " <> show t
        , canonical_term: prop_Typed_term { i0: VarTerm (newVarName "i0"), i1: VarTerm (newVarName "i1"), tm: VarTerm (newVarName "a"), ctx: VarTerm (newVarName "Γ"), ty: VarTerm (newVarName "α") }
        }

prop_Typed = Prop name_Typed <<< prop_Typed_term

prop_Typed_term { i0, i1, tm, ty, ctx } = ((i0 `pair` i1) `pair` tm `pair` (ctx `pair` ty))

name_Var = FixedName "Var"

name_Term = FixedName "Term"

name_Context = FixedName "Context"

name_Typed = FixedName "Typed"

name_Parsed = FixedName "Parsed"

lty_Var = NamedLatticeType name_Var

lty_Context = NamedLatticeType name_Context

ltyd_Context =
  name_Context
    /\ LatticeTypeDef
        ( UnitLatticeType
            `sumLir`
              (lty_Type `prod12` lty_Context)
        )

render_Context :: Term -> RenderM Htmls
render_Context = case _ of
  LeftTerm _ -> [ HH.text "∅" :: Html ] ⊕ mempty
  RightTerm (PairTerm α ctx) -> render_Type α ⊕ [ HH.text "," :: Html ] ⊕ render_Context ctx ⊕ mempty
  t@(VarTerm _) -> t ⊕ mempty
  t -> unsafeCrashWith $ "invalid Context: " <> show t

context_Nil = left UnitTerm

context_Cons α γ = right (α `pair` γ)

lty_Type = NamedLatticeType name_Type

ltyd_Type =
  name_Type
    /\ LatticeTypeDef (lty_Type `prod12` lty_Type)

render_Type :: Term -> RenderM Htmls
render_Type = case _ of
  PairTerm α β -> [ HH.text "(" :: Html ] ⊕ render_Type α ⊕ [ HH.text "→" :: Html ] ⊕ render_Type β ⊕ [ HH.text ")" :: Html ] ⊕ mempty
  t@(VarTerm _) -> t ⊕ mempty
  t -> unsafeCrashWith $ "invalid Type: " <> show t

type_Arr α β = α `pair` β

name_Type = FixedName "Type"

lty_Int = NamedLatticeType (FixedName "Int")

dty_Int = NamedDataType (FixedName "Int")

lty_String = NamedLatticeType (FixedName "String")

lty_Symbol = NamedLatticeType (FixedName "Symbol")

lty_Index = NamedLatticeType (FixedName "Index")

lty_Term = NamedLatticeType name_Term

ltyd_Term =
  name_Term
    /\ LatticeTypeDef
        ( lty_Index -- var
            `sumLir`
              lty_Term -- lam
            `sumLir`
              (lty_Term `prod12` lty_Term) -- app
        )

render_Term :: Term -> RenderM Htmls
render_Term = case _ of
  LeftTerm (LeftTerm (LiteralTerm n _)) -> Lit ("@" <> n) ⊕ mempty
  LeftTerm (LeftTerm x@(VarTerm _)) -> x ⊕ mempty
  LeftTerm (RightTerm b) -> [ HH.text "λ" :: Html ] ⊕ render_Term b ⊕ mempty
  RightTerm (PairTerm f a) -> [ HH.text "(" :: Html ] ⊕ render_Term f ⊕ render_Term a ⊕ [ HH.text ")" :: Html ] ⊕ mempty
  t@(VarTerm _) -> t ⊕ mempty
  t -> unsafeCrashWith $ "invalid Term: " <> show t

term_Var n = left (left n)

term_Lam b = left (right b)

term_App f b = right (f `pair` b)

dty_String = NamedDataType (FixedName "String")

dtyd_Int = FixedName "Int" /\ ExternalDataTypeDef "Int"

ltyd_Int = FixedName "Int" /\ ExternalLatticeTypeDef { name: "Int", compare_impl: compare_Int }

compare_Int =
  Opaque (Proxy :: Proxy "compare") case _ of
    LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
      | n1 == FixedName "Int" && n2 == FixedName "Int" -> do
        x1 <- s1 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s1 <> " is not an Int" })) pure
        x2 <- s2 # Int.fromString # maybe (throwError (Exc { label: _error, source: "compare.Int", description: show s2 <> " is not an Int" })) pure
        pure (Prelude.compare x1 x2 /\ empty)
    t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.Int", description: "inputs are not literal Ints: " <> show t1 <> ", " <> show t2 })

dtyd_String = FixedName "String" /\ ExternalDataTypeDef "String"

compare_String =
  Opaque (Proxy :: Proxy "compare") case _ of
    LiteralTerm s1 (NamedDataType n1) /\ LiteralTerm s2 (NamedDataType n2)
      | n1 == FixedName "String" && n2 == FixedName "String" -> do
        pure (Prelude.compare s1 s2 /\ empty)
    t1 /\ t2 -> throwError (Exc { label: _error, source: "compare.String", description: "inputs are not literal Strings: " <> show t1 <> ", " <> show t2 })

ltyd_String = FixedName "String" /\ ExternalLatticeTypeDef { name: "String", compare_impl: compare_String }

ltyd_Index = FixedName "Index" /\ LatticeTypeDef (DiscreteLatticeType lty_Int)

ltyd_Symbol = FixedName "Symbol" /\ LatticeTypeDef (DiscreteLatticeType lty_String)
