"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapFormFields = exports.unflattenObject = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const unflattenObject = object => Object.entries(object).reduce((acc, [key, value]) => {
  (0, _saferLodashSet.set)(acc, key, value);
  return acc;
}, {});
/**
 * Helper to map the object of fields to any of its value
 *
 * @param formFields key value pair of path and form Fields
 * @param fn Iterator function to execute on the field
 */


exports.unflattenObject = unflattenObject;

const mapFormFields = (formFields, fn) => Object.entries(formFields).reduce((acc, [key, field]) => {
  acc[key] = fn(field);
  return acc;
}, {});

exports.mapFormFields = mapFormFields;