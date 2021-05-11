"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRouteHandlerContext = createRouteHandlerContext;
exports.createMockMetadataRequestContext = exports.createMockFleetStartContract = exports.createMockPackageService = exports.createMockEndpointAppContextServiceStartContract = exports.createMockEndpointAppContextService = exports.createMockEndpointAppContext = void 0;

var _mocks = require("src/core/server/mocks");

var _mocks2 = require("../../../lists/server/mocks");

var _mocks3 = require("../../../security/server/mocks");

var _mocks4 = require("../../../alerts/server/mocks");

var _mocks5 = require("../../../../mocks");

var _mocks6 = require("../../../fleet/server/mocks");

var _client = require("../client");

var _mocks__ = require("../lib/detection_engine/routes/__mocks__");

var _manifest_manager = require("./services/artifacts/manifest_manager/manifest_manager.mock");

var _license = require("../../common/license/license");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// import { licenseMock } from '../../../licensing/common/licensing.mock';

/**
 * Creates a mocked EndpointAppContext.
 */


const createMockEndpointAppContext = mockManifestManager => {
  return {
    logFactory: _mocks.loggingSystemMock.create(),
    config: () => Promise.resolve((0, _mocks__.createMockConfig)()),
    service: createMockEndpointAppContextService(mockManifestManager)
  };
};
/**
 * Creates a mocked EndpointAppContextService
 */


exports.createMockEndpointAppContext = createMockEndpointAppContext;

const createMockEndpointAppContextService = mockManifestManager => {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    getAgentService: jest.fn(),
    getAgentPolicyService: jest.fn(),
    getManifestManager: jest.fn().mockReturnValue(mockManifestManager !== null && mockManifestManager !== void 0 ? mockManifestManager : jest.fn()),
    getScopedSavedObjectsClient: jest.fn()
  };
};
/**
 * Creates a mocked input contract for the `EndpointAppContextService#start()` method
 */


exports.createMockEndpointAppContextService = createMockEndpointAppContextService;

const createMockEndpointAppContextServiceStartContract = () => {
  const factory = new _client.AppClientFactory();
  const config = (0, _mocks__.createMockConfig)();
  factory.setup({
    getSpaceId: () => 'mockSpace',
    config
  });
  return {
    agentService: (0, _mocks6.createMockAgentService)(),
    packageService: createMockPackageService(),
    logger: _mocks.loggingSystemMock.create().get('mock_endpoint_app_context'),
    savedObjectsStart: _mocks.savedObjectsServiceMock.createStartContract(),
    manifestManager: (0, _manifest_manager.getManifestManagerMock)(),
    appClientFactory: factory,
    security: _mocks3.securityMock.createSetup(),
    alerts: _mocks4.alertsMock.createStart(),
    config,
    licenseService: new _license.LicenseService(),
    registerIngestCallback: jest.fn(),
    exceptionListsClient: _mocks2.listMock.getExceptionListClient()
  };
};
/**
 * Create mock PackageService
 */


exports.createMockEndpointAppContextServiceStartContract = createMockEndpointAppContextServiceStartContract;

const createMockPackageService = () => {
  return {
    getInstalledEsAssetReferences: jest.fn()
  };
};
/**
 * Creates a mock IndexPatternService for use in tests that need to interact with the Fleet's
 * ESIndexPatternService.
 *
 * @param indexPattern a string index pattern to return when called by a test
 * @returns the same value as `indexPattern` parameter
 */


exports.createMockPackageService = createMockPackageService;

const createMockFleetStartContract = indexPattern => {
  return {
    esIndexPatternService: {
      getESIndexPattern: jest.fn().mockResolvedValue(indexPattern)
    },
    agentService: (0, _mocks6.createMockAgentService)(),
    packageService: createMockPackageService(),
    agentPolicyService: (0, _mocks6.createMockAgentPolicyService)(),
    registerExternalCallback: jest.fn((...args) => {}),
    packagePolicyService: (0, _mocks6.createPackagePolicyServiceMock)()
  };
};

exports.createMockFleetStartContract = createMockFleetStartContract;

const createMockMetadataRequestContext = () => {
  return {
    endpointAppContextService: createMockEndpointAppContextService(),
    logger: _mocks.loggingSystemMock.create().get('mock_endpoint_app_context'),
    requestHandlerContext: _mocks5.xpackMocks.createRequestHandlerContext()
  };
};

exports.createMockMetadataRequestContext = createMockMetadataRequestContext;

function createRouteHandlerContext(dataClient, savedObjectsClient) {
  const context = _mocks5.xpackMocks.createRequestHandlerContext();

  context.core.elasticsearch.legacy.client = dataClient;
  context.core.savedObjects.client = savedObjectsClient;
  return context;
}