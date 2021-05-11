"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sessionStorageMock = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createSessionStorageMock = () => ({
  get: jest.fn().mockResolvedValue({}),
  set: jest.fn(),
  clear: jest.fn()
});

const creatSessionStorageFactoryMock = () => {
  const mocked = {
    asScoped: jest.fn()
  };
  mocked.asScoped.mockImplementation(createSessionStorageMock);
  return mocked;
};

const sessionStorageMock = {
  create: createSessionStorageMock,
  createFactory: creatSessionStorageFactoryMock
};
exports.sessionStorageMock = sessionStorageMock;