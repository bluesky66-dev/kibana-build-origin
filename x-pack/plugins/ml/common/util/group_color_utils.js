"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabColor = tabColor;

var _eui_theme_dark = _interopRequireDefault(require("@elastic/eui/dist/eui_theme_dark.json"));

var _string_utils = require("./string_utils");

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


const COLORS = [_eui_theme_dark.default.euiColorVis0, _eui_theme_dark.default.euiColorVis1, _eui_theme_dark.default.euiColorVis2, _eui_theme_dark.default.euiColorVis3, _eui_theme_dark.default.euiColorVis4, _eui_theme_dark.default.euiColorVis5, _eui_theme_dark.default.euiColorVis6, _eui_theme_dark.default.euiColorVis7, _eui_theme_dark.default.euiColorVis8, _eui_theme_dark.default.euiColorVis9, _eui_theme_dark.default.euiColorDarkShade, _eui_theme_dark.default.euiColorPrimary];
const colorMap = {};

function tabColor(name) {
  if (colorMap[name] === undefined) {
    const n = (0, _string_utils.stringHash)(name);
    const color = COLORS[n % COLORS.length];
    colorMap[name] = color;
    return color;
  } else {
    return colorMap[name];
  }
}