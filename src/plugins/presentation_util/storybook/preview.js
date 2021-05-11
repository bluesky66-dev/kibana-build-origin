"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parameters = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _blocks = require("@storybook/addon-docs/blocks");

var _decorator = require("./decorator");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
(0, _react2.addDecorator)(_decorator.servicesContextDecorator);
const parameters = {
  docs: {
    page: () => /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_blocks.Title, null), /*#__PURE__*/_react.default.createElement(_blocks.Subtitle, null), /*#__PURE__*/_react.default.createElement(_blocks.Description, null), /*#__PURE__*/_react.default.createElement(_blocks.Primary, null), /*#__PURE__*/_react.default.createElement(_blocks.Stories, null))
  }
};
exports.parameters = parameters;