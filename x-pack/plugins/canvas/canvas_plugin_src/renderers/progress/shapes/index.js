"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shapes = void 0;

var _gauge = _interopRequireDefault(require("!!raw-loader!./gauge.svg"));

var _horizontal_bar = _interopRequireDefault(require("!!raw-loader!./horizontal_bar.svg"));

var _horizontal_pill = _interopRequireDefault(require("!!raw-loader!./horizontal_pill.svg"));

var _semicircle = _interopRequireDefault(require("!!raw-loader!./semicircle.svg"));

var _unicorn = _interopRequireDefault(require("!!raw-loader!./unicorn.svg"));

var _vertical_bar = _interopRequireDefault(require("!!raw-loader!./vertical_bar.svg"));

var _vertical_pill = _interopRequireDefault(require("!!raw-loader!./vertical_pill.svg"));

var _wheel = _interopRequireDefault(require("!!raw-loader!./wheel.svg"));

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


const shapes = {
  gauge: _gauge.default,
  horizontalBar: _horizontal_bar.default,
  horizontalPill: _horizontal_pill.default,
  semicircle: _semicircle.default,
  unicorn: _unicorn.default,
  verticalBar: _vertical_bar.default,
  verticalPill: _vertical_pill.default,
  wheel: _wheel.default
};
exports.shapes = shapes;