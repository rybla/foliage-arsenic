module Foliage.Common where

import Prelude

import Data.Newtype (class Newtype)
import Data.Symbol (class IsSymbol, reflectSymbol)
import Type.Proxy (Proxy(..))

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