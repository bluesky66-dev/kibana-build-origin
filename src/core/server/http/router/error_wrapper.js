"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapErrors = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const wrapErrors = handler => {
  return async (context, request, response) => {
    try {
      return await handler(context, request, response);
    } catch (e) {
      if (_boom.default.isBoom(e)) {
        return response.customError({
          body: e.output.payload,
          statusCode: e.output.statusCode,
          headers: e.output.headers
        });
      }

      throw e;
    }
  };
};

exports.wrapErrors = wrapErrors;