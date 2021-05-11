"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getComponent = exports.createMockLicense = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactRedux = require("react-redux");

var _jest = require("@kbn/test/jest");

var _mocks = require("../../../../../src/core/public/mocks");

var _store = require("../../public/application/store/store");

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

/* eslint-disable @kbn/eslint/no-restricted-paths */


const highExpirationMillis = new Date('October 13, 2099 00:00:00Z').getTime();

const history = _mocks.scopedHistoryMock.create();

history.createHref.mockImplementation(location => {
  return `${location.pathname}${location.search ? '?' + location.search : ''}`;
});
const appDependencies = {
  docLinks: {},
  services: {
    history
  }
};

const createMockLicense = (type, expiryDateInMillis = highExpirationMillis) => {
  return {
    type,
    expiryDateInMillis,
    isActive: new Date().getTime() < expiryDateInMillis
  };
};

exports.createMockLicense = createMockLicense;

const getComponent = (initialState, Component) => {
  const services = {
    http: _mocks.httpServiceMock.createSetupContract(),
    history
  };
  const store = (0, _store.licenseManagementStore)(initialState, services);
  return (0, _jest.mountWithIntl)( /*#__PURE__*/_react.default.createElement(_app_context.AppContextProvider, {
    value: appDependencies
  }, /*#__PURE__*/_react.default.createElement(_reactRedux.Provider, {
    store: store
  }, /*#__PURE__*/_react.default.createElement(Component, null))));
};

exports.getComponent = getComponent;