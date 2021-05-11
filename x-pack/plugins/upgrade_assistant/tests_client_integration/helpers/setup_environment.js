"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithAppDependencies = void 0;

var _react = _interopRequireDefault(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _mocks = require("../../../../../src/core/public/mocks");

var _constants = require("../../common/constants");

var _app_context = require("../../public/application/app_context");

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


const mockHttpClient = _axios.default.create();

const contextValue = {
  http: mockHttpClient,
  isCloudEnabled: false,
  docLinks: _mocks.docLinksServiceMock.createStartContract(),
  kibanaVersionInfo: {
    currentMajor: _constants.mockKibanaSemverVersion.major,
    prevMajor: _constants.mockKibanaSemverVersion.major - 1,
    nextMajor: _constants.mockKibanaSemverVersion.major + 1
  },
  isReadOnlyMode: _constants.UA_READONLY_MODE
};

const WithAppDependencies = (Comp, overrides = {}) => props => {
  return /*#__PURE__*/_react.default.createElement(_app_context.AppContextProvider, {
    value: { ...contextValue,
      ...overrides
    }
  }, /*#__PURE__*/_react.default.createElement(Comp, props));
};

exports.WithAppDependencies = WithAppDependencies;