"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEmptyFailureResponse = void 0;

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


const createEmptyFailureResponse = errors => {
  const errorMessages = (errors || []).map(error => {
    if (_boom.default.isBoom(error)) {
      return error.output.payload;
    }

    return error;
  });
  return {
    success: false,
    successCount: 0,
    errors: errorMessages
  };
};

exports.createEmptyFailureResponse = createEmptyFailureResponse;