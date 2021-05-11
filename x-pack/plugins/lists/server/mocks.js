"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listMock = void 0;

var _list_client = require("./services/lists/list_client.mock");

var _exception_list_client = require("./services/exception_lists/exception_list_client.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupMock = () => {
  const mock = {
    getExceptionListClient: jest.fn().mockReturnValue((0, _exception_list_client.getExceptionListClientMock)()),
    getListClient: jest.fn().mockReturnValue((0, _list_client.getListClientMock)())
  };
  return mock;
};

const listMock = {
  createSetup: createSetupMock,
  getExceptionListClient: _exception_list_client.getExceptionListClientMock,
  getListClient: _list_client.getListClientMock
};
exports.listMock = listMock;