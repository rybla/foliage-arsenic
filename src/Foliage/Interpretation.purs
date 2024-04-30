module Foliage.Interpretation
  ( interpProgram
  , Log(..)
  , Err(..)
  , Env(..)
  , LogMessage(..)
  ) where

import Foliage.Program
import Prelude
import Control.Bind (bindFlipped)
import Control.Monad.Error.Class (class MonadThrow)
import Control.Monad.Except (ExceptT, runExceptT, throwError)
import Control.Monad.Maybe.Trans (MaybeT, runMaybeT)
import Control.Monad.Reader (class MonadReader, ask, runReaderT)
import Control.Monad.State (class MonadState, get, modify, modify_, runStateT)
import Control.Monad.Trans.Class (lift)
import Control.Monad.Writer (class MonadTell, class MonadWriter, tell)
import Control.Plus (empty)
import Data.Array as Array
import Data.Bifunctor (lmap, rmap)
import Data.Either (Either(..), either)
import Data.Generic.Rep (class Generic)
import Data.Int as Int
import Data.List (List(..), (:))
import Data.List as List
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..), fromMaybe, maybe)
import Data.Newtype (class Newtype)
import Data.Show.Generic (genericShow)
import Data.String.CodeUnits (fromCharArray)
import Data.Traversable (traverse)
import Data.Tuple (fst)
import Data.Tuple.Nested (type (/\), (/\))
import Debug as Debug
import Type.Proxy (Proxy(..))
import Unsafe (todo)
import Unsafe as Unsafe

--------------------------------------------------------------------------------
-- Constants
--------------------------------------------------------------------------------
initialGas :: Int
initialGas = 100

--------------------------------------------------------------------------------
-- Types
--------------------------------------------------------------------------------
newtype Ctx
  = Ctx
  { modules :: Map Name Module
  , focusModule :: Module
  -- external function name => external function
  , externalFunctions :: Map String (Map String Term -> Either String Term)
  -- external lattice type name => comparison function over that lattice type
  , externalCompares :: Map String (String -> String -> Either String Ordering)
  }

derive instance _Newtype_Ctx :: Newtype Ctx _

newtype Env
  = Env
  { gas :: Int
  , rules :: List Rule
  , known_props :: List Prop
  , active_props :: List Prop
  }

derive instance _Newtype_Env :: Newtype Env _

newtype Err
  = Err
  { source :: String
  , description :: String
  }

derive instance _Newtype_Err :: Newtype Err _

derive newtype instance _Eq_Err :: Eq Err

instance _Show_Err :: Show Err where
  show (Err { source, description }) =
    [ sep, "[ERROR]", "source: " <> source, "", description, sep ]
      # Array.intercalate "\n"
    where
    sep = '=' # Array.replicate 20 # fromCharArray

newtype ApplyError
  = ApplyError
  { source :: String
  , description :: String
  }

derive instance _Newtype_ApplyError :: Newtype ApplyError _

derive newtype instance _Eq_ApplyError :: Eq ApplyError

instance _Show_ApplyError :: Show ApplyError where
  show (ApplyError { source, description }) = [ "apply error at", source, ":", description ] # Array.intercalate " "

newtype Log
  = Log
  { label :: String
  , messages :: Array LogMessage
  }

derive instance _Newtype_Log :: Newtype Log _

