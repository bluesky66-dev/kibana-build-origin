"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.range = void 0;

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
  Range: strings
} = _i18n.ArgumentStrings;

const RangeArgInput = ({
  typeInstance,
  onValueChange,
  argValue
}) => {
  const {
    min,
    max,
    step
  } = typeInstance.options;

  const handleChange = ev => {
    return onValueChange(Number(ev.target.value));
  };

  return /*#__PURE__*/_react.default.createElement(_eui.EuiRange, {
    compressed: true,
    min: min,
    max: max,
    step: step,
    showLabels: true,
    showInput: true,
    value: argValue,
    onChange: handleChange
  });
};

RangeArgInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  typeInstance: _propTypes.default.shape({
    options: _propTypes.default.shape({
      min: _propTypes.default.number.isRequired,
      max: _propTypes.default.number.isRequired,
      step: _propTypes.default.number
    }).isRequired
  }),
  argId: _propTypes.default.string.isRequired
};

const range = () => ({
  name: 'range',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(RangeArgInput)
});

exports.range = range;