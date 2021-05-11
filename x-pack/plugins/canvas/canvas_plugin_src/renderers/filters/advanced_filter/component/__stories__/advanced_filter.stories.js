"use strict";

var _addonActions = require("@storybook/addon-actions");

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _advanced_filter = require("../advanced_filter");

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


(0, _react.storiesOf)('renderers/AdvancedFilter', module).add('default', () => /*#__PURE__*/_react2.default.createElement(_advanced_filter.AdvancedFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit')
})).add('with value', () => /*#__PURE__*/_react2.default.createElement(_advanced_filter.AdvancedFilter, {
  onChange: (0, _addonActions.action)('onChange'),
  commit: (0, _addonActions.action)('commit'),
  value: "expression"
}));