"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.labelFieldsPrefix = exports.labelField = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const labelField = (label, field) => [{
  constant: ' '
}, {
  constant: label
}, {
  constant: '='
}, {
  field
}];

exports.labelField = labelField;

const labelFieldsPrefix = (label, fieldsPrefix) => [{
  constant: ' '
}, {
  constant: label
}, {
  constant: '='
}, {
  fieldsPrefix
}];

exports.labelFieldsPrefix = labelFieldsPrefix;