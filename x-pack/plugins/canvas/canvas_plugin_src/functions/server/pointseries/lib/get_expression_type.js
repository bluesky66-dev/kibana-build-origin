"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExpressionType = getExpressionType;

var _tinymath = require("@kbn/tinymath");

var _get_field_type = require("../../../../../common/lib/get_field_type");

var _is_column_reference = require("./is_column_reference");

var _get_field_names = require("./get_field_names");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getExpressionType(columns, mathExpression) {
  // if isColumnReference returns true, then mathExpression is just a string
  // referencing a column in a datatable
  if ((0, _is_column_reference.isColumnReference)(mathExpression)) {
    return (0, _get_field_type.getFieldType)(columns, mathExpression);
  }

  const parsedMath = (0, _tinymath.parse)(mathExpression);

  if (typeof parsedMath !== 'number' && parsedMath.type === 'function') {
    const fieldNames = parsedMath.args.reduce(_get_field_names.getFieldNames, []);

    if (fieldNames.length > 0) {
      const fieldTypes = fieldNames.reduce((types, name) => {
        const type = (0, _get_field_type.getFieldType)(columns, name);

        if (type !== 'null' && types.indexOf(type) === -1) {
          return types.concat(type);
        }

        return types;
      }, []);
      return fieldTypes.length === 1 ? fieldTypes[0] : 'string';
    }

    return 'number';
  }

  return typeof parsedMath;
}