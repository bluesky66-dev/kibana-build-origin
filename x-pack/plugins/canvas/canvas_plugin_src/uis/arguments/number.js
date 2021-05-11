"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.number = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _recompose = require("recompose");

var _eui = require("@elastic/eui");

var _lodash = require("lodash");

var _stateful_prop = require("../../../public/components/enhance/stateful_prop");

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
  Number: strings
} = _i18n.ArgumentStrings; // This is basically a direct copy of the string input, but with some Number() goodness maybe you think that's cheating and it should be
// abstracted. If you can think of a 3rd or 4th usage for that abstraction, cool, do it, just don't make it more confusing. Copying is the
// most understandable way to do this. There, I said it.
// TODO: Support max/min as options

const NumberArgInput = ({
  updateValue,
  value,
  confirm,
  commit,
  argId
}) => /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "s"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldNumber, {
  compressed: true,
  id: argId,
  value: Number(value),
  onChange: confirm ? updateValue : ev => commit(Number(ev.target.value))
})), confirm && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
  grow: false
}, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
  size: "s",
  onClick: () => commit(Number(value))
}, confirm)));

NumberArgInput.propTypes = {
  argId: _propTypes.default.string.isRequired,
  updateValue: _propTypes.default.func.isRequired,
  value: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  confirm: _propTypes.default.string,
  commit: _propTypes.default.func.isRequired
};
const EnhancedNumberArgInput = (0, _recompose.compose)((0, _recompose.withProps)(({
  onValueChange,
  typeInstance,
  argValue
}) => ({
  confirm: (0, _lodash.get)(typeInstance, 'options.confirm'),
  commit: onValueChange,
  value: argValue
})), (0, _stateful_prop.createStatefulPropHoc)('value'))(NumberArgInput);
EnhancedNumberArgInput.propTypes = {
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired
};

const number = () => ({
  name: 'number',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(EnhancedNumberArgInput),
  default: '0'
});

exports.number = number;