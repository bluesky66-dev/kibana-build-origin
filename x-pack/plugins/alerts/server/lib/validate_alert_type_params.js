"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateAlertTypeParams = validateAlertTypeParams;

var _boom = _interopRequireDefault(require("@hapi/boom"));

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


function validateAlertTypeParams(params, validator) {
  if (!validator) {
    return params;
  }

  try {
    return validator.validate(params);
  } catch (err) {
    throw _boom.default.badRequest(`params invalid: ${err.message}`);
  }
}