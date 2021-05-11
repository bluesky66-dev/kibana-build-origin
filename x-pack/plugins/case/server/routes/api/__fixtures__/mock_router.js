"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRoute = void 0;

var _mocks = require("../../../../../../../src/core/server/mocks");

var _services = require("../../../services");

var _fixtures__ = require("../__fixtures__");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRoute = async (api, method, badAuth = false) => {
  const httpService = _mocks.httpServiceMock.createSetupContract();

  const router = httpService.createRouter();

  const log = _mocks.loggingSystemMock.create().get('case');

  const auth = badAuth ? _fixtures__.authenticationMock.createInvalid() : _fixtures__.authenticationMock.create();
  const caseService = new _services.CaseService(log, auth);
  const caseConfigureServicePlugin = new _services.CaseConfigureService(log);
  const connectorMappingsServicePlugin = new _services.ConnectorMappingsService(log);
  const caseConfigureService = await caseConfigureServicePlugin.setup();
  const connectorMappingsService = await connectorMappingsServicePlugin.setup();
  api({
    caseConfigureService,
    caseService,
    connectorMappingsService,
    router,
    userActionService: {
      postUserActions: jest.fn(),
      getUserActions: jest.fn()
    },
    logger: log
  });
  return router[method].mock.calls[0][1];
};

exports.createRoute = createRoute;