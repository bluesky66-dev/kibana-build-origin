"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkValidNode = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const checkValidNode = async (search, indexPattern, field, id) => {
  const params = {
    allowNoIndices: true,
    ignoreUnavailable: true,
    index: indexPattern,
    terminateAfter: 1,
    body: {
      size: 0,
      query: {
        match: {
          [field]: id
        }
      }
    }
  };
  const response = await search(params);
  return response.hits.total.value > 0;
};

exports.checkValidNode = checkValidNode;