"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRuleValidateTypeDependents = exports.validateSortOrder = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const validateSortOrder = find => {
  if (find.sort_order != null || find.sort_field != null) {
    if (find.sort_order == null || find.sort_field == null) {
      return ['when "sort_order" and "sort_field" must exist together or not at all'];
    } else {
      return [];
    }
  } else {
    return [];
  }
};

exports.validateSortOrder = validateSortOrder;

const findRuleValidateTypeDependents = schema => {
  return [...validateSortOrder(schema)];
};

exports.findRuleValidateTypeDependents = findRuleValidateTypeDependents;