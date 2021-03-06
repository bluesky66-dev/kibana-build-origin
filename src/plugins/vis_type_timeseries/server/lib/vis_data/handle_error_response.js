"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleErrorResponse = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const handleErrorResponse = panel => error => {
  if (error.isBoom && error.status === 401) throw error;
  const result = {};
  let errorResponse;

  try {
    errorResponse = JSON.parse(error.response);
  } catch (e) {
    errorResponse = error.response;
  }

  if (!errorResponse && !(error.name === 'KQLSyntaxError')) {
    errorResponse = {
      message: error.message,
      stack: error.stack
    };
  }

  if (error.name === 'KQLSyntaxError') {
    errorResponse = {
      message: error.shortMessage,
      stack: error.stack
    };
  }

  result[panel.id] = {
    id: panel.id,
    statusCode: error.statusCode,
    error: errorResponse,
    series: []
  };
  return result;
};

exports.handleErrorResponse = handleErrorResponse;