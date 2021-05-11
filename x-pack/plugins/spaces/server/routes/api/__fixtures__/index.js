"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "createSpaces", {
  enumerable: true,
  get: function () {
    return _create_spaces.createSpaces;
  }
});
Object.defineProperty(exports, "createMockSavedObjectsRepository", {
  enumerable: true,
  get: function () {
    return _create_mock_so_repository.createMockSavedObjectsRepository;
  }
});
Object.defineProperty(exports, "createMockSavedObjectsService", {
  enumerable: true,
  get: function () {
    return _create_mock_so_service.createMockSavedObjectsService;
  }
});
Object.defineProperty(exports, "mockRouteContext", {
  enumerable: true,
  get: function () {
    return _route_contexts.mockRouteContext;
  }
});
Object.defineProperty(exports, "mockRouteContextWithInvalidLicense", {
  enumerable: true,
  get: function () {
    return _route_contexts.mockRouteContextWithInvalidLicense;
  }
});
Object.defineProperty(exports, "createExportSavedObjectsToStreamMock", {
  enumerable: true,
  get: function () {
    return _create_copy_to_space_mocks.createExportSavedObjectsToStreamMock;
  }
});
Object.defineProperty(exports, "createImportSavedObjectsFromStreamMock", {
  enumerable: true,
  get: function () {
    return _create_copy_to_space_mocks.createImportSavedObjectsFromStreamMock;
  }
});
Object.defineProperty(exports, "createResolveSavedObjectsImportErrorsMock", {
  enumerable: true,
  get: function () {
    return _create_copy_to_space_mocks.createResolveSavedObjectsImportErrorsMock;
  }
});

var _create_spaces = require("./create_spaces");

var _create_mock_so_repository = require("./create_mock_so_repository");

var _create_mock_so_service = require("./create_mock_so_service");

var _route_contexts = require("./route_contexts");

var _create_copy_to_space_mocks = require("./create_copy_to_space_mocks");