"use strict";

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _dropdown_filter = require("../dropdown_filter");

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


const choices = [['1', 'Item One'], ['2', 'Item Two'], ['3', 'Item Three']];
(0, _react.storiesOf)('renderers/DropdownFilter', module).add('default', () => /*#__PURE__*/_react2.default.createElement(_dropdown_filter.DropdownFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit')
})).add('with new value', () => /*#__PURE__*/_react2.default.createElement(_dropdown_filter.DropdownFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit'),
  value: "selectedValue"
})).add('with choices', () => /*#__PURE__*/_react2.default.createElement(_dropdown_filter.DropdownFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit'),
  choices: choices
})).add('with choices and value', () => /*#__PURE__*/_react2.default.createElement(_dropdown_filter.DropdownFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit'),
  choices: choices,
  value: "Item Two"
})).add('with choices and new value', () => /*#__PURE__*/_react2.default.createElement(_dropdown_filter.DropdownFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit'),
  choices: choices,
  value: "selectedValue"
}));