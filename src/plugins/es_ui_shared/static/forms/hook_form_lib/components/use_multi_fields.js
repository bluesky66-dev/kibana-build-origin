"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UseMultiFields = UseMultiFields;

var _react = _interopRequireDefault(require("react"));

var _use_field = require("./use_field");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function UseMultiFields({
  fields,
  children
}) {
  const fieldsArray = Object.entries(fields).reduce((acc, [fieldId, field]) => [...acc, {
    id: fieldId,
    ...field
  }], []);
  const hookFields = {};

  const renderField = index => {
    const {
      id
    } = fieldsArray[index];
    return /*#__PURE__*/_react.default.createElement(_use_field.UseField, fields[id], field => {
      hookFields[id] = field;
      return index === fieldsArray.length - 1 ? children(hookFields) : renderField(index + 1);
    });
  };

  if (!Boolean(fieldsArray.length)) {
    return null;
  }

  return renderField(0);
}