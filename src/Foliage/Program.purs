module Foliage.Program where

import Foliage.Common
import Prelude
import Prelude
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Except (ExceptT, Except)
import Control.Monad.Except (runExcept)
import Control.Monad.Reader (Reader, ask)
import Control.Monad.State (evalState, get, modify_)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Either (either)
import Data.Eq.Generic (genericEq)
import Data.Foldable (class Foldable, null)
import Data.FunctorWithIndex (mapWithIndex)
import Data.Generic.Rep (class Generic)
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map (Map)
import Data.Map as Map
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype)
import Data.Ord.Generic (genericCompare)
import Data.Show.Generic (genericShow)
import Data.Traversable (class Traversable, traverse)
import Data.Tuple.Nested ((/\))
import Data.Tuple.Nested (type (/\))
import Debug as Debug
import Effect.Ref (Ref)
import Effect.Ref as Ref
import Effect.Unsafe (unsafePerformEffect)
import Foliage.App.Style as Style
import Halogen.HTML as HH
import Partial.Unsafe (unsafeCrashWith)
import Record as Record

data Program
  = Program
    { name :: FixedName
    , doc :: Maybe String
    , modules :: Map FixedName Module
    }

derive instance _Generic_Program :: Generic Program _

instance _Eq_Program :: Eq Program where
  eq x = genericEq x

instance _Show_Program :: Show Program where
  show x = genericShow x

lookupModule label k = (\(Module mod) -> mod) >>> Record.get label >>> Map.lookup k

getMainModule :: Program -> Module
getMainModule (Program prog) = case Map.lookup mainModuleName prog.modules of
  Nothing -> unsafeCrashWith $ "program " <> show prog.name <> " does not have a Main module"
  Just mod -> mod

data Module
  = Module
    { name :: FixedName
    , doc :: Maybe String
    , initialGas :: Int
    , dataTypeDefs :: Map FixedName DataTypeDef
    , latticeTypeDefs :: Map FixedName LatticeTypeDef
    , functionDefs :: Map FixedName FunctionDef
    , relations :: Map FixedName Relation
    , rules :: Map FixedName Rule
    }

derive instance _Generic_Module :: Generic Module _

instance _Eq_Module :: Eq Module where
  eq x = genericEq x

instance _Show_Module :: Show Module where
  show x = genericShow x

data DataTypeDef
  = ExternalDataTypeDef String
  | DataTypeDef DataType

derive instance _Generic_DataTypeDef :: Generic DataTypeDef _

instance _Eq_DataTypeDef :: Eq DataTypeDef where
  eq x = genericEq x

instance _Show_DataTypeDef :: Show DataTypeDef where
  show x = genericShow x

data DataType
  = UnitDataType
  | NamedDataType FixedName
  | SumDataType DataType DataType
  | ProductDataType DataType DataType
  | SetDataType DataType

derive instance _Generic_DataType :: Generic DataType _

instance _Eq_DataType :: Eq DataType where
  eq x = genericEq x

instance _Show_DataType :: Show DataType where
  show x = genericShow x

data LatticeTypeDef
  = LatticeTypeDef LatticeType
  | ExternalLatticeTypeDef
    { name :: String
    , compare_impl :: Opaque "compare" (Term /\ Term -> ExceptT (Exc "error") (Except (Exc "compare")) LatticeOrdering)
    }

derive instance _Generic_LatticeTypeDef :: Generic LatticeTypeDef _

instance _Eq_LatticeTypeDef :: Eq LatticeTypeDef where
  eq x = genericEq x

instance _Show_LatticeTypeDef :: Show LatticeTypeDef where
  show x = genericShow x

data LatticeType
  = NamedLatticeType FixedName
  | UnitLatticeType
  | SumLatticeType SumLatticeTypeOrdering LatticeType LatticeType
  | ProductLatticeType ProductLatticeTypeOrdering LatticeType LatticeType
  | SetLatticeType SetOrdering LatticeType
  | OppositeLatticeType LatticeType
  | DiscreteLatticeType LatticeType
  | PowerLatticeType LatticeType

