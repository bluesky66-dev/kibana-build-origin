"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.percentage = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

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
  Percentage: strings
} = _i18n.ArgumentStrings;

const PercentageArgInput = ({
  onValueChange,
  argValue
}) => {
  const handleChange = ev => {
    return onValueChange(ev.target.value / 100);
  };

  return /*#__PURE__*/_react.default.createElement(_eui.EuiRange, {
    compressed: true,
    min: 0,
    max: 100,
    showLabels: true,
    showInput: true,
    value: argValue * 100,
    onChange: handleChange
  });
};

PercentageArgInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]).isRequired,
  argId: _propTypes.default.string.isRequired
};

const percentage = () => ({
  name: 'percentage',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(PercentageArgInput)
});

exports.percentage = percentage;