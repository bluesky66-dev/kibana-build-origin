"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _form_context = require("../form_context");

var _form_data_context = require("../form_data_context");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const Form = ({
  form,
  FormWrapper = _eui.EuiForm,
  ...rest
}) => {
  const {
    getFormData,
    __getFormData$
  } = form;
  return /*#__PURE__*/_react.default.createElement(_form_data_context.FormDataContextProvider, {
    getFormData: getFormData,
    getFormData$: __getFormData$
  }, /*#__PURE__*/_react.default.createElement(_form_context.FormProvider, {
    form: form
  }, /*#__PURE__*/_react.default.createElement(FormWrapper, rest)));
};

exports.Form = Form;