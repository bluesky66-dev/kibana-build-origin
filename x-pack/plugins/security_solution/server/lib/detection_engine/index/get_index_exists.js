"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexExists = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getIndexExists = async (callWithRequest, index) => {
  try {
    const response = await callWithRequest('search', {
      index,
      size: 0,
      terminate_after: 1,
      allow_no_indices: true
    });
    return response._shards.total > 0;
  } catch (err) {
    if (err.status === 404) {
      return false;
    } else {
      throw err;
    }
  }
};

exports.getIndexExists = getIndexExists;