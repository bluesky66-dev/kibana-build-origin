"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textarea = void 0;

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
  Textarea: strings
} = _i18n.ArgumentStrings;

const TextAreaArgInput = ({
  updateValue,
  value,
  confirm,
  commit,
  renderError,
  argId
}) => {
  if (typeof value !== 'string') {
    renderError();
    return null;
  }

  return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
    display: "rowCompressed"
  }, /*#__PURE__*/_react.default.createElement(_eui.EuiTextArea, {
    className: "canvasTextArea__code",
    id: argId,
    compressed: true,
    rows: 10,
    value: value,
    resize: "none",
    onChange: confirm ? updateValue : ev => commit(ev.target.value)
  })), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "s"
  }), /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
    size: "s",
    onClick: () => commit(value)
  }, confirm), /*#__PURE__*/_react.default.createElement(_eui.EuiSpacer, {
    size: "xs"
  }));
};

TextAreaArgInput.propTypes = {
  updateValue: _propTypes.default.func.isRequired,
  value: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.object]).isRequired,
  confirm: _propTypes.default.string,
  commit: _propTypes.default.func.isRequired,
  renderError: _propTypes.default.func,
  argId: _propTypes.default.string.isRequired
};
const EnhancedTextAreaArgInput = (0, _recompose.compose)((0, _recompose.withProps)(({
  onValueChange,
  typeInstance,
  argValue
}) => ({
  confirm: (0, _lodash.get)(typeInstance, 'options.confirm'),
  commit: onValueChange,
  value: argValue
})), (0, _stateful_prop.createStatefulPropHoc)('value'))(TextAreaArgInput);
EnhancedTextAreaArgInput.propTypes = {
  argValue: _propTypes.default.any.isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  typeInstance: _propTypes.default.object.isRequired,
  renderError: _propTypes.default.func.isRequired
};

const textarea = () => ({
  name: 'textarea',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  template: (0, _template_from_react_component.templateFromReactComponent)(EnhancedTextAreaArgInput)
});

exports.textarea = textarea;