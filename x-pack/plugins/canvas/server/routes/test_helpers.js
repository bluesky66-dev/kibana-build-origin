"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMockedRouterDeps = getMockedRouterDeps;

var _mocks = require("src/core/server/mocks");

var _mocks2 = require("../../../../../src/plugins/bfetch/server/mocks");

var _mocks3 = require("../../../../../src/plugins/expressions/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getMockedRouterDeps() {
  const httpService = _mocks.httpServiceMock.createSetupContract();

  const elasticsearch = _mocks.elasticsearchServiceMock.createSetup();

  const bfetch = _mocks2.bfetchPluginMock.createSetupContract();

  const expressions = _mocks3.expressionsPluginMock.createSetupContract();

  const router = httpService.createRouter();
  return {
    router,
    expressions,
    elasticsearch,
    bfetch,
    logger: _mocks.loggingSystemMock.create().get()
  };
}