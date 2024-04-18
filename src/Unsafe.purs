module Unsafe where

import Prelude
import Data.Array as Array
import Data.String.CodeUnits (fromCharArray)
import Partial.Unsafe (unsafeCrashWith)

todo :: forall a. String -> a
todo msg =
  unsafeCrashWith
    (Array.intercalate "\n" [ header, "[TODO]", msg, header ])
  where
  header = '=' # Array.replicate 20 # fromCharArray
