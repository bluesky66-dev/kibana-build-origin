"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatResponse = void 0;

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


const formatResponse = esErrors => resp => {
  if (resp.isBoom) {
    return resp;
  } // can't wrap it if it's already a boom error


  if (resp instanceof esErrors['400']) {
    return _boom.default.badRequest(resp);
  }

  if (resp instanceof esErrors['401']) {
    return _boom.default.unauthorized();
  }

  if (resp instanceof esErrors['403']) {
    return _boom.default.forbidden("Sorry, you don't have access to that");
  }

  if (resp instanceof esErrors['404']) {
    return _boom.default.boomify(resp, {
      statusCode: 404
    });
  }

  return resp;
};

exports.formatResponse = formatResponse;