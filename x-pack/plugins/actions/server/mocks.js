"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderActionParameterTemplatesDefault = renderActionParameterTemplatesDefault;
Object.defineProperty(exports, "actionsClientMock", {
  enumerable: true,
  get: function () {
    return _actions_client.actionsClientMock;
  }
});
Object.defineProperty(exports, "actionsAuthorizationMock", {
  enumerable: true,
  get: function () {
    return _actions_authorization.actionsAuthorizationMock;
  }
});
exports.actionsMock = void 0;

var _actions_client = require("./actions_client.mock");

var _plugin = require("./plugin");

var _mocks = require("../../../../src/core/server/mocks");

var _actions_authorization = require("./authorization/actions_authorization.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupMock = () => {
  const mock = {
    registerType: jest.fn()
  };
  return mock;
};

const createStartMock = () => {
  const mock = {
    isActionTypeEnabled: jest.fn(),
    isActionExecutable: jest.fn(),
    getActionsClientWithRequest: jest.fn().mockResolvedValue(_actions_client.actionsClientMock.create()),
    getActionsAuthorizationWithRequest: jest.fn().mockReturnValue(_actions_authorization.actionsAuthorizationMock.create()),
    preconfiguredActions: [],
    renderActionParameterTemplates: jest.fn()
  };
  return mock;
}; // this is a default renderer that escapes nothing


function renderActionParameterTemplatesDefault(actionTypeId, params, variables) {
  return (0, _plugin.renderActionParameterTemplates)(undefined, actionTypeId, params, variables);
}

const createServicesMock = () => {
  const mock = {
    callCluster: _mocks.elasticsearchServiceMock.createLegacyScopedClusterClient().callAsCurrentUser,
    getLegacyScopedClusterClient: jest.fn(),
    savedObjectsClient: _mocks.savedObjectsClientMock.create(),
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient().asCurrentUser
  };
  return mock;
};

const actionsMock = {
  createServices: createServicesMock,
  createSetup: createSetupMock,
  createStart: createStartMock
};
exports.actionsMock = actionsMock;