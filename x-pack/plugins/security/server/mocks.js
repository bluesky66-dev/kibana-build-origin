"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securityMock = void 0;

var _authentication_service = require("./authentication/authentication_service.mock");

var _index = require("./authorization/index.mock");

var _index2 = require("../common/licensing/index.mock");

var _index3 = require("./audit/index.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createSetupMock() {
  const mockAuthz = _index.authorizationMock.create();

  return {
    audit: _index3.auditServiceMock.create(),
    authc: {
      getCurrentUser: jest.fn()
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      mode: mockAuthz.mode
    },
    registerSpacesService: jest.fn(),
    license: _index2.licenseMock.create()
  };
}

function createStartMock() {
  const mockAuthz = _index.authorizationMock.create();

  const mockAuthc = _authentication_service.authenticationServiceMock.createStart();

  return {
    authc: {
      apiKeys: mockAuthc.apiKeys,
      getCurrentUser: mockAuthc.getCurrentUser
    },
    authz: {
      actions: mockAuthz.actions,
      checkPrivilegesWithRequest: mockAuthz.checkPrivilegesWithRequest,
      checkPrivilegesDynamicallyWithRequest: mockAuthz.checkPrivilegesDynamicallyWithRequest,
      mode: mockAuthz.mode
    }
  };
}

function createApiResponseMock(apiResponse) {
  return {
    statusCode: null,
    headers: null,
    warnings: null,
    meta: {},
    ...apiResponse
  };
}

const securityMock = {
  createSetup: createSetupMock,
  createStart: createStartMock,
  createApiResponse: createApiResponseMock
};
exports.securityMock = securityMock;