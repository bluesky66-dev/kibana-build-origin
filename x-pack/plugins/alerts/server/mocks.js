"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "alertsClientMock", {
  enumerable: true,
  get: function () {
    return _alerts_client.alertsClientMock;
  }
});
exports.alertsMock = void 0;

var _alerts_client = require("./alerts_client.mock");

var _mocks = require("../../../../src/core/server/mocks");
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
    listTypes: jest.fn(),
    getAlertsClientWithRequest: jest.fn().mockResolvedValue(_alerts_client.alertsClientMock.create()),
    getFrameworkHealth: jest.fn()
  };
  return mock;
};

const createAlertInstanceFactoryMock = () => {
  const mock = {
    hasScheduledActions: jest.fn(),
    isThrottled: jest.fn(),
    getScheduledActionOptions: jest.fn(),
    unscheduleActions: jest.fn(),
    getState: jest.fn(),
    scheduleActions: jest.fn(),
    replaceState: jest.fn(),
    updateLastScheduledActions: jest.fn(),
    toJSON: jest.fn(),
    toRaw: jest.fn()
  }; // support chaining

  mock.replaceState.mockReturnValue(mock);
  mock.unscheduleActions.mockReturnValue(mock);
  mock.scheduleActions.mockReturnValue(mock);
  return mock;
};

const createAlertServicesMock = () => {
  const alertInstanceFactoryMock = createAlertInstanceFactoryMock();
  return {
    alertInstanceFactory: jest.fn().mockReturnValue(alertInstanceFactoryMock),
    callCluster: _mocks.elasticsearchServiceMock.createLegacyScopedClusterClient().callAsCurrentUser,
    getLegacyScopedClusterClient: jest.fn(),
    savedObjectsClient: _mocks.savedObjectsClientMock.create(),
    scopedClusterClient: _mocks.elasticsearchServiceMock.createScopedClusterClient().asCurrentUser
  };
};

const alertsMock = {
  createAlertInstanceFactory: createAlertInstanceFactoryMock,
  createSetup: createSetupMock,
  createStart: createStartMock,
  createAlertServices: createAlertServicesMock
};
exports.alertsMock = alertsMock;