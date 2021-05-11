"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatErrors = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const formatErrors = errors => {
  const err = errors.map(error => {
    if (error.message != null) {
      return error.message;
    } else {
      const keyContext = error.context.filter(entry => entry.key != null && !Number.isInteger(+entry.key) && entry.key.trim() !== '').map(entry => entry.key).join(',');
      const nameContext = error.context.find(entry => {
        var _entry$type, _entry$type$name;

        return ((_entry$type = entry.type) === null || _entry$type === void 0 ? void 0 : (_entry$type$name = _entry$type.name) === null || _entry$type$name === void 0 ? void 0 : _entry$type$name.length) > 0;
      });
      const suppliedValue = keyContext !== '' ? keyContext : nameContext != null ? nameContext.type.name : '';
      const value = (0, _fp.isObject)(error.value) ? JSON.stringify(error.value) : error.value;
      return `Invalid value "${value}" supplied to "${suppliedValue}"`;
    }
  });
  return [...new Set(err)];
};

exports.formatErrors = formatErrors;