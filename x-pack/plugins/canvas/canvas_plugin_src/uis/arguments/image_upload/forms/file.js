"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileForm = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _loading = require("../../../../../public/components/loading/loading");

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

const FileForm = ({
  loading,
  onChange
}) => loading ? /*#__PURE__*/_react.default.createElement(_loading.Loading, {
  animated: true,
  text: strings.getImageUploading()
}) : /*#__PURE__*/_react.default.createElement(_eui.EuiFilePicker, {
  initialPromptText: strings.getFileUploadPrompt(),
  onChange: onChange,
  compressed: true,
  display: "default",
  className: "canvasImageUpload",
  accept: "image/*"
});

exports.FileForm = FileForm;
FileForm.propTypes = {
  loading: _propTypes.default.bool,
  onUpload: _propTypes.default.func
};