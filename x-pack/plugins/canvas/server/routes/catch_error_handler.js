"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchErrorHandler = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const catchErrorHandler = fn => {
  return async (context, request, response) => {
    try {
      return await fn(context, request, response);
    } catch (error) {
      if (error.isBoom) {
        return response.customError({
          body: error.output.payload,
          statusCode: error.output.statusCode
        });
      }

      return response.internalError({
        body: error
      });
    }
  };
};

exports.catchErrorHandler = catchErrorHandler;