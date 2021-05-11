"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasData = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const hasData = async (index, client) => {
  const params = {
    index,
    allowNoIndices: true,
    terminate_after: 1,
    ignoreUnavailable: true,
    body: {
      size: 0
    }
  };
  const results = await client(params);
  return results.hits.total.value !== 0;
};

exports.hasData = hasData;