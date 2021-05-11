"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFilterable = isFilterable;
exports.isNestedField = isNestedField;

var _kbn_field_types = require("../../kbn_field_types");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const filterableTypes = (0, _kbn_field_types.getFilterableKbnTypeNames)();

function isFilterable(field) {
  return field.name === '_id' || field.scripted || Boolean(field.searchable && filterableTypes.includes(field.type));
}

function isNestedField(field) {
  var _field$subType;

  return !!((_field$subType = field.subType) !== null && _field$subType !== void 0 && _field$subType.nested);
}