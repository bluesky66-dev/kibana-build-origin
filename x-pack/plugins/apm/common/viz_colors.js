"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getVizColorForIndex = getVizColorForIndex;

var _eui_theme_light = _interopRequireDefault(require("@elastic/eui/dist/eui_theme_light.json"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getVizColorsForTheme(theme = _eui_theme_light.default) {
  return [theme.euiColorVis0, theme.euiColorVis1, theme.euiColorVis2, theme.euiColorVis3, theme.euiColorVis4, theme.euiColorVis5, theme.euiColorVis6, theme.euiColorVis7, theme.euiColorVis8, theme.euiColorVis9];
}

function getVizColorForIndex(index = 0, theme = _eui_theme_light.default) {
  const colors = getVizColorsForTheme(theme);
  return colors[index % colors.length];
}