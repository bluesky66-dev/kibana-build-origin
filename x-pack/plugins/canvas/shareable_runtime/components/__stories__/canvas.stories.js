"use strict";

var _react = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _react2 = _interopRequireDefault(require("react"));

var _context_example = require("../../test/context_example");

var _canvas = require("../canvas");

var _test = require("../../test");

var _state = require("../../context/state");

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


const {
  austin
} = _test.sharedWorkpads;
(0, _react.storiesOf)('shareables/Canvas', module).add('contextual: austin', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "austin"
}, /*#__PURE__*/_react2.default.createElement(_canvas.Canvas, null))).add('contextual: hello', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "hello"
}, /*#__PURE__*/_react2.default.createElement(_canvas.Canvas, null))).add('component', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "austin"
}, /*#__PURE__*/_react2.default.createElement(_canvas.CanvasComponent, {
  onSetPage: (0, _addonActions.action)('onSetPage'),
  onSetScrubberVisible: (0, _addonActions.action)('onSetScrubberVisible'),
  refs: _state.initialCanvasShareableState.refs,
  settings: _state.initialCanvasShareableState.settings,
  stage: {
    height: 338,
    page: 0,
    width: 600
  },
  workpad: austin
})));