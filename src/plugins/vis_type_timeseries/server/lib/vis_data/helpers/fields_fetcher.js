"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldsFetcher = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFieldsFetcher = (req, searchStrategy, capabilities) => {
  const fieldsCacheMap = new Map();
  return async index => {
    if (fieldsCacheMap.has(index)) {
      return fieldsCacheMap.get(index);
    }

    const fields = await searchStrategy.getFieldsForWildcard(req, index, capabilities);
    fieldsCacheMap.set(index, fields);
    return fields;
  };
};

exports.createFieldsFetcher = createFieldsFetcher;