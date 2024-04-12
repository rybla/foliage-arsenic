module Foliage.Program where

data Program
  = Program
    { mod :: Module
    }

data Module
  = Module
    { name :: String
    , relations :: Relation
    }

data Relation
  = Relation
