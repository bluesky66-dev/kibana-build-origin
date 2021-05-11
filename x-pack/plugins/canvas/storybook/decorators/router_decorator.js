"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routerContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _router = require("../../public/components/router");

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


const routerContextDecorator = story => /*#__PURE__*/_react.default.createElement(_router.RouterContext.Provider, {
  value: {
    navigateTo: () => {}
  }
}, story());

exports.routerContextDecorator = routerContextDecorator;