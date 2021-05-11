"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderFunctionFactories = exports.renderFunctions = void 0;

var _debug = require("./debug");

var _error = require("./error");

var _image = require("./image");

var _markdown = require("./markdown");

var _metric = require("./metric");

var _pie = require("./pie");

var _plot = require("./plot");

var _progress = require("./progress");

var _repeat_image = require("./repeat_image");

var _reveal_image = require("./reveal_image");

var _shape = require("./shape");

var _table = require("./table");

var _text = require("./text");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const renderFunctions = [_debug.debug, _error.error, _image.image, _markdown.markdown, _metric.metric, _pie.pie, _plot.plot, _progress.progress, _repeat_image.repeatImage, _reveal_image.revealImage, _shape.shape, _table.table, _text.text];
exports.renderFunctions = renderFunctions;
const renderFunctionFactories = [];
exports.renderFunctionFactories = renderFunctionFactories;