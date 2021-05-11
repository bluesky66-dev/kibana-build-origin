"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEnvironment = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _http = require("../../../public/application/services/http");

var _http_requests = require("./http_requests");

var _ui_metric = require("../../../public/application/services/ui_metric");

var _notification = require("../../../public/application/services/notification");

var _mocks = require("../../../../../../src/plugins/usage_collection/public/mocks");

var _mocks2 = require("../../../../../../src/core/public/mocks");

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

const setupEnvironment = () => {
  (0, _ui_metric.init)(_mocks.usageCollectionPluginMock.createSetupContract());
  (0, _notification.init)(_mocks2.notificationServiceMock.createSetupContract().toasts, _mocks2.fatalErrorsServiceMock.createSetupContract());
  mockHttpClient.interceptors.response.use(({
    data
  }) => data); // This expects HttpSetup but we're giving it AxiosInstance.
  // @ts-ignore

  (0, _http.init)(mockHttpClient);
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