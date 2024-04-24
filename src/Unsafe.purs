module Unsafe where

import Prelude
import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.String.CodeUnits (fromCharArray)
import Partial.Unsafe (unsafeCrashWith)

todo :: forall a. String -> a
todo msg =
  unsafeCrashWith
    (Array.intercalate "\n" [ header, "[TODO]", msg, header ])
  where
  header = '=' # Array.replicate 20 # fromCharArray

fromJust :: forall a. String -> Maybe a -> a
fromJust msg = case _ of
  Nothing -> unsafeCrashWith ("[unsafe] fromJust Nothing: " <> msg)
  Just a -> a
