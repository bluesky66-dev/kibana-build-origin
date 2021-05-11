"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.licensingMock = void 0;

var _rxjs = require("rxjs");

var _licensing = require("../common/licensing.mock");

var _feature_usage_service = require("./services/feature_usage_service.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createSetupMock = () => {
  const license = _licensing.licenseMock.createLicense();

  const mock = {
    license$: new _rxjs.BehaviorSubject(license),
    refresh: jest.fn(),
    createLicensePoller: jest.fn(),
    featureUsage: _feature_usage_service.featureUsageMock.createSetup()
  };
  mock.refresh.mockResolvedValue(license);
  mock.createLicensePoller.mockReturnValue({
    license$: mock.license$,
    refresh: mock.refresh
  });
  return mock;
};

const createStartMock = () => {
  const license = _licensing.licenseMock.createLicense();

  const mock = {
    license$: new _rxjs.BehaviorSubject(license),
    refresh: jest.fn(),
    createLicensePoller: jest.fn(),
    featureUsage: _feature_usage_service.featureUsageMock.createStart()
  };
  mock.refresh.mockResolvedValue(license);
  mock.createLicensePoller.mockReturnValue({
    license$: mock.license$,
    refresh: mock.refresh
  });
  return mock;
};

const createRequestHandlerContextMock = (...options) => {
  const mock = {
    license: _licensing.licenseMock.createLicense(...options),
    featureUsage: _feature_usage_service.featureUsageMock.createStart()
  };
  return mock;
};

const licensingMock = {
  createSetup: createSetupMock,
  createStart: createStartMock,
  createRequestHandlerContext: createRequestHandlerContextMock,
  ..._licensing.licenseMock
};
exports.licensingMock = licensingMock;