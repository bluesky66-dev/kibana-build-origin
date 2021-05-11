"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _context_example = require("../../../../test/context_example");

var _settings = require("../settings");

var _context = require("../../../../context");

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


(0, _react.storiesOf)('shareables/Footer/Settings', module).add('contextual', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style: {
    background: '#333',
    padding: 10
  }
}, /*#__PURE__*/_react2.default.createElement(_settings.Settings, null))).add('component', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style: {
    background: '#333',
    padding: 10
  }
}, /*#__PURE__*/_react2.default.createElement(_settings.SettingsComponent, {
  refs: _context.initialCanvasShareableState.refs
})));