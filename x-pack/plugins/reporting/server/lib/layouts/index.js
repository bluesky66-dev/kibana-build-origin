"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LayoutParams", {
  enumerable: true,
  get: function () {
    return _types.LayoutParams;
  }
});
Object.defineProperty(exports, "LayoutSelectorDictionary", {
  enumerable: true,
  get: function () {
    return _types.LayoutSelectorDictionary;
  }
});
Object.defineProperty(exports, "PageSizeParams", {
  enumerable: true,
  get: function () {
    return _types.PageSizeParams;
  }
});
Object.defineProperty(exports, "PdfImageSize", {
  enumerable: true,
  get: function () {
    return _types.PdfImageSize;
  }
});
Object.defineProperty(exports, "Size", {
  enumerable: true,
  get: function () {
    return _types.Size;
  }
});
Object.defineProperty(exports, "createLayout", {
  enumerable: true,
  get: function () {
    return _create_layout.createLayout;
  }
});
Object.defineProperty(exports, "PreserveLayout", {
  enumerable: true,
  get: function () {
    return _preserve_layout.PreserveLayout;
  }
});
Object.defineProperty(exports, "CanvasLayout", {
  enumerable: true,
  get: function () {
    return _canvas_layout.CanvasLayout;
  }
});
Object.defineProperty(exports, "PrintLayout", {
  enumerable: true,
  get: function () {
    return _print_layout.PrintLayout;
  }
});
exports.getDefaultLayoutSelectors = exports.LayoutTypes = void 0;

var _types = require("../../../common/types");

var _create_layout = require("./create_layout");

var _preserve_layout = require("./preserve_layout");

var _canvas_layout = require("./canvas_layout");

var _print_layout = require("./print_layout");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LayoutTypes = {
  PRESERVE_LAYOUT: 'preserve_layout',
  PRINT: 'print',
  CANVAS: 'canvas' // no margins or branding in the layout

};
exports.LayoutTypes = LayoutTypes;

const getDefaultLayoutSelectors = () => ({
  screenshot: '[data-shared-items-container]',
  renderComplete: '[data-shared-item]',
  itemsCountAttribute: 'data-shared-items-count',
  timefilterDurationAttribute: 'data-shared-timefilter-duration'
});

exports.getDefaultLayoutSelectors = getDefaultLayoutSelectors;