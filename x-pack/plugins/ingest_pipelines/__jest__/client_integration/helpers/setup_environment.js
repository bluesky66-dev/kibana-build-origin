"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithAppDependencies = exports.setupEnvironment = void 0;

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _public = require("../../../../../../src/plugins/kibana_react/public");

var _mocks = require("../../../../../../src/core/public/mocks");

var _mocks2 = require("../../../../../../src/plugins/usage_collection/public/mocks");

var _services = require("../../../public/application/services");

var _http_requests = require("./http_requests");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const mockHttpClient = _axios.default.create({
  adapter: _xhr.default
});

const history = _mocks.scopedHistoryMock.create();

history.createHref.mockImplementation(location => {
  return `${location.pathname}?${location.search}`;
});
const appServices = {
  breadcrumbs: _services.breadcrumbService,
  metric: _services.uiMetricService,
  documentation: _services.documentationService,
  api: _services.apiService,
  notifications: _mocks.notificationServiceMock.createSetupContract(),
  history,
  urlGenerators: {
    getUrlGenerator: jest.fn().mockReturnValue({
      createUrl: jest.fn()
    })
  }
};

const setupEnvironment = () => {
  _services.uiMetricService.setup(_mocks2.usageCollectionPluginMock.createSetupContract());

  _services.apiService.setup(mockHttpClient, _services.uiMetricService);

  _services.documentationService.setup(_mocks.docLinksServiceMock.createStartContract());

  _services.breadcrumbService.setup(() => {});

  const {
    server,
    httpRequestsMockHelpers
  } = (0, _http_requests.init)();
  return {
    server,
    httpRequestsMockHelpers
  };
};

exports.setupEnvironment = setupEnvironment;

const WithAppDependencies = Comp => props => /*#__PURE__*/_react.default.createElement(_public.KibanaContextProvider, {
  services: appServices
}, /*#__PURE__*/_react.default.createElement(Comp, props));

exports.WithAppDependencies = WithAppDependencies;