"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleTemplate = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

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


const SimpleTemplate = ({
  onValueChange,
  argValue
}) => {
  return /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    compressed: true,
    checked: Boolean(argValue),
    onChange: () => onValueChange(!Boolean(argValue)),
    showLabel: false,
    label: ""
  });
};

exports.SimpleTemplate = SimpleTemplate;
SimpleTemplate.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.object]).isRequired
};
SimpleTemplate.displayName = 'AxisConfigSimpleInput';