"use strict";

var _react = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _react2 = _interopRequireDefault(require("react"));

var _context_example = require("../../../../test/context_example");

var _autoplay_settings = require("../autoplay_settings");

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


const style = {
  width: 256,
  height: 228,
  padding: 16,
  border: '1px solid #ccc',
  background: '#fff'
};
(0, _react.storiesOf)('shareables/Footer/Settings/AutoplaySettings', module).add('contextual', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style
}, /*#__PURE__*/_react2.default.createElement(_autoplay_settings.AutoplaySettings, null))).add('component: off, 2s', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style
}, /*#__PURE__*/_react2.default.createElement(_autoplay_settings.AutoplaySettingsComponent, {
  isEnabled: false,
  interval: "2s",
  onSetAutoplay: (0, _addonActions.action)('onSetAutoplay'),
  onSetInterval: (0, _addonActions.action)('onSetInterval')
}))).add('component: on, 5s', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  style
}, /*#__PURE__*/_react2.default.createElement(_autoplay_settings.AutoplaySettingsComponent, {
  isEnabled: true,
  interval: "5s",
  onSetAutoplay: (0, _addonActions.action)('onSetAutoplay'),
  onSetInterval: (0, _addonActions.action)('onSetInterval')
})));