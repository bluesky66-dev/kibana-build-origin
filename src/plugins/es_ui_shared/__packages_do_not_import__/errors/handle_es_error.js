"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleEsError = void 0;

var _es_error_parser = require("./es_error_parser");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * For errors returned by the new elasticsearch js client.
 */
const handleEsError = ({
  error,
  response,
  handleCustomError
}) => {
  // error.name is slightly better in terms of performance, since all errors now have name property
  if (error.name === 'ResponseError') {
    var _body$error, _body$error2, _body$error2$caused_b, _body$error3;

    // The consumer may sometimes want to provide a custom response
    if (typeof handleCustomError === 'function') {
      return handleCustomError();
    }

    const {
      statusCode,
      body
    } = error;
    return response.customError({
      statusCode,
      body: {
        message: // We use || instead of ?? as the switch here because reason could be an empty string
        (body === null || body === void 0 ? void 0 : (_body$error = body.error) === null || _body$error === void 0 ? void 0 : _body$error.reason) || (body === null || body === void 0 ? void 0 : (_body$error2 = body.error) === null || _body$error2 === void 0 ? void 0 : (_body$error2$caused_b = _body$error2.caused_by) === null || _body$error2$caused_b === void 0 ? void 0 : _body$error2$caused_b.reason) || error.message || 'Unknown error',
        attributes: {
          // The full original ES error object
          error: body === null || body === void 0 ? void 0 : body.error,
          // We assume that this is an ES error object with a nested caused by chain if we can see the "caused_by" field at the top-level
          causes: body !== null && body !== void 0 && (_body$error3 = body.error) !== null && _body$error3 !== void 0 && _body$error3.caused_by ? (0, _es_error_parser.getEsCause)(body.error) : undefined
        }
      }
    });
  } // Case: default


  return response.internalError({
    body: error
  });
};

exports.handleEsError = handleEsError;