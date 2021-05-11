"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockAgentService = exports.createMockAgentPolicyService = exports.createPackagePolicyServiceMock = exports.xpackMocks = exports.createAppContextStartContractMock = void 0;

var _mocks = require("src/core/server/mocks");

var _mocks2 = require("../../../../src/core/server/mocks");

var _mocks3 = require("../../../plugins/licensing/server/mocks");

var _mocks4 = require("../../encrypted_saved_objects/server/mocks");

var _mocks5 = require("../../security/server/mocks");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createAppContextStartContractMock = () => {
  return {
    elasticsearch: _mocks.elasticsearchServiceMock.createStart(),
    encryptedSavedObjectsStart: _mocks4.encryptedSavedObjectsMock.createStart(),
    savedObjects: _mocks.savedObjectsServiceMock.createStartContract(),
    security: _mocks5.securityMock.createStart(),
    logger: _mocks.loggingSystemMock.create().get(),
    isProductionMode: true,
    kibanaVersion: '8.0.0',
    kibanaBranch: 'master'
  };
};

exports.createAppContextStartContractMock = createAppContextStartContractMock;

function createCoreRequestHandlerContextMock() {
  return {
    core: _mocks2.coreMock.createRequestHandlerContext(),
    licensing: _mocks3.licensingMock.createRequestHandlerContext()
  };
}

const xpackMocks = {
  createRequestHandlerContext: createCoreRequestHandlerContextMock
};
exports.xpackMocks = xpackMocks;

const createPackagePolicyServiceMock = () => {
  return {
    compilePackagePolicyInputs: jest.fn(),
    buildPackagePolicyFromPackage: jest.fn(),
    bulkCreate: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    get: jest.fn(),
    getByIDs: jest.fn(),
    list: jest.fn(),
    listIds: jest.fn(),
    update: jest.fn(),
    runExternalCallbacks: jest.fn()
  };
};
/**
 * Create mock AgentPolicyService
 */


exports.createPackagePolicyServiceMock = createPackagePolicyServiceMock;

const createMockAgentPolicyService = () => {
  return {
    get: jest.fn(),
    list: jest.fn(),
    getDefaultAgentPolicyId: jest.fn(),
    getFullAgentPolicy: jest.fn()
  };
};
/**
 * Creates a mock AgentService
 */


exports.createMockAgentPolicyService = createMockAgentPolicyService;

const createMockAgentService = () => {
  return {
    getAgentStatusById: jest.fn(),
    authenticateAgentWithAccessToken: jest.fn(),
    getAgent: jest.fn(),
    listAgents: jest.fn()
  };
};

exports.createMockAgentService = createMockAgentService;