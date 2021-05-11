"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticationMock = void 0;

var _mocks = require("../../../../../security/server/mocks");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createAuthenticationMock({
  currentUser
} = {}) {
  const {
    authc
  } = _mocks.securityMock.createSetup();

  authc.getCurrentUser.mockReturnValue(currentUser !== undefined ? // if we pass in null then use the null user (has null for each field) this is the default behavior
  // for the CaseService getUser method
  currentUser !== null ? currentUser : _common.nullUser : {
    email: 'd00d@awesome.com',
    username: 'awesome',
    full_name: 'Awesome D00d'
  });
  return authc;
}

const authenticationMock = {
  create: () => createAuthenticationMock(),
  createInvalid: () => createAuthenticationMock({
    currentUser: null
  })
};
exports.authenticationMock = authenticationMock;