instance _Show_Log :: Show Log where
  show (Log log) = "[" <> log.label <> "] " <> ((log.messages <#> show) # Array.intercalate "  ")

data LogMessage
  = StringLogMessage String
  | RuleLogMessage Rule
  | PropLogMessage Prop
  | TermLogMessage Term

derive instance _Generic_LogMessage :: Generic LogMessage _

instance _Show_LogMessage :: Show LogMessage where
  show = genericShow

--------------------------------------------------------------------------------
-- Endpoints
--------------------------------------------------------------------------------
interpProgram ::
  forall m.
  Monad m =>
  MonadWriter (Array Log) m =>
  MonadThrow Err m =>
  Program -> m (Maybe Err /\ Env)
interpProgram (Program prog) = do
  focusModule@(Module main) <- lookup "module Main" mainModuleName prog.modules
  Debug.traceM "[interpProgram]"
  let
    ctx =
      Ctx
        { modules: prog.modules
        , focusModule
        , externalFunctions
        , externalCompares
        }

    env =
      let
        rules /\ active_props =
          main.rules # Map.values
            # partitionEither
                ( \rule ->
                    rule
                      # nextHypothesis
                      # case _ of
                          Left conclusion -> Right conclusion
                          Right _ -> Left rule
                )
      in
        Env
          { gas: initialGas
          , rules
          , known_props: Nil
          , active_props
          }
  err_or_unit /\ env' <-
    fixpointFocusModule
      # runExceptT
      # flip runReaderT ctx
      # flip runStateT env
  pure ((err_or_unit # either Just (const Nothing)) /\ env')

externalFunctions :: Map String (Map String Term -> Either String Term)
externalFunctions =
  Map.fromFoldable
    [ let
        f = "addWeight"
      in
        f
          /\ \args -> do
              w1 <- let x = "w1" in args # getArg { f, x } (validateInt { f, x })
              w2 <- let x = "w2" in args # getArg { f, x } (validateInt { f, x })
              let
                w = w1 + w2
              pure (LiteralTerm (Int.toStringAs Int.decimal w) intDataType)
    ]
  where
  getArg :: forall r a. { f :: String, x :: String | r } -> (Term -> Either String a) -> _ -> Either String a
  getArg { f, x } validate args =
    Map.lookup x args
      # maybe (throwExternalFunctionCallError f $ "no argument " <> show x) pure
      # bindFlipped validate

  validateInt :: forall r. { f :: String, x :: String | r } -> Term -> Either String Int
  validateInt { f, x } = case _ of
    LiteralTerm s dty
      | dty == intDataType -> s # Int.fromString # maybe (throwExternalFunctionCallError f $ s <> " is not an Int") pure
    t -> throwExternalFunctionCallError f $ "expected arg " <> x <> " = " <> show t <> " to be an Int"

  throwExternalFunctionCallError :: forall a. String -> String -> Either String a
  throwExternalFunctionCallError f msg = throwError $ "when calling external function " <> f <> ", " <> msg

externalCompares :: Map String (String -> String -> Either String Ordering)
externalCompares =
  Map.fromFoldable
    [ "Int"
        /\ \x y -> do
            x :: Int <- Int.fromString x # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show x <> " to be a literal integer") pure
            y :: Int <- Int.fromString y # maybe (throwError $ "when comparing " <> show x <> " and " <> show y <> " as external lattice type \"Int\", expected " <> show y <> " to be a literal integer") pure
            pure (compare x y)
    ]

intDataType :: DataType
intDataType = NamedDataType (Name "Int")

--------------------------------------------------------------------------------
-- Implementation
--------------------------------------------------------------------------------
fixpointFocusModule ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  MonadWriter (Array Log) m =>
  m Unit
fixpointFocusModule = do
  Env env <- modify \(Env env) -> (Env env { gas = env.gas - 1 })
  when (env.gas <= 0) do
    tell [ Log { label: "error", messages: [ "ran out of gas" # StringLogMessage ] } ]
    throwError (Err { source: "fixpointFocusModule", description: "ran out of gas" })
  case env.active_props of
    Nil -> pure unit
    Cons active_prop active_props -> do
      modify_ \(Env env') -> (Env env' { active_props = active_props })
      learnProp active_prop
      fixpointFocusModule

learnProp ::
  forall m.
  MonadReader Ctx m =>
  MonadState Env m =>
  MonadThrow Err m =>
  MonadWriter (Array Log) m =>
  Prop -> m Unit
learnProp active_prop = do
  Env env <- get
  keep_prop /\ known_props <-
    env.known_props
      # List.foldM
          ( \(keep_prop /\ props) prop' ->
              (compareProp active_prop prop' # runExceptT)
                <#> case _ of
                    -- prop >< prop' ==> keep prop'
                    Left _ -> (keep_prop /\ prop' : props)
                    -- prop < prop' ==> prop is subsumed; keep prop'
                    Right (LT /\ _) -> (false /\ prop' : props)
                    -- prop = prop' ==> prop is subsumed; keep prop'
                    Right (EQ /\ _) -> (false /\ prop' : props)
                    -- prop > prop' ==> prop' is subsumed so drop prop'
                    Right (GT /\ _) -> (keep_prop /\ props)
          )
          (true /\ Nil)
  if keep_prop then do
    tell [ Log { label: "learn", messages: [ active_prop # PropLogMessage ] } ]
    modify_ (\(Env env') -> (Env env' { known_props = active_prop : known_props }))
    -- activate any rules that can be applied to `prop`
    new_active_rules <-
      env.rules
        # traverse
            ( \rule -> do
                (applyRuleToProp rule active_prop # runExceptT)
                  >>= case _ of
                      Left err -> do
                        tell [ Log { label: "apply.fail", messages: [ "rule:" # StringLogMessage, rule # RuleLogMessage, "," # StringLogMessage, "active_prop:" # StringLogMessage, active_prop # PropLogMessage ] } ]
                        pure Nil
                      Right rule' -> do
                        tell [ Log { label: "apply.pass", messages: [ "rule:" # StringLogMessage, rule # RuleLogMessage, "," # StringLogMessage, "active_prop:" # StringLogMessage, active_prop # PropLogMessage ] } ]
                        case nextHypothesis rule' of
                          Left conclusion -> do
                            -- doesn't have any more hypotheses, so just learn its conclusion 
                            learnProp conclusion
                            pure Nil
                          Right _ -> do
                            pure (List.singleton rule')
            )
        # map List.fold
    modify_ (\(Env env') -> (Env env' { rules = new_active_rules <> env'.rules }))
  else do
    tell [ Log { label: "ignore", messages: [ active_prop # PropLogMessage ] } ]

applyRuleToProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow Err m =>
  MonadTell (Array Log) m =>
  Rule -> PropF Name -> ExceptT ApplyError m Rule
applyRuleToProp (Rule rule) prop = do
  case rule.hypotheses of
    Nil -> throwError (ApplyError { source: "applyRuleToProp", description: "no hypotheses" })
    hypothesis : hypotheses -> case hypothesis of
      Hypothesis hypothesis_prop sides -> do
        -- first, check if prop satisfies hypothesis_prop
        rule' <-
          compareProp hypothesis_prop prop
            >>= case _ of
                LT /\ sigma -> do
                  Rule { hypotheses, conclusion: rule.conclusion } # substRule sigma # pure
                EQ /\ sigma -> do
                  Rule { hypotheses, conclusion: rule.conclusion } # substRule sigma # pure
                _ -> throwError (ApplyError { source: "applyRuleToProp", description: show hypothesis_prop <> " < " <> show prop })
        -- second, check if the side hypotheses hold
        processSideHypotheses rule' sides

processSideHypotheses ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow Err m =>
  Rule -> Array SideHypothesis -> ExceptT ApplyError m Rule
processSideHypotheses rule sides =
  Array.foldr
    (\side m_rule -> m_rule >>= \rule' -> processSideHypothesis rule' side)
    (pure rule)
    sides

processSideHypothesis ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow Err m =>
  Rule -> SideHypothesis -> ExceptT ApplyError m Rule
processSideHypothesis rule = case _ of
  FunctionSideHypothesis side -> do
    Ctx { focusModule, externalFunctions } <- ask
    functionDef <-
      focusModule
        # lookupModule (Proxy :: Proxy "functionDefs") side.functionName
        # maybe (lift $ throwError (Err { source: "processSideHypothesis", description: "could not function definition of the name " <> show side.functionName })) pure
    result <- case functionDef of
      ExternalFunctionDef externalFunctionDef -> do
        function <- case Map.lookup externalFunctionDef.name externalFunctions of
          Nothing -> lift $ throwError (Err { source: "processSideHypothesis", description: "cound not find function of the name " <> show externalFunctionDef.name })
          Just function -> pure function
        args <- side.args # traverse (evaluateTerm >>> lift)
        result <-
          function (Array.zip externalFunctionDef.inputs args # map (lmap fst) # Map.fromFoldable)
            # either (\err -> lift $ throwError (Err { source: "processSideHypothesis", description: "error in function " <> show externalFunctionDef.name <> ": " <> err })) pure
        pure result
    substRule (Map.singleton side.resultVarName result) rule # pure

--------------------------------------------------------------------------------
-- Utilities
--------------------------------------------------------------------------------
evaluateTerm ::
  forall m y.
  MonadThrow Err m =>
  TermF Name -> m (TermF y)
evaluateTerm = traverse \x -> throwError (Err { source: "evaluateTerm", description: "expected term to be a value, but found a variable " <> show x })

compareProp ::
  forall m.
  MonadReader Ctx m =>
  MonadThrow Err m =>
  Prop -> Prop -> ExceptT ApplyError m LatticeOrdering
compareProp (Prop p1 t1) (Prop p2 t2) = do
  unless (p1 == p2) (throwError (ApplyError { source: "compareProp", description: show p1 <> " != " <> show p2 }))
  Ctx { focusModule: Module { relations } } <- ask
  domain <- case Map.lookup p1 relations of
    Nothing -> throwError (ApplyError { source: "compareProp", description: "could not find relation " <> show (show p1) })
    Just (Relation { domain }) -> pure domain
  compareTerm domain t1 t2

-- | Assumes that terms to have the same type type.
compareTerm ::
  forall m.
  MonadThrow Err m =>
  MonadReader Ctx m =>
  LatticeType -> Term -> Term -> ExceptT ApplyError m LatticeOrdering
compareTerm _lty (VarTerm x1) (VarTerm x2) =
  EQ
    /\ ( Map.fromFoldable
          [ x1 /\ VarTerm (freshName unit)
          , x2 /\ VarTerm (freshName unit)
          ]
      )
    # pure

compareTerm _lty (VarTerm x1) t2 = EQ /\ (Map.singleton x1 t2) # pure

compareTerm _lty t1 (VarTerm x2) = EQ /\ (Map.singleton x2 t1) # pure

compareTerm lty@(NamedLatticeType x) t1 t2 = do
  Ctx { focusModule } <- ask
  case lookupModule (Proxy :: Proxy "latticeTypeDefs") x focusModule of
    Nothing -> throwError (ApplyError { source: "comapreTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find lattice type definition with name " <> show x })
    Just latticeTypeDef -> case latticeTypeDef of
      LatticeTypeDef lty -> compareTerm lty t1 t2
      ExternalLatticeTypeDef latticeTypeDef -> do
        Ctx { externalCompares } <- ask
        case Map.lookup latticeTypeDef.name externalCompares of
          Nothing -> throwError (ApplyError { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "could not find compare function for external lattice type " <> show latticeTypeDef.name })
          Just compare -> case t1 /\ t2 of
            LiteralTerm s1 _ /\ LiteralTerm s2 _ -> case compare s1 s2 of
              Left description -> throwError (ApplyError { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description })
              Right o -> o /\ Map.empty # pure
            _ -> lift $ throwError (Err { source: "compareTerm " <> show lty <> " " <> show t1 <> " " <> show t2, description: "terms of an external lattice type are not literals" })

compareTerm lty@UnitLatticeType t1 t2 = case t1 /\ t2 of
  UnitTerm /\ UnitTerm -> EQ /\ Map.empty # pure
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftGreaterThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftLessThanRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> LT /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> GT /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftIncomparableRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> throwApplyErroror lty t1 t2
  RightTerm t1 /\ LeftTerm t2 -> throwApplyErroror lty t1 t2
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SumLatticeType LeftEqualRight_SumLatticeTypeOrdering lty_left lty_right) t1 t2 = case t1 /\ t2 of
  LeftTerm t1 /\ LeftTerm t2 -> compareTerm lty_left t1 t2
  LeftTerm t1 /\ RightTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ LeftTerm t2 -> EQ /\ Map.empty # pure
  RightTerm t1 /\ RightTerm t2 -> compareTerm lty_right t1 t2
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(ProductLatticeType FirstThenSecond_ProductLatticeTypeOrdering lty_1 lty_2) t1 t2 = case t1 /\ t2 of
  PairTerm t1_1 t1_2 /\ PairTerm t2_1 t2_2 -> do
    -- Debug.traceM $ "compareTerm " <> show lty_1 <> " " <> show t1_1 <> " " <> show t2_1
    compareTerm lty_1 t1_1 t2_1
      >>= case _ of
          LT /\ sigma -> LT /\ sigma # pure
          EQ /\ sigma -> do
            t1_2 <- substTerm sigma t1_2 # pure
            t2_2 <- substTerm sigma t2_2 # pure
            compareTerm lty_2 t1_2 t2_2 # map (rmap (Map.union sigma))
          GT /\ sigma -> GT /\ sigma # pure
  _ -> lift $ throwError (Err { source: "compareTerm", description: "type error; expected " <> show (show t1) <> " and " <> show (show t2) <> " to have the type " <> show (show lty) <> "." })

compareTerm lty@(SetLatticeType _ lty_elem) t1 t2 = Unsafe.todo "compareTerm SetLatticeType"

compareTerm (OppositeLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ sigma -> GT /\ sigma # pure
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ sigma -> GT /\ sigma # pure

compareTerm (DiscreteLatticeType lty) t1 t2 =
  compareTerm lty t1 t2
    >>= case _ of
        LT /\ _sigma -> throwApplyErroror (DiscreteLatticeType lty) t1 t2
        EQ /\ sigma -> EQ /\ sigma # pure
        GT /\ _sigma -> throwApplyErroror (DiscreteLatticeType lty) t1 t2

compareTerm (PowerLatticeType lty) t1 t2 = Unsafe.todo "compareTerm PowerLatticeType"

throwApplyErroror lty t1 t2 = throwError (ApplyError { source: "compareTerm", description: "in lattice " <> show lty <> ", " <> show t1 <> " !<= " <> show t2 })

lookup :: forall m56 a57 a60. Ord a60 => MonadThrow Err m56 => Show a60 => String -> a60 -> Map a60 a57 -> m56 a57
lookup label x m = case Map.lookup x m of
  Nothing -> throwError (Err { source: "lookup", description: label <> " not found: " <> show x })
  Just a -> pure a

partitionEither :: forall a b c. (a -> Either b c) -> List a -> (List b /\ List c)
partitionEither p xs = List.foldr select (Nil /\ Nil) xs
  where
  select a (bs /\ cs) = case p a of
    Left b -> (b : bs) /\ cs
    Right c -> bs /\ (c : cs)
