"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithAppDependencies = exports.setupEnvironment = exports.services = void 0;

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _xhr = _interopRequireDefault(require("axios/lib/adapters/xhr"));

var _i18n = require("@kbn/i18n");

var _mocks = require("src/core/public/mocks");

var _http = require("../../../public/application/services/http");

var _navigation = require("../../../public/application/services/navigation");

var _app_context = require("../../../public/application/app_context");

var _text = require("../../../public/application/services/text");

var _http_requests = require("./http_requests");

var _services = require("../../../public/application/services");

var _documentation = require("../../../public/application/services/documentation");

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
const services = {
  uiMetricService: new _services.UiMetricService('snapshot_restore'),
  httpService: _http.httpService,
  i18n: _i18n.i18n,
  history
};
exports.services = services;
(0, _http.setUiMetricService)(services.uiMetricService);
const appDependencies = {
  core: _mocks.coreMock.createSetup(),
  services,
  config: {
    slm_ui: {
      enabled: true
    }
  },
  plugins: {}
};

const setupEnvironment = () => {
  // @ts-ignore
  _http.httpService.setup(mockHttpClient);

  _navigation.breadcrumbService.setup(() => undefined);

  _text.textService.setup(_i18n.i18n);

  _documentation.documentationLinksService.setup({});

  _navigation.docTitleService.setup(() => undefined);

  const {
    server,
    httpRequestsMockHelpers
  } = (0, _http_requests.init)();
  return {
    server,
    httpRequestsMockHelpers
  };
};
/**
 * Suppress error messages about Worker not being available in JS DOM.
 */


exports.setupEnvironment = setupEnvironment;

window.Worker = function Worker() {
  this.postMessage = () => {};

  this.terminate = () => {};
};

const WithAppDependencies = Comp => props => /*#__PURE__*/_react.default.createElement(_app_context.AppContextProvider, {
  value: appDependencies
}, /*#__PURE__*/_react.default.createElement(Comp, props));

exports.WithAppDependencies = WithAppDependencies;