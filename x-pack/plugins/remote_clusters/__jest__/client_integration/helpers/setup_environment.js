"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupEnvironment = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _mocks = require("../../../../../../src/core/public/mocks");

var _mocks2 = require("../../../../../../src/plugins/usage_collection/public/mocks");

var _breadcrumb = require("../../../public/application/services/breadcrumb");

var _http = require("../../../public/application/services/http");

var _notification = require("../../../public/application/services/notification");

var _ui_metric = require("../../../public/application/services/ui_metric");

var _documentation = require("../../../public/application/services/documentation");

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


const setupEnvironment = () => {
  // axios has a similar interface to HttpSetup, but we
  // flatten out the response.
  const mockHttpClient = _axios.default.create({
    adapter: _xhr.default
  });

  mockHttpClient.interceptors.response.use(({
    data
  }) => data);
  (0, _breadcrumb.init)(() => {});
  (0, _documentation.init)(_mocks.docLinksServiceMock.createStartContract());
  (0, _ui_metric.init)(_mocks2.usageCollectionPluginMock.createSetupContract());
  (0, _notification.init)(_mocks.notificationServiceMock.createSetupContract().toasts, _mocks.fatalErrorsServiceMock.createSetupContract());
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