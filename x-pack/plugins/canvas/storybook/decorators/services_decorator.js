"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servicesContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _services = require("../../public/services");

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


const servicesContextDecorator = story => /*#__PURE__*/_react.default.createElement(_services.ServicesProvider, null, story());

exports.servicesContextDecorator = servicesContextDecorator;