"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctionNames = exports.renderFunctions = void 0;

var _debug = require("../canvas_plugin_src/renderers/debug");

var _error = require("../canvas_plugin_src/renderers/error");

var _image = require("../canvas_plugin_src/renderers/image");

var _repeat_image = require("../canvas_plugin_src/renderers/repeat_image");

var _reveal_image = require("../canvas_plugin_src/renderers/reveal_image");

var _markdown = require("../canvas_plugin_src/renderers/markdown");

var _metric = require("../canvas_plugin_src/renderers/metric");

var _pie = require("../canvas_plugin_src/renderers/pie");

var _plot = require("../canvas_plugin_src/renderers/plot");

var _progress = require("../canvas_plugin_src/renderers/progress");

var _shape = require("../canvas_plugin_src/renderers/shape");

var _table = require("../canvas_plugin_src/renderers/table");

var _text = require("../canvas_plugin_src/renderers/text");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * This is a collection of renderers which are bundled with the runtime.  If
 * a renderer is not listed here, but is used by the Shared Workpad, it will
 * not render.  This includes any plugins.
 */


const renderFunctions = [_debug.debug, _error.error, _image.image, _repeat_image.repeatImage, _reveal_image.revealImage, _markdown.markdown, _metric.metric, _pie.pie, _plot.plot, _progress.progress, _shape.shape, _table.table, _text.text];
exports.renderFunctions = renderFunctions;
const renderFunctionNames = renderFunctions.map(fn => fn.name);
exports.renderFunctionNames = renderFunctionNames;