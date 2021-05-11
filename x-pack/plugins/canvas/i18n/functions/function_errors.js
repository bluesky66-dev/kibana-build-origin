"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFunctionErrors = void 0;

var _alter_column = require("./dict/alter_column");

var _asset = require("./dict/asset");

var _axis_config = require("./dict/axis_config");

var _compare = require("./dict/compare");

var _container_style = require("./dict/container_style");

var _csv = require("./dict/csv");

var _date = require("./dict/date");

var _demodata = require("./dict/demodata");

var _get_cell = require("./dict/get_cell");

var _image = require("./dict/image");

var _join_rows = require("./dict/join_rows");

var _math = require("./dict/math");

var _ply = require("./dict/ply");

var _pointseries = require("./dict/pointseries");

var _progress = require("./dict/progress");

var _reveal_image = require("./dict/reveal_image");

var _timefilter = require("./dict/timefilter");

var _to = require("./dict/to");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFunctionErrors = () => ({
  alterColumn: _alter_column.errors,
  asset: _asset.errors,
  axisConfig: _axis_config.errors,
  compare: _compare.errors,
  containerStyle: _container_style.errors,
  csv: _csv.errors,
  date: _date.errors,
  demodata: _demodata.errors,
  getCell: _get_cell.errors,
  image: _image.errors,
  joinRows: _join_rows.errors,
  math: _math.errors,
  ply: _ply.errors,
  pointseries: _pointseries.errors,
  progress: _progress.errors,
  revealImage: _reveal_image.errors,
  timefilter: _timefilter.errors,
  to: _to.errors
});

exports.getFunctionErrors = getFunctionErrors;