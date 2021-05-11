"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockServer = void 0;

var _test_utils = require("src/core/server/http/test_utils");

var _mocks = require("src/core/server/mocks");

var _context_service = require("src/core/server/context/context_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


const coreId = Symbol('reporting');

const createMockServer = async () => {
  const coreContext = (0, _test_utils.createCoreContext)({
    coreId
  });
  const contextService = new _context_service.ContextService(coreContext);
  const server = (0, _test_utils.createHttpServer)(coreContext);
  const httpSetup = await server.setup({
    context: contextService.setup({
      pluginDependencies: new Map()
    })
  });

  const handlerContext = _mocks.coreMock.createRequestHandlerContext();

  httpSetup.registerRouteHandlerContext(coreId, 'core', async (ctx, req, res) => {
    return handlerContext;
  });
  return {
    server,
    httpSetup,
    handlerContext
  };
};

exports.createMockServer = createMockServer;