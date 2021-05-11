"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.demodata = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _i18n = require("../../../i18n");

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


const {
  DemoData: strings
} = _i18n.DataSourceStrings;

const DemodataDatasource = () => /*#__PURE__*/_react.default.createElement(_eui.EuiCallOut, {
  title: strings.getHeading(),
  iconType: "iInCircle"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiText, {
  size: "s"
}, /*#__PURE__*/_react.default.createElement("p", null, strings.getDescription())));

const demodata = () => ({
  name: 'demodata',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  image: 'training',
  template: (0, _template_from_react_component.templateFromReactComponent)(DemodataDatasource)
});

exports.demodata = demodata;