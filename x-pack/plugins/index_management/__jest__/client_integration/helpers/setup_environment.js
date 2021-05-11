"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithAppDependencies = exports.setupEnvironment = exports.services = void 0;

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _lodash = require("lodash");

var _mocks = require("../../../../../../src/core/public/mocks");

var _public = require("../../../../../../src/plugins/es_ui_shared/public");

var _app_context = require("../../../public/application/app_context");

var _http = require("../../../public/application/services/http");

var _breadcrumbs = require("../../../public/application/services/breadcrumbs");

var _documentation = require("../../../public/application/services/documentation");

var _notification = require("../../../public/application/services/notification");

var _services = require("../../../public/services");

var _ui_metric = require("../../../public/application/services/ui_metric");

var _api = require("../../../public/application/services/api");

var _extension_service = require("../../../public/application/store/selectors/extension_service");

var _components = require("../../../public/application/components");

var _jest__ = require("../../../public/application/components/component_templates/__jest__");

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

const {
  GlobalFlyoutProvider
} = _public.GlobalFlyout;
const services = {
  extensionsService: new _services.ExtensionsService(),
  uiMetricService: new _ui_metric.UiMetricService('index_management')
};
exports.services = services;
services.uiMetricService.setup({
  reportUiCounter() {}

});
(0, _extension_service.setExtensionsService)(services.extensionsService);
(0, _api.setUiMetricService)(services.uiMetricService);
const appDependencies = {
  services,
  core: {
    getUrlForApp: () => {}
  },
  plugins: {}
};

const setupEnvironment = () => {
  // Mock initialization of services
  // @ts-ignore
  _http.httpService.setup(mockHttpClient);

  _breadcrumbs.breadcrumbService.setup(() => undefined);

  _documentation.documentationService.setup(_mocks.docLinksServiceMock.createStartContract());

  _notification.notificationService.setup(_mocks.notificationServiceMock.createSetupContract());

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

const WithAppDependencies = (Comp, overridingDependencies = {}) => props => {
  const mergedDependencies = (0, _lodash.merge)({}, appDependencies, overridingDependencies);
  return /*#__PURE__*/_react.default.createElement(_app_context.AppContextProvider, {
    value: mergedDependencies
  }, /*#__PURE__*/_react.default.createElement(_components.MappingsEditorProvider, null, /*#__PURE__*/_react.default.createElement(_components.ComponentTemplatesProvider, {
    value: _jest__.componentTemplatesMockDependencies
  }, /*#__PURE__*/_react.default.createElement(GlobalFlyoutProvider, null, /*#__PURE__*/_react.default.createElement(Comp, props)))));
};

exports.WithAppDependencies = WithAppDependencies;