module Foliage.Common where

import Prelude
import Control.Monad.Error.Class (class MonadThrow, throwError)
import Data.Map (Map)
import Data.Map as Map
import Data.Maybe (Maybe(..))
import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Halogen.HTML as HH
import Type.Proxy (Proxy(..))

type Html
  = HH.PlainHTML

type Htmls
  = Array Html

newtype Exc (label :: Symbol)
  = Exc
  { label :: Proxy label
  , source :: String
  , description :: String
  }

derive instance _Newtype_Exc :: Newtype (Exc label) _

derive newtype instance _Eq_Exc :: Eq (Exc label)

instance _Show_Exc :: IsSymbol label => Show (Exc label) where
  show (Exc { label, source, description }) = "[exc . " <> reflectSymbol label <> "] " <> source <> ": " <> description

_apply_rule = Proxy :: Proxy "apply rule"

_compare = Proxy :: Proxy "compare"

_error = Proxy :: Proxy "error"

map_Exc_label :: forall label1 label2. Proxy label2 -> Exc label1 -> Exc label2
map_Exc_label label (Exc exc) = Exc { label, source: exc.source, description: exc.description }

data Opaque (label :: Symbol) a
  = Opaque (Proxy label) a

instance _Eq_Opaque :: Eq (Opaque label a) where
  eq _ _ = false

instance _Show_Opaque :: IsSymbol label => Show (Opaque label a) where
  show (Opaque label _) = "<" <> reflectSymbol label <> ">"

fromOpaque :: forall t34 label35. Opaque label35 t34 -> t34
fromOpaque (Opaque _ a) = a

lookup :: forall m k v. Ord v => MonadThrow (Exc "error") m => Show v => String -> v -> Map v k -> m k
lookup label x m = case Map.lookup x m of
  Nothing -> throwError (Exc { label: _error, source: "lookup", description: label <> " not found: " <> show x })
  Just a -> pure a
