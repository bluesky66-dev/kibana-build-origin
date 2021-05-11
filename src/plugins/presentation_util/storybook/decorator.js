"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.servicesContextDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@kbn/i18n/react");

var _services = require("../public/services");

var _storybook = require("../public/services/storybook");

var _create = require("../public/services/create");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const servicesContextDecorator = (story, storybook) => {
  const registry = new _create.PluginServiceRegistry(_storybook.providers);

  _services.pluginServices.setRegistry(registry.start(storybook.args));

  const ContextProvider = _services.pluginServices.getContextProvider();

  return /*#__PURE__*/_react.default.createElement(_react2.I18nProvider, null, /*#__PURE__*/_react.default.createElement(ContextProvider, null, story()));
};

exports.servicesContextDecorator = servicesContextDecorator;