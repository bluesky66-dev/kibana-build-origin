"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSearchAfterWithTieBreaker = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSearchAfterWithTieBreaker = ({
  response,
  sortField
}) => {
  if (response.hits.hits.length === 0) {
    return undefined;
  } else {
    const lastEsElement = response.hits.hits[response.hits.hits.length - 1];

    if (sortField == null) {
      return [lastEsElement._source.tie_breaker_id];
    } else {
      const [[, sortValue]] = Object.entries(lastEsElement._source).filter(([key]) => key === sortField);

      if (typeof sortValue === 'string') {
        return [sortValue, lastEsElement._source.tie_breaker_id];
      } else {
        return [lastEsElement._source.tie_breaker_id];
      }
    }
  }
};

exports.getSearchAfterWithTieBreaker = getSearchAfterWithTieBreaker;