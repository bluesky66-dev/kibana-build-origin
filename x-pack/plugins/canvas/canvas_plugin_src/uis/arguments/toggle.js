"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toggle = void 0;

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
  Toggle: strings
} = _i18n.ArgumentStrings;

const ToggleArgInput = ({
  onValueChange,
  argValue,
  argId,
  renderError,
  typeInstance
}) => {
  const handleChange = () => onValueChange(!argValue);

  if (typeof argValue !== 'boolean') {
    renderError();
    return null;
  }

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
    compressed: true,
    id: argId,
    checked: argValue,
    onChange: handleChange,
    className: "canvasArg__form",
    "aria-label": typeInstance.displayName,
    resize: "none",
    label: typeInstance.options.labelValue,
    showLabel: true
  })));
};

ToggleArgInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.bool, _propTypes.default.string, _propTypes.default.object]).isRequired,
  argId: _propTypes.default.string.isRequired,
  typeInstance: _propTypes.default.shape({
    displayName: _propTypes.default.string.isRequired,
    options: _propTypes.default.shape({
      labelValue: _propTypes.default.string.isRequired
    })
  }).isRequired,
  renderError: _propTypes.default.func.isRequired
};

const toggle = () => ({
  name: 'toggle',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  template: (0, _template_from_react_component.templateFromReactComponent)(ToggleArgInput),
  default: 'false'
});

exports.toggle = toggle;