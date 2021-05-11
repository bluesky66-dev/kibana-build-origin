"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _number_format = require("../number_format");

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


const numberFormats = [{
  value: '0.0[000]',
  text: 'Number'
}, {
  value: '0.0%',
  text: 'Percent'
}, {
  value: '$0.00',
  text: 'Currency'
}, {
  value: '00:00:00',
  text: 'Duration'
}, {
  value: '0.0b',
  text: 'Bytes'
}];
(0, _react.storiesOf)('arguments/NumberFormat', module).add('with no format', () => /*#__PURE__*/_react2.default.createElement(_number_format.NumberFormatArgInput, {
  numberFormats: numberFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "",
  argId: "NumberFormatExample1",
  renderError: (0, _addonActions.action)('renderError')
})).add('with preset format', () => /*#__PURE__*/_react2.default.createElement(_number_format.NumberFormatArgInput, {
  numberFormats: numberFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "$0.00",
  argId: "NumberFormatExample2",
  renderError: (0, _addonActions.action)('renderError')
})).add('with custom format', () => /*#__PURE__*/_react2.default.createElement(_number_format.NumberFormatArgInput, {
  numberFormats: numberFormats,
  onValueChange: (0, _addonActions.action)('onValueChange'),
  argValue: "0.0[000]a",
  argId: "NumberFormatExample3",
  renderError: (0, _addonActions.action)('renderError')
}));