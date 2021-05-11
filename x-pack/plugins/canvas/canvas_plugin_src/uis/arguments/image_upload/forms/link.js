"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LinkForm = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _i18n = require("../../../../../i18n");

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
  ImageUpload: strings
} = _i18n.ArgumentStrings;

const LinkForm = ({
  url,
  inputRef,
  onSubmit
}) => /*#__PURE__*/_react.default.createElement(_eui.EuiFormRow, {
  display: "rowCompressed",
  onSubmit: onSubmit,
  className: "eui-textRight"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "xs"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement(_eui.EuiFieldText, {
  compressed: true,
  defaultValue: url,
  inputRef: inputRef,
  placeholder: strings.getUrlFieldPlaceholder(),
  "aria-label": strings.getUrlFieldPlaceholder()
})), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
  grow: false
}, /*#__PURE__*/_react.default.createElement(_eui.EuiButton, {
  type: "submit",
  size: "s",
  onClick: onSubmit
}, "Set"))));

exports.LinkForm = LinkForm;
LinkForm.propTypes = {
  url: _propTypes.default.string,
  inputRef: _propTypes.default.func,
  onSubmit: _propTypes.default.func
};