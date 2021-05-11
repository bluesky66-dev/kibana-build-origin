"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAuthorizationHeader = getAuthorizationHeader;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getAuthorizationHeader(request) {
  return request.headers.authorization === undefined ? {} : {
    headers: {
      'es-secondary-authorization': request.headers.authorization
    }
  };
}