"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeViews = exports.viewInitializers = exports.viewSpecs = void 0;

var _dropdownControl = require("./dropdownControl");

var _getCell = require("./getCell");

var _image = require("./image");

var _markdown = require("./markdown");

var _metric = require("./metric");

var _pie = require("./pie");

var _plot = require("./plot");

var _progress = require("./progress");

var _repeatImage = require("./repeatImage");

var _revealImage = require("./revealImage");

var _render = require("./render");

var _shape = require("./shape");

var _table = require("./table");

var _timefilterControl = require("./timefilterControl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local
// @ts-expect-error untyped local


const viewSpecs = [_dropdownControl.dropdownControl, _getCell.getCell, _image.image, _markdown.markdown, _pie.pie, _plot.plot, _progress.progress, _repeatImage.repeatImage, _revealImage.revealImage, _render.render, _shape.shape, _table.table, _timefilterControl.timefilterControl];
exports.viewSpecs = viewSpecs;
const viewInitializers = [_metric.metricInitializer];
exports.viewInitializers = viewInitializers;

const initializeViews = (core, plugins) => {
  return [...viewSpecs, ...viewInitializers.map(initializer => initializer(core, plugins))];
};

exports.initializeViews = initializeViews;