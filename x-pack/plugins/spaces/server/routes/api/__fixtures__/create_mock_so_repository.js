"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockSavedObjectsRepository = void 0;

var _server = require("src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMockSavedObjectsRepository = (spaces = []) => {
  const mockSavedObjectsClientContract = {
    get: jest.fn((type, id) => {
      const result = spaces.filter(s => s.id === id);

      if (!result.length) {
        throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
      }

      return result[0];
    }),
    find: jest.fn(() => {
      return {
        total: spaces.length,
        saved_objects: spaces
      };
    }),
    create: jest.fn((type, attributes, {
      id
    }) => {
      if (spaces.find(s => s.id === id)) {
        throw _server.SavedObjectsErrorHelpers.decorateConflictError(new Error(), 'space conflict');
      }

      return {};
    }),
    update: jest.fn((type, id) => {
      if (!spaces.find(s => s.id === id)) {
        throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
      }

      return {};
    }),
    delete: jest.fn((type, id) => {
      return {};
    }),
    deleteByNamespace: jest.fn()
  };
  return mockSavedObjectsClientContract;
};

exports.createMockSavedObjectsRepository = createMockSavedObjectsRepository;