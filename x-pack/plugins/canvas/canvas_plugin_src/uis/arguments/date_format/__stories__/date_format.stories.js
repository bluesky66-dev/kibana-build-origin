"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _date_format = require("../date_format");

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


const dateFormats = [{
  value: 'l',
  text: 'Shorthand'
}, {
  value: 'x',
  text: 'Unix'
}, {
  value: 'LLL',
  text: 'Longhand'
}];
(0, _react.storiesOf)('arguments/DateFormat', module).add('with no format', () => /*#__PURE__*/_react2.default.createElement(_date_format.DateFormatArgInput, {
  dateFormats: dateFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "",
  argId: "DateFormatExample1",
  renderError: (0, _addonActions.action)('renderError')
})).add('with preset format', () => /*#__PURE__*/_react2.default.createElement(_date_format.DateFormatArgInput, {
  dateFormats: dateFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "LLL",
  argId: "DateFormatExample2",
  renderError: (0, _addonActions.action)('renderError')
})).add('with custom format', () => /*#__PURE__*/_react2.default.createElement(_date_format.DateFormatArgInput, {
  dateFormats: dateFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "MM/DD/YYYY",
  argId: "DateFormatExample3",
  renderError: (0, _addonActions.action)('renderError')
}));