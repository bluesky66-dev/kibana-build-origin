"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateIncludeExcludeFormat = exports.isStringOrNumberType = exports.isStringType = exports.isNumberType = exports.isType = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isType = (...types) => {
  return agg => {
    const field = agg.params.field;
    return types.some(type => field && field.type === type);
  };
};

exports.isType = isType;
const isNumberType = isType('number');
exports.isNumberType = isNumberType;
const isStringType = isType('string');
exports.isStringType = isStringType;
const isStringOrNumberType = isType('string', 'number');
exports.isStringOrNumberType = isStringOrNumberType;
const migrateIncludeExcludeFormat = {
  serialize(value, agg) {
    if (this.shouldShow && !this.shouldShow(agg)) return;
    if (!value || (0, _lodash.isString)(value) || Array.isArray(value)) return value;else return value.pattern;
  },

  write(aggConfig, output) {
    const value = aggConfig.getParam(this.name);

    if (Array.isArray(value) && value.length > 0 && isNumberType(aggConfig)) {
      const parsedValue = value.filter(val => Number.isFinite(val));

      if (parsedValue.length) {
        output.params[this.name] = parsedValue;
      }
    } else if ((0, _lodash.isObject)(value)) {
      output.params[this.name] = value.pattern;
    } else if (value && isStringType(aggConfig)) {
      output.params[this.name] = value;
    }
  }

};
exports.migrateIncludeExcludeFormat = migrateIncludeExcludeFormat;