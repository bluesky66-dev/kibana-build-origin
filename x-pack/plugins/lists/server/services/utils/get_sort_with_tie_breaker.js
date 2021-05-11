"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSortWithTieBreaker = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getSortWithTieBreaker = ({
  sortField,
  sortOrder
}) => {
  const ascOrDesc = sortOrder !== null && sortOrder !== void 0 ? sortOrder : 'asc';

  if (sortField != null) {
    return [{
      [sortField]: ascOrDesc,
      tie_breaker_id: 'asc'
    }];
  } else {
    return [{
      tie_breaker_id: 'asc'
    }];
  }
};

exports.getSortWithTieBreaker = getSortWithTieBreaker;