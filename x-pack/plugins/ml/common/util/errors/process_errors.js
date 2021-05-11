"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractErrorMessage = exports.extractErrorProperties = void 0;

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const extractErrorProperties = error => {
  // extract properties of the error object from within the response error
  // coming from Kibana, Elasticsearch, and our own ML messages
  // some responses contain raw es errors as part of a bulk response
  // e.g. if some jobs fail the action in a bulk request
  if ((0, _types.isEsErrorBody)(error)) {
    return {
      message: error.error.reason,
      statusCode: error.status,
      fullError: error
    };
  }

  if ((0, _types.isErrorString)(error)) {
    return {
      message: error
    };
  }

  if ((0, _types.isBoomError)(error)) {
    return {
      message: error.output.payload.message,
      statusCode: error.output.payload.statusCode
    };
  }

  if ((error === null || error === void 0 ? void 0 : error.body) === undefined && !(error !== null && error !== void 0 && error.message)) {
    return {
      message: ''
    };
  }

  if (typeof error.body === 'string') {
    return {
      message: error.body
    };
  }

  if ((0, _types.isMLResponseError)(error)) {
    var _error$body$attribute, _error$body$attribute2;

    if (typeof error.body.attributes === 'object' && typeof ((_error$body$attribute = error.body.attributes.body) === null || _error$body$attribute === void 0 ? void 0 : (_error$body$attribute2 = _error$body$attribute.error) === null || _error$body$attribute2 === void 0 ? void 0 : _error$body$attribute2.reason) === 'string') {
      var _error$body$attribute3, _error$body$attribute4, _error$body$attribute5;

      const errObj = {
        message: error.body.attributes.body.error.reason,
        statusCode: error.body.statusCode,
        fullError: error.body.attributes.body
      };

      if (typeof error.body.attributes.body.error.caused_by === 'object' && (typeof ((_error$body$attribute3 = error.body.attributes.body.error.caused_by) === null || _error$body$attribute3 === void 0 ? void 0 : _error$body$attribute3.reason) === 'string' || typeof ((_error$body$attribute4 = error.body.attributes.body.error.caused_by) === null || _error$body$attribute4 === void 0 ? void 0 : (_error$body$attribute5 = _error$body$attribute4.caused_by) === null || _error$body$attribute5 === void 0 ? void 0 : _error$body$attribute5.reason) === 'string')) {
        var _error$body$attribute6, _error$body$attribute7, _error$body$attribute8;

        errObj.causedBy = ((_error$body$attribute6 = error.body.attributes.body.error.caused_by) === null || _error$body$attribute6 === void 0 ? void 0 : (_error$body$attribute7 = _error$body$attribute6.caused_by) === null || _error$body$attribute7 === void 0 ? void 0 : _error$body$attribute7.reason) || ((_error$body$attribute8 = error.body.attributes.body.error.caused_by) === null || _error$body$attribute8 === void 0 ? void 0 : _error$body$attribute8.reason);
      }

      return errObj;
    } else {
      return {
        message: error.body.message,
        statusCode: error.body.statusCode
      };
    }
  }

  if ((0, _types.isErrorMessage)(error)) {
    return {
      message: error.message
    };
  } // If all else fail return an empty message instead of JSON.stringify


  return {
    message: ''
  };
};

exports.extractErrorProperties = extractErrorProperties;

const extractErrorMessage = error => {
  // extract only the error message within the response error coming from Kibana, Elasticsearch, and our own ML messages
  const errorObj = extractErrorProperties(error);
  return errorObj.message;
};

exports.extractErrorMessage = extractErrorMessage;