derive instance _Generic_LatticeType :: Generic LatticeType _

instance _Eq_LatticeType :: Eq LatticeType where
  eq x = genericEq x

instance _Show_LatticeType :: Show LatticeType where
  show x = genericShow x

data SumLatticeTypeOrdering
  = LeftGreaterThanRight_SumLatticeTypeOrdering
  | LeftLessThanRight_SumLatticeTypeOrdering
  | LeftIncomparableRight_SumLatticeTypeOrdering
  | LeftEqualRight_SumLatticeTypeOrdering

derive instance _Generic_SumLatticeTypeOrdering :: Generic SumLatticeTypeOrdering _

instance _Eq_SumLatticeTypeOrdering :: Eq SumLatticeTypeOrdering where
  eq x = genericEq x

instance _Show_SumLatticeTypeOrdering :: Show SumLatticeTypeOrdering where
  show x = genericShow x

data ProductLatticeTypeOrdering
  = FirstThenSecond_ProductLatticeTypeOrdering

derive instance _Generic_ProductLatticeTypeOrdering :: Generic ProductLatticeTypeOrdering _

instance _Eq_ProductLatticeTypeOrdering :: Eq ProductLatticeTypeOrdering where
  eq x = genericEq x

instance _Show_ProductLatticeTypeOrdering :: Show ProductLatticeTypeOrdering where
  show x = genericShow x

data SetOrdering
  = SetOrdering

derive instance _Generic_SetOrdering :: Generic SetOrdering _

instance _Eq_SetOrdering :: Eq SetOrdering where
  eq x = genericEq x

instance _Show_SetOrdering :: Show SetOrdering where
  show x = genericShow x

data FunctionDef
  = ExternalFunctionDef
    { name :: String
    , inputs :: Array (String /\ DataType)
    , output :: DataType
    , impl :: Opaque "function" (Map String Term -> Either String Term)
    }

derive instance _Generic_FunctionDef :: Generic FunctionDef _

instance _Eq_FunctionDef :: Eq FunctionDef where
  eq x = genericEq x

instance _Show_FunctionDef :: Show FunctionDef where
  show x = genericShow x

data Relation
  = Relation
    { domain :: LatticeType
    , render :: Term -> RenderM Htmls
    , canonical_term :: Term
    }

derive instance _Generic_Relation :: Generic Relation _

instance _Eq_Relation :: Eq Relation where
  eq (Relation r1) (Relation r2) = r1.domain == r2.domain

instance _Show_Relation :: Show Relation where
  show (Relation r) = "(Relation " <> show r.domain <> ")"

type Rule
  = RuleF VarName

data RuleF x
  = Rule
    { hypotheses :: List (HypothesisF x)
    , conclusion :: PropF x
    }

derive instance _Generic_RuleF :: Generic (RuleF x) _

derive instance _Functor_RuleF :: Functor RuleF

derive instance _Foldable_RuleF :: Foldable RuleF

derive instance _Traversable_RuleF :: Traversable RuleF

instance _Eq_Rule :: Eq Rule where
  eq x = genericEq x

instance _Show_Rule :: Show Rule where
  show x = genericShow x

type RipeRule
  = RipeRuleF VarName

data RipeRuleF x
  = RipeRule { hypothesis :: HypothesisF x, rule' :: (RuleF x) }

derive instance _Generic_RipeRuleF :: Generic (RipeRuleF x) _

derive instance _Functor_RipeRuleF :: Functor RipeRuleF

derive instance _Foldable_RipeRuleF :: Foldable RipeRuleF

derive instance _Traversable_RipeRuleF :: Traversable RipeRuleF

instance _Eq_RipeRule :: Eq RipeRule where
  eq x = genericEq x

instance _Show_RipeRule :: Show RipeRule where
  show x = genericShow x

from_RipeRule_to_Rule :: RipeRule -> Rule
from_RipeRule_to_Rule (RipeRule { hypothesis, rule': Rule { hypotheses, conclusion } }) = Rule { hypotheses: hypothesis : hypotheses, conclusion }

fromNoHypothesesRule :: Rule -> Maybe Prop
fromNoHypothesesRule (Rule rule) =
  if null rule.hypotheses then
    Just rule.conclusion
  else
    Nothing

nextHypothesis :: Rule -> Either Prop RipeRule
nextHypothesis (Rule rule) = case rule.hypotheses of
  Nil -> Left rule.conclusion
  Cons hypothesis hypotheses -> Right (RipeRule { hypothesis, rule': Rule rule { hypotheses = hypotheses } })

type Hypothesis
  = HypothesisF VarName

data HypothesisF x
  = Hypothesis (PropF x) (Array (SideHypothesisF x))

derive instance _Generic_HypothesisF :: Generic (HypothesisF x) _

derive instance _Functor_HypothesisF :: Functor HypothesisF

derive instance _Foldable_HypothesisF :: Foldable HypothesisF

derive instance _Traversable_HypothesisF :: Traversable HypothesisF

instance _Eq_Hypothesis :: Eq Hypothesis where
  eq x = genericEq x

instance _Show_Hypothesis :: Show Hypothesis where
  show x = genericShow x

substHypothesis :: TermSubst -> Hypothesis -> Hypothesis
substHypothesis sigma = case _ of
  Hypothesis prop sides -> Hypothesis (prop # substProp sigma) (sides <#> substSideHypothesis sigma)

type SideHypothesis
  = SideHypothesisF VarName

data SideHypothesisF x
  = FunctionSideHypothesis
    { resultVarVarName :: x
    , functionName :: FixedName
    , args :: Array (TermF x)
    }

derive instance _Generic_SideHypothesisF :: Generic (SideHypothesisF x) _

derive instance _Functor_SideHypothesisF :: Functor SideHypothesisF

derive instance _Foldable_SideHypothesisF :: Foldable SideHypothesisF

derive instance _Traversable_SideHypothesisF :: Traversable SideHypothesisF

instance _Eq_SideHypothesis :: Eq SideHypothesis where
  eq x = genericEq x

instance _Show_SideHypothesis :: Show SideHypothesis where
  show x = genericShow x

substSideHypothesis :: TermSubst -> SideHypothesis -> SideHypothesis
substSideHypothesis sigma = case _ of
  FunctionSideHypothesis side -> FunctionSideHypothesis side { args = side.args <#> substTerm sigma }

type Prop
  = PropF VarName

type ConcreteProp
  = PropF Void

data PropF x
  = Prop FixedName (TermF x)

derive instance _Generic_PropF :: Generic (PropF x) _

derive instance _Functor_PropF :: Functor PropF

derive instance _Foldable_PropF :: Foldable PropF

derive instance _Traversable_PropF :: Traversable PropF

instance _Eq_PropF :: Eq x => Eq (PropF x) where
  eq x = genericEq x

instance _Show_PropF :: Show x => Show (PropF x) where
  show x = genericShow x

type Term
  = TermF VarName

data TermF x
  = VarTerm x
  | UnitTerm
  | LiteralTerm String DataType
  | LeftTerm (TermF x)
  | RightTerm (TermF x)
  | PairTerm (TermF x) (TermF x)
  | SetTerm (Array (TermF x))

derive instance _Generic_TermF :: Generic (TermF x) _

derive instance _Functor_TermF :: Functor (TermF)

derive instance _Foldable_TermF :: Foldable (TermF)

derive instance _Traversable_TermF :: Traversable (TermF)

instance _Eq_Term :: Eq x => Eq (TermF x) where
  eq x = genericEq x

instance _Show_Term :: Show x => Show (TermF x) where
  show x = genericShow x

type TermSubst
  = Map VarName Term

substRule :: TermSubst -> Rule -> Rule
substRule sigma (Rule rule) =
  {- Debug.trace ("substRule.sigma: " <> show sigma) \_ ->
    Debug.trace ("substRule.before: " <> show (Rule rule)) \_ ->
      Debug.spyWith "substRule.after: " show
        $ -}
  Rule
    { hypotheses: rule.hypotheses <#> substHypothesis sigma
    , conclusion: rule.conclusion # substProp sigma
    }

substProp :: TermSubst -> Prop -> Prop
substProp sigma (Prop p t) = Prop p (substTerm sigma t)

substTerm :: TermSubst -> Term -> Term
substTerm sigma (VarTerm x) = Map.lookup x sigma # fromMaybe (VarTerm x)

substTerm _sigma (LiteralTerm s dty) = LiteralTerm s dty

substTerm _sigma UnitTerm = UnitTerm

substTerm sigma (LeftTerm t) = LeftTerm (substTerm sigma t)

substTerm sigma (RightTerm t) = RightTerm (substTerm sigma t)

substTerm sigma (PairTerm s t) = PairTerm (substTerm sigma s) (substTerm sigma t)

substTerm sigma (SetTerm ts) = SetTerm (ts <#> substTerm sigma)

freshVarNameIndexRef :: Ref Int
freshVarNameIndexRef =
  unsafePerformEffect do
    0 # Ref.new

freshenVarName :: VarName -> VarName
freshenVarName (VarName s _) =
  unsafePerformEffect do
    n <- freshVarNameIndexRef # Ref.read # map (\i -> VarName s i)
    freshVarNameIndexRef # Ref.modify_ (_ + 1)
    pure n

-- | For each variable name in `f`, maps it to a fresh version of that name.
freshenVarNames :: forall f. Show (f VarName) => Traversable f => f VarName -> f VarName
freshenVarNames t = t # traverse f # flip evalState Map.empty
  where
  f x = do
    sigma <- get
    case Map.lookup x sigma of
      Nothing -> do
        let
          y = freshenVarName x
        modify_ (Map.insert x y)
        pure y
      Just y -> do
        pure y

-- | LatticeOrdering:
-- | - `a = b` if there exists a substitution of `a` and a substitution of `b`
-- |   such that `a === b`
-- | - `a < b` if there exists a substitution of `b` such that `a` is subsumed
-- |   by `b`
-- | - `a > b` if `b < a`.
type LatticeOrdering
  = Ordering /\ TermSubst

data VarName
  = VarName String Int

derive instance _Generic_VarName :: Generic VarName _

instance _Eq_VarName :: Eq VarName where
  eq = genericEq

instance _Ord_VarName :: Ord VarName where
  compare = genericCompare

instance _Eq_Show :: Show VarName where
  show = genericShow

newVarName :: String -> VarName
newVarName s = VarName s 0

newtype FixedName
  = FixedName String

derive instance _Newtype_FixedName :: Newtype FixedName _

derive newtype instance _Eq_FixedName :: Eq FixedName

derive newtype instance _Ord_FixedName :: Ord FixedName

derive newtype instance _Show_FixedName :: Show FixedName

mainModuleName :: FixedName
mainModuleName = FixedName "Main"

--  Utilities for defining external functions
getValidatedArg ::
  forall r a.
  { dt :: DataType
  , dt_name :: String
  , f :: String
  , fromString :: String -> Maybe a
  , x :: String
  | r
  } ->
  Map String Term -> Either String a
getValidatedArg { f, x, dt, dt_name, fromString } args =
  Map.lookup x args
    # maybe (throwExternalFunctionCallError f $ "no arg for " <> show x) pure
    # bindFlipped case _ of
        LiteralTerm s dt'
          | dt == dt' -> s # fromString # maybe (throwExternalFunctionCallError f $ s <> " is not a " <> dt_name) pure
        t -> throwExternalFunctionCallError f $ "expected arg " <> x <> " = " <> show t <> " to be a " <> dt_name

throwExternalFunctionCallError :: forall a. String -> String -> Either String a
throwExternalFunctionCallError f msg = throwError $ "when calling external function " <> f <> ", " <> msg

--------------------------------------------------------------------------------
-- Rendering
--------------------------------------------------------------------------------
newtype RenderCtx
  = RenderCtx { mod :: Module }

type RenderM
  = Reader RenderCtx

class Render a where
  render :: a -> RenderM Htmls

instance _Render_Htmls :: Render Htmls where
  render = pure

instance _Render_RenderM_Htmls :: Render (RenderM Htmls) where
  render = identity

append_render :: forall a. Render a => a -> RenderM Htmls -> RenderM Htmls
append_render a = append (render a)

infixr 5 append_render as ⊕

divs :: _ -> Array (RenderM Htmls) -> RenderM Htmls
divs props = map (pure <<< HH.div props) <<< Array.fold

instance _Render_Program :: Render Program where
  render (Program prog) =
    divs [ Style.style $ Style.flex_column <> [ "gap: 1.0em" ] ]
      $ [ line (Punc "program" ⊕ prog.name ⊕ mempty)
        , prog.doc # maybe mempty doc_block
        , prog.modules
            # map render
            # Map.values
            # Array.fromFoldable
            # Array.fold
        ]

doc_block :: String -> RenderM Htmls
doc_block s =
  [ HH.div [ Style.style $ Style.padding_small <> Style.font_prose <> [ "max-width: 30em", "background-color: rgba(0, 0, 0, 0.1)", "white-space: pre-wrap" ] ]
      [ HH.text s ]
  ]
    # pure

instance _Render_Module :: Render Module where
  render (Module mod) =
    definition
      (mod.doc <#> doc_block)
      ("module" # Punc # render)
      (mod.name # render)
      ( let
          renderModDefinition :: forall a. RenderM Htmls -> (a -> RenderM Htmls) -> Map FixedName a -> RenderM Htmls
          renderModDefinition label renderBody items =
            items
              # mapWithIndex (\name body -> definition Nothing label (render name) (renderBody body))
              # Map.values
              # Array.fromFoldable
              # Array.fold
        in
          [ mod.dataTypeDefs
              # renderModDefinition (Punc "data type" ⊕ mempty) case _ of
                  DataTypeDef dty -> line (dty ⊕ mempty)
                  ExternalDataTypeDef str -> line (Punc "external" ⊕ Raw str ⊕ mempty)
          , mod.functionDefs
              # renderModDefinition (Punc "function" ⊕ mempty) case _ of
                  ExternalFunctionDef def -> line (Raw def.name ⊕ Punc "(" ⊕ ((def.inputs <#> \(x /\ dty) -> Raw x ⊕ Punc ":" ⊕ dty ⊕ mempty) # Array.intercalate (Punc "," ⊕ mempty)) ⊕ Punc ")" ⊕ Punc "→" ⊕ def.output ⊕ mempty)
          , mod.latticeTypeDefs
              # renderModDefinition (Punc "lattice type" ⊕ mempty) case _ of
                  LatticeTypeDef lty -> line (lty ⊕ mempty)
                  ExternalLatticeTypeDef def -> line (Punc "external" ⊕ Raw def.name ⊕ mempty)
          , mod.relations
              # renderModDefinition (Punc "relation" ⊕ mempty) \(Relation rel) -> do
                  verbose <- line (Punc "ℛ" ⊕ rel.domain ⊕ mempty)
                  pretty <- line (Punc "notation:" ⊕ rel.render rel.canonical_term)
                  pure
                    [ HH.div [ Style.style $ Style.flex_column ]
                        [ HH.div [] verbose
                        , HH.div [] pretty
                        ]
                    ]
          , mod.rules
              # renderModDefinition (Punc "rule" ⊕ mempty) (\rule -> pure <<< HH.div [ Style.style $ [ "display: inline-flex", "flex-direction: row" ] ] <$> render rule)
          ]
            # Array.fold
      )

definition :: Maybe (RenderM Htmls) -> RenderM Htmls -> RenderM Htmls -> RenderM Htmls -> RenderM Htmls
definition mb_doc m_sort m_name m_body = do
  divs [ Style.style $ Style.flex_column <> Style.padding_small <> Style.boundaries ]
    [ mb_doc # maybe mempty (map (HH.div [] >>> pure))
    , line (m_sort ⊕ m_name ⊕ Punc "=" ⊕ mempty)
    , section m_body
    ]

instance _Render_Rule :: Render Rule where
  render (Rule rule) = do
    conclusion <- (rule.conclusion ⊕ mempty) # line
    hypotheses <- rule.hypotheses # map render # List.fold
    [ HH.div [ Style.style $ Style.flex_column ]
        if List.null rule.hypotheses then
          conclusion
        else
          [ hypotheses
          , [ HH.div [ Style.style $ Style.horizontal_bar ] [] ]
          , conclusion
          ]
            # Array.concat
    ]
      # pure

instance _Render_LatticeType :: Render LatticeType where
  render = case _ of
    NamedLatticeType x -> x ⊕ mempty
    UnitLatticeType -> Prim "Unit" ⊕ mempty
    SumLatticeType o l r -> Punc "(" ⊕ l ⊕ plus_sup ⊕ r ⊕ Punc ")" ⊕ mempty
      where
      plus_sup :: RenderM Htmls
      plus_sup = Punc "+" ⊕ pure [ HH.sup [] [ HH.text sup ] ] <#> HH.span [] >>> pure

      sup = case o of
        LeftGreaterThanRight_SumLatticeTypeOrdering -> "L>R"
        LeftLessThanRight_SumLatticeTypeOrdering -> "L<R"
        LeftIncomparableRight_SumLatticeTypeOrdering -> "L⋈R"
        LeftEqualRight_SumLatticeTypeOrdering -> "L=R"
    ProductLatticeType o f s -> Punc "(" ⊕ f ⊕ prod_sup ⊕ s ⊕ Punc ")" ⊕ mempty
      where
      prod_sup :: RenderM Htmls
      prod_sup = Punc "×" ⊕ pure [ HH.sup [] [ HH.text sup ] ] <#> HH.span [] >>> pure

      sup = case o of
        FirstThenSecond_ProductLatticeTypeOrdering -> "1,2"
    SetLatticeType o d -> Prim "Set" ⊕ Punc "(" ⊕ d ⊕ Punc ")" ⊕ mempty
    OppositeLatticeType l -> Prim "Opposite" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ mempty
    DiscreteLatticeType l -> Prim "Discrete" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ mempty
    PowerLatticeType l -> Prim "Power" ⊕ Punc "(" ⊕ l ⊕ Punc ")" ⊕ mempty

instance _Render_DataType :: Render DataType where
  render = case _ of
    NamedDataType x -> x ⊕ mempty
    UnitDataType -> Prim "Unit" ⊕ mempty
    SumDataType l r -> Punc "(" ⊕ l ⊕ Punc "+" ⊕ r ⊕ Punc ")" ⊕ mempty
    SetDataType d -> Prim "Set" ⊕ d ⊕ mempty
    ProductDataType f s -> Punc "(" ⊕ f ⊕ Punc "*" ⊕ s ⊕ Punc ")" ⊕ mempty

instance _Render_TermSubst :: Render TermSubst where
  render m =
    m
      # mapWithIndex (\x t -> x ⊕ Punc "↦" ⊕ t ⊕ mempty)
      # Map.values
      # Array.fromFoldable
      # Array.intercalate (Punc "," ⊕ mempty)
      # \es -> Punc "{" ⊕ es ⊕ Punc "}" ⊕ mempty

line :: RenderM Htmls -> RenderM Htmls
line m_es = do
  es <- m_es
  es
    # Array.foldMap (\e -> [ e, HH.span [ Style.style $ [ "white-space: pre" ] ] [ HH.text " " ] ])
    # HH.span []
    # pure
    # pure

-- | Puntuation
newtype Punc
  = Punc String

instance _Render_Punc :: Render Punc where
  render (Punc s) = HH.span [ Style.style $ Style.bold <> [ "color: black" ] ] [ HH.text s ] # pure # pure

-- | Primitive
newtype Prim
  = Prim String

instance _Render_Prim :: Render Prim where
  render (Prim s) = [ HH.text s ] # HH.span [ Style.style $ [ "color: purple" ] ] # pure # pure

instance _Render_VarName :: Render VarName where
  render (VarName s i)
    | i == 0 = [ HH.text s ] # HH.span [ Style.style $ [ "color: darkgreen" ] ] # pure # pure
  render (VarName s i) = [ HH.text s, HH.sub [] [ HH.text (show i) ] ] # HH.span [ Style.style $ [ "color: darkgreen" ] ] # pure # pure

instance _Render_FixedName :: Render FixedName where
  render (FixedName s) = [ HH.text s ] # HH.span [ Style.style $ [ "color: #808000" ] ] # pure # pure

instance _Render_Hypothesis :: Render Hypothesis where
  render (Hypothesis prop sides) = line (prop ⊕ mempty) ⊕ (sides # map (render >>> line) # Array.fold) ⊕ mempty

instance _Render_SideHypothesis :: Render SideHypothesis where
  render = case _ of
    FunctionSideHypothesis side -> Punc "let" ⊕ side.resultVarVarName ⊕ Punc "=" ⊕ side.functionName ⊕ Punc "(" ⊕ ((side.args <#> render) # Array.intercalate (Punc "," ⊕ mempty)) ⊕ Punc ")" ⊕ mempty

instance _Render_Prop :: Render Prop where
  render (Prop p t) = do
    RenderCtx { mod: Module mod } <- ask
    Debug.traceM (show (Module mod))
    Relation r <-
      mod.relations
        # lookup "relations" p
        # runExcept
        # either
            (\exc -> unsafeCrashWith (show exc))
            pure
    r.render t

instance _Render_Term :: Render Term where
  render = case _ of
    VarTerm x -> x ⊕ mempty
    LiteralTerm l _ -> Lit l ⊕ mempty
    UnitTerm -> Prim "●" ⊕ mempty
    LeftTerm t -> Punc "(" ⊕ Prim "☜" ⊕ t ⊕ Punc ")" ⊕ mempty
    RightTerm t -> Punc "(" ⊕ Prim "☞" ⊕ t ⊕ Punc ")" ⊕ mempty
    PairTerm t1 t2 -> Punc "⟨" ⊕ t1 ⊕ Punc "," ⊕ t2 ⊕ Punc "⟩" ⊕ mempty
    SetTerm ts -> Punc "{" ⊕ ((ts <#> render) # Array.intercalate (Punc "," ⊕ mempty)) ⊕ Punc "}" ⊕ mempty

section :: RenderM Htmls -> RenderM Htmls
section m_es = do
  es <- m_es
  es # HH.div [ Style.style $ Style.flex_column <> Style.padding_horizontal_big ] # pure # pure

-- | Raw String
newtype Raw
  = Raw String

instance _Render_Raw :: Render Raw where
  render (Raw s) = [ HH.span [ Style.style $ [ "color: blue" ] ] [ HH.text s ] ] # pure

-- | Lit String
newtype Lit
  = Lit String

instance _Render_Lit :: Render Lit where
  render (Lit s) = [ HH.span [ Style.style $ Style.italic <> [ "color: brown" ] ] [ HH.text s ] ] # pure
