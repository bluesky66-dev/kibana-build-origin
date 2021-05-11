"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildExistsFilter = exports.getExistsFilterField = exports.isExistsFilter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isExistsFilter = filter => filter && filter.exists;

exports.isExistsFilter = isExistsFilter;

const getExistsFilterField = filter => {
  return filter.exists && filter.exists.field;
};

exports.getExistsFilterField = getExistsFilterField;

const buildExistsFilter = (field, indexPattern) => {
  return {
    meta: {
      index: indexPattern.id
    },
    exists: {
      field: field.name
    }
  };
};

exports.buildExistsFilter = buildExistsFilter;