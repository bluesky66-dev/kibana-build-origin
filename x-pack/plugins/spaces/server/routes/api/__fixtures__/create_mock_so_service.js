"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockSavedObjectsService = void 0;

var _server = require("src/core/server");

var _mocks = require("../../../../../../../src/core/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createMockSavedObjectsService = (spaces = []) => {
  const typeRegistry = _mocks.savedObjectsTypeRegistryMock.create();

  const savedObjectsClient = _mocks.savedObjectsClientMock.create();

  const savedObjectsExporter = _mocks.savedObjectsServiceMock.createExporter();

  const savedObjectsImporter = _mocks.savedObjectsServiceMock.createImporter();

  savedObjectsClient.get.mockImplementation((type, id) => {
    const result = spaces.filter(s => s.id === id);

    if (!result.length) {
      throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
    }

    return Promise.resolve(result[0]);
  });
  savedObjectsClient.find.mockResolvedValue({
    page: 1,
    per_page: 20,
    total: spaces.length,
    saved_objects: spaces
  });
  savedObjectsClient.create.mockImplementation((_type, _attributes, options) => {
    if (spaces.find(s => s.id === (options === null || options === void 0 ? void 0 : options.id))) {
      throw _server.SavedObjectsErrorHelpers.decorateConflictError(new Error(), 'space conflict');
    }

    return Promise.resolve({});
  });
  savedObjectsClient.update.mockImplementation((type, id, _attributes, _options) => {
    if (!spaces.find(s => s.id === id)) {
      throw _server.SavedObjectsErrorHelpers.createGenericNotFoundError(type, id);
    }

    return Promise.resolve({});
  });

  const {
    savedObjects
  } = _mocks.coreMock.createStart();

  savedObjects.getTypeRegistry.mockReturnValue(typeRegistry);
  savedObjects.getScopedClient.mockReturnValue(savedObjectsClient);
  savedObjects.createExporter.mockReturnValue(savedObjectsExporter);
  savedObjects.createImporter.mockReturnValue(savedObjectsImporter);
  return {
    savedObjects,
    typeRegistry,
    savedObjectsClient,
    savedObjectsExporter,
    savedObjectsImporter
  };
};

exports.createMockSavedObjectsService = createMockSavedObjectsService;