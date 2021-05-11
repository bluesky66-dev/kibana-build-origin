"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotAuthorizedSection = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const NotAuthorizedSection = ({
  title,
  message
}) => /*#__PURE__*/_react.default.createElement(_eui.EuiEmptyPrompt, {
  iconType: "securityApp",
  title: /*#__PURE__*/_react.default.createElement("h2", null, title),
  body: /*#__PURE__*/_react.default.createElement("p", null, message)
});

exports.NotAuthorizedSection = NotAuthorizedSection;