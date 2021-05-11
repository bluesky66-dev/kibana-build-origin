"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeArgs = exports.initializers = exports.args = void 0;

var _axis_config = require("./axis_config");

var _datacolumn = require("./datacolumn");

var _date_format = require("./date_format");

var _filter_group = require("./filter_group");

var _image_upload = require("./image_upload");

var _number = require("./number");

var _number_format = require("./number_format");

var _palette = require("./palette");

var _percentage = require("./percentage");

var _range = require("./range");

var _select = require("./select");

var _shape = require("./shape");

var _string = require("./string");

var _textarea = require("./textarea");

var _toggle = require("./toggle");
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


const args = [_axis_config.axisConfig, _datacolumn.datacolumn, _filter_group.filterGroup, _image_upload.imageUpload, _number.number, _palette.palette, _percentage.percentage, _range.range, _select.select, _shape.shape, _string.string, _textarea.textarea, _toggle.toggle];
exports.args = args;
const initializers = [_date_format.dateFormatInitializer, _number_format.numberFormatInitializer];
exports.initializers = initializers;

const initializeArgs = (core, plugins) => {
  return [...args, ...initializers.map(initializer => initializer(core, plugins))];
};

exports.initializeArgs = initializeArgs;