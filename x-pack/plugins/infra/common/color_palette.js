"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleColor = exports.colorTransformer = exports.createPaletteTransformer = exports.defaultPalette = exports.Color = void 0;

var _lodash = require("lodash");

var _eui = require("@elastic/eui");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let Color;
exports.Color = Color;

(function (Color) {
  Color["color0"] = "color0";
  Color["color1"] = "color1";
  Color["color2"] = "color2";
  Color["color3"] = "color3";
  Color["color4"] = "color4";
  Color["color5"] = "color5";
  Color["color6"] = "color6";
  Color["color7"] = "color7";
  Color["color8"] = "color8";
  Color["color9"] = "color9";
})(Color || (exports.Color = Color = {}));

const euiPalette = (0, _eui.euiPaletteColorBlind)();
const defaultPalette = {
  [Color.color0]: euiPalette[1],
  // (blue)
  [Color.color1]: euiPalette[2],
  // (pink)
  [Color.color2]: euiPalette[0],
  // (green-ish)
  [Color.color3]: euiPalette[3],
  // (purple)
  [Color.color4]: euiPalette[4],
  // (light pink)
  [Color.color5]: euiPalette[5],
  // (yellow)
  [Color.color6]: euiPalette[6],
  // (tan)
  [Color.color7]: euiPalette[7],
  // (orange)
  [Color.color8]: euiPalette[8],
  // (brown)
  [Color.color9]: euiPalette[9] // (red)

};
exports.defaultPalette = defaultPalette;

const createPaletteTransformer = palette => color => palette[color];

exports.createPaletteTransformer = createPaletteTransformer;
const colorTransformer = createPaletteTransformer(defaultPalette);
exports.colorTransformer = colorTransformer;

const sampleColor = (usedColors = []) => {
  const available = (0, _lodash.difference)((0, _lodash.values)(Color), usedColors);
  return (0, _lodash.first)(available) || Color.color0;
};

exports.sampleColor = sampleColor;