"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexState = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Throws if the index name is not found in the resolved indices response
 *
 * @param indexName Assume this is an index name, not an alias
 * @param resolvedResponse The response from _resolve/index/<indices>
 */

const getIndexState = (indexName, resolvedResponse) => {
  const index = resolvedResponse.indices.find(i => i.name === indexName);

  if (index) {
    return index.attributes.includes('closed') ? 'closed' : 'open';
  }

  throw new Error(`${indexName} not found!`);
};

exports.getIndexState = getIndexState;