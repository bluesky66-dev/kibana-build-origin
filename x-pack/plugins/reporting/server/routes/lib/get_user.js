"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUserFactory = getUserFactory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getUserFactory(security) {
  return request => {
    var _security$authc$getCu;

    return (_security$authc$getCu = security === null || security === void 0 ? void 0 : security.authc.getCurrentUser(request)) !== null && _security$authc$getCu !== void 0 ? _security$authc$getCu : false;
  };
}