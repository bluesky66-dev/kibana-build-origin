"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.globalSearchPluginMock = void 0;

var _rxjs = require("rxjs");

var _search_service = require("./services/search_service.mock");

var _context = require("./services/context.mock");

var _mocks = require("../../../../src/core/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupMock = () => {
  const searchMock = _search_service.searchServiceMock.createSetupContract();

  return {
    registerResultProvider: searchMock.registerResultProvider
  };
};

const createStartMock = () => {
  const searchMock = _search_service.searchServiceMock.createStartContract();

  return {
    find: searchMock.find,
    getSearchableTypes: searchMock.getSearchableTypes
  };
};

const createRouteHandlerContextMock = () => {
  const handlerContextMock = {
    find: jest.fn(),
    getSearchableTypes: jest.fn()
  };
  handlerContextMock.find.mockReturnValue((0, _rxjs.of)([]));
  return handlerContextMock;
};

const createRequestHandlerContextMock = () => {
  const handlerContextMock = {
    find: jest.fn(),
    getSearchableTypes: jest.fn()
  };
  handlerContextMock.find.mockReturnValue((0, _rxjs.of)([]));
  return {
    core: _mocks.coreMock.createRequestHandlerContext(),
    globalSearch: handlerContextMock
  };
};

const globalSearchPluginMock = {
  createSetupContract: createSetupMock,
  createStartContract: createStartMock,
  createRouteHandlerContext: createRouteHandlerContextMock,
  createProviderContext: _context.contextMock.create,
  createRequestHandlerContext: createRequestHandlerContextMock
};
exports.globalSearchPluginMock = globalSearchPluginMock;