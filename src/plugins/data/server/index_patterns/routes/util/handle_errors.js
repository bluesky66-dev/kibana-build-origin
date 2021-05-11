"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleErrors = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * This higher order request handler makes sure that errors are returned with
 * body formatted in the following shape:
 *
 * ```json
 * {
 *   "message": "...",
 *   "attributes": {}
 * }
 * ```
 */
const handleErrors = handler => async (context, request, response) => {
  try {
    return await handler(context, request, response);
  } catch (error) {
    if (error instanceof Error) {
      var _output;

      const body = {
        message: error.message
      };

      if (typeof error.data === 'object') {
        body.attributes = error.data;
      }

      const is404 = error.is404 || (error === null || error === void 0 ? void 0 : (_output = error.output) === null || _output === void 0 ? void 0 : _output.statusCode) === 404;

      if (is404) {
        return response.notFound({
          headers: {
            'content-type': 'application/json'
          },
          body
        });
      }

      return response.badRequest({
        headers: {
          'content-type': 'application/json'
        },
        body
      });
    }

    throw error;
  }
};

exports.handleErrors = handleErrors;