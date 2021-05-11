"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterParams = getFilterParams;

var _ = require(".");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getFilterParams(filter) {
  switch (filter.meta.type) {
    case _.FILTERS.PHRASE:
      return filter.meta.params.query;

    case _.FILTERS.PHRASES:
      return filter.meta.params;

    case _.FILTERS.RANGE:
      const {
        gte,
        gt,
        lte,
        lt
      } = filter.meta.params;
      return {
        from: gte !== null && gte !== void 0 ? gte : gt,
        to: lt !== null && lt !== void 0 ? lt : lte
      };
  }
}