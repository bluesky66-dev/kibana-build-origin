"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;

var _react = _interopRequireDefault(require("react"));

var _hook_form_lib = require("../hook_form_lib");

var _fields = require("./fields");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const mapTypeToFieldComponent = {
  [_hook_form_lib.FIELD_TYPES.TEXT]: _fields.TextField,
  [_hook_form_lib.FIELD_TYPES.TEXTAREA]: _fields.TextAreaField,
  [_hook_form_lib.FIELD_TYPES.NUMBER]: _fields.NumericField,
  [_hook_form_lib.FIELD_TYPES.CHECKBOX]: _fields.CheckBoxField,
  [_hook_form_lib.FIELD_TYPES.COMBO_BOX]: _fields.ComboBoxField,
  [_hook_form_lib.FIELD_TYPES.MULTI_SELECT]: _fields.MultiSelectField,
  [_hook_form_lib.FIELD_TYPES.RADIO_GROUP]: _fields.RadioGroupField,
  [_hook_form_lib.FIELD_TYPES.RANGE]: _fields.RangeField,
  [_hook_form_lib.FIELD_TYPES.SELECT]: _fields.SelectField,
  [_hook_form_lib.FIELD_TYPES.SUPER_SELECT]: _fields.SuperSelectField,
  [_hook_form_lib.FIELD_TYPES.TOGGLE]: _fields.ToggleField,
  [_hook_form_lib.FIELD_TYPES.JSON]: _fields.JsonEditorField
};

const Field = props => {
  const FieldComponent = mapTypeToFieldComponent[props.field.type] || _fields.TextField;
  return /*#__PURE__*/_react.default.createElement(FieldComponent, props);
};

exports.Field = Field;