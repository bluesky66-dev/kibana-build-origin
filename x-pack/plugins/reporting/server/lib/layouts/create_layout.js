"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createLayout = createLayout;

var _constants = require("../../../common/constants");

var _ = require("./");

var _canvas_layout = require("./canvas_layout");

var _preserve_layout = require("./preserve_layout");

var _print_layout = require("./print_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createLayout(captureConfig, layoutParams) {
  if (layoutParams && layoutParams.dimensions && layoutParams.id === _constants.LAYOUT_TYPES.PRESERVE_LAYOUT) {
    return new _preserve_layout.PreserveLayout(layoutParams.dimensions);
  }

  if (layoutParams && layoutParams.dimensions && layoutParams.id === _.LayoutTypes.CANVAS) {
    return new _canvas_layout.CanvasLayout(layoutParams.dimensions);
  } // layoutParams is optional as PrintLayout doesn't use it


  return new _print_layout.PrintLayout(captureConfig);
}