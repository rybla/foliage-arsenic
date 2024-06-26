module Foliage.App.Style where

import Prelude
import Data.Array as Array
import Halogen.HTML.Properties as HP

style = HP.style <<< Array.foldMap (_ <> "; ")

flex_row = [ "display: flex", "flex-direction: row", "gap: 0.5em" ]

flex_column = [ "display: flex", "flex-direction: column", "gap: 0.5em" ]

rounded = [ "border-radius: 0.5em" ]

padding_big = [ "padding: 1em" ]

padding_vertical_small = [ "padding: 0.5em 0" ]

padding_vertical_big = [ "padding: 1.0em 0" ]

padding_horizontal_small = [ "padding: 0 1.0em" ]

padding_horizontal_big = [ "padding: 0 1.0em" ]

padding_small = [ "padding: 0.5em" ]

margin_small = [ "margin: 0.5em" ]

shadowed = [ "box-shadow: 0 0 0.2em 0.1em black" ]

font_code = [ "font-family: monospace" ]

font_prose = [ "font-family: serif" ]

font_fancy = [ "font-family: cursive" ]

bold = [ "font-weight: bold" ]

italic = [ "font-style: italic" ]

underline = [ "text-decoration: underline" ]

font_size_small = [ "font-size: 0.8em" ]

boundaries = rounded <> [ "box-shadow: 0.1em 0 0 0 rgba(0, 0, 0, 0.5) inset" ]

button = rounded <> [ "border: none", "background-color: black", "color: white", "padding: 0.2em 0.8em", "user-select: none" ]

button_secondary = rounded <> [ "border: none", "background-color: gray", "color: white", "padding: 0.2em 0.8em", "user-select: none" ]

color_error = [ "color: red" ]

hidden = [ "display: none", "visibility: hidden" ]

horizontal_bar = [ "width: 100%", "height: 2px", "background-color: black", "border-radius: 50px" ]
