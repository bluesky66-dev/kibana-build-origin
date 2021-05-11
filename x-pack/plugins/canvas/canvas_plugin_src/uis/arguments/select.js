"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = void 0;

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
  Select: strings
} = _i18n.ArgumentStrings;

const SelectArgInput = ({
  typeInstance,
  onValueChange,
  argValue,
  argId
}) => {
  const choices = typeInstance.options.choices.map(({
    value,
    name
  }) => ({
    value,
    text: name
  }));

  const handleChange = ev => {
    // Get the value from the choices passed in since it could be a number or
    // boolean, but ev.target.value is always a string
    const {
      value
    } = choices[ev.target.selectedIndex];
    return onValueChange(value);
  };

  return /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    id: argId,
    value: argValue,
    options: choices,
    onChange: handleChange
  });
};

SelectArgInput.propTypes = {
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]).isRequired,
  typeInstance: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    options: _propTypes.default.shape({
      choices: _propTypes.default.arrayOf(_propTypes.default.shape({
        name: _propTypes.default.string.isRequired,
        value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]).isRequired
      })).isRequired
    })
  }),
  argId: _propTypes.default.string.isRequired
};

const select = () => ({
  name: 'select',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(SelectArgInput)
});

exports.select = select;