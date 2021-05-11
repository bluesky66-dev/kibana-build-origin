"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setGlobalDate = setGlobalDate;
exports.getBeforeSetup = getBeforeSetup;
exports.mockedDateString = void 0;

var _mocks = require("../../../../actions/server/mocks");

var _mocks2 = require("../../../../event_log/server/mocks");

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mockedDateString = '2019-02-12T21:01:22.479Z';
exports.mockedDateString = mockedDateString;

function setGlobalDate() {
  const mockedDate = new Date(mockedDateString);
  const DateOriginal = Date; // A version of date that responds to `new Date(null|undefined)` and `Date.now()`
  // by returning a fixed date, otherwise should be same as Date.

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */

  global.Date = class Date {
    constructor(...args) {
      // sometimes the ctor has no args, sometimes has a single `null` arg
      if (args[0] == null) {
        // @ts-ignore
        return mockedDate;
      } else {
        // @ts-ignore
        return new DateOriginal(...args);
      }
    }

    static now() {
      return mockedDate.getTime();
    }

    static parse(string) {
      return DateOriginal.parse(string);
    }

  };
}

function getBeforeSetup(alertsClientParams, taskManager, alertTypeRegistry, eventLogClient) {
  jest.resetAllMocks();
  alertsClientParams.createAPIKey.mockResolvedValue({
    apiKeysEnabled: false
  });
  alertsClientParams.getUserName.mockResolvedValue('elastic');
  taskManager.runNow.mockResolvedValue({
    id: ''
  });

  const actionsClient = _mocks.actionsClientMock.create();

  actionsClient.getBulk.mockResolvedValueOnce([{
    id: '1',
    isPreconfigured: false,
    actionTypeId: 'test',
    name: 'test',
    config: {
      foo: 'bar'
    }
  }, {
    id: '2',
    isPreconfigured: false,
    actionTypeId: 'test2',
    name: 'test2',
    config: {
      foo: 'bar'
    }
  }, {
    id: 'testPreconfigured',
    actionTypeId: '.slack',
    isPreconfigured: true,
    name: 'test'
  }]);
  alertsClientParams.getActionsClient.mockResolvedValue(actionsClient);
  alertTypeRegistry.get.mockImplementation(() => ({
    id: '123',
    name: 'Test',
    actionGroups: [{
      id: 'default',
      name: 'Default'
    }],
    recoveryActionGroup: _common.RecoveredActionGroup,
    defaultActionGroupId: 'default',
    minimumLicenseRequired: 'basic',

    async executor() {},

    producer: 'alerts'
  }));
  alertsClientParams.getEventLogClient.mockResolvedValue(eventLogClient !== null && eventLogClient !== void 0 ? eventLogClient : _mocks2.eventLogClientMock.create());
}