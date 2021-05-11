"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shape = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _template_from_react_component = require("../../../public/lib/template_from_react_component");

var _shape_picker_popover = require("../../../public/components/shape_picker_popover/");

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
  Shape: strings
} = _i18n.ArgumentStrings;

const ShapeArgInput = ({
  onValueChange,
  argValue,
  typeInstance
}) => /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "s"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
  grow: false
}, /*#__PURE__*/_react.default.createElement(_shape_picker_popover.ShapePickerPopover, {
  value: argValue,
  onChange: onValueChange,
  shapes: typeInstance.options.shapes,
  ariaLabel: typeInstance.displayName
})));

ShapeArgInput.propTypes = {
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.shape({
    options: _propTypes.default.shape({
      shapes: _propTypes.default.object.isRequired
    }).isRequired
  }).isRequired
};

const shape = () => ({
  name: 'shape',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(ShapeArgInput),
  default: '"square"'
});

exports.shape = shape;