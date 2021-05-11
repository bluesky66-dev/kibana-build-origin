"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.string = void 0;

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
  String: strings
} = _i18n.ArgumentStrings;

const StringArgInput = ({
  updateValue,
  value,
  confirm,
  commit,
  argId
}) => /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "s"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, {
  compressed: true,
  id: argId,
  value: value,
  onChange: confirm ? updateValue : ev => commit(ev.target.value)
})), confirm && /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
  grow: false,
  className: "canvasSidebar__panel-noMinWidth"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
  size: "s",
  onClick: () => commit(value)
}, confirm)));

StringArgInput.propTypes = {
  updateValue: _propTypes.default.func.isRequired,
  value: _propTypes.default.string.isRequired,
  confirm: _propTypes.default.string,
  commit: _propTypes.default.func.isRequired,
  argId: _propTypes.default.string.isRequired
};
const EnhancedStringArgInput = (0, _recompose.compose)((0, _recompose.withProps)(({
  onValueChange,
  typeInstance,
  argValue
}) => ({
  confirm: (0, _lodash.get)(typeInstance, 'options.confirm'),
  commit: onValueChange,
  value: argValue
})), (0, _stateful_prop.createStatefulPropHoc)('value'))(StringArgInput);
EnhancedStringArgInput.propTypes = {
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired
};

const string = () => ({
  name: 'string',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  simpleTemplate: (0, _template_from_react_component.templateFromReactComponent)(EnhancedStringArgInput)
});

exports.string = string;