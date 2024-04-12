{ name = "my-project"
, dependencies =
  [ "arrays"
  , "console"
  , "effect"
  , "maybe"
  , "ordered-collections"
  , "prelude"
  , "transformers"
  , "unordered-collections"
  ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs", "test/**/*.purs" ]
}
