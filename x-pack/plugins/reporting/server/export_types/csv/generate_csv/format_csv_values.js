"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFormatCsvValues = createFormatCsvValues;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createFormatCsvValues(escapeValue, separator, fields, formatsMap) {
  return function formatCsvValues(values) {
    return fields.map(field => {
      let value;

      if (field === '_source') {
        value = values;
      } else {
        value = values[field];
      }

      if ((0, _lodash.isNull)(value) || (0, _lodash.isUndefined)(value)) {
        return '';
      }

      let formattedValue = value;

      if (formatsMap.has(field)) {
        const formatter = formatsMap.get(field);

        if (formatter) {
          formattedValue = formatter.convert(value);
        }
      }

      return formattedValue;
    }).map(value => (0, _lodash.isObject)(value) ? JSON.stringify(value) : value).map(value => value ? value.toString() : value).map(escapeValue).join(separator);
  };
}