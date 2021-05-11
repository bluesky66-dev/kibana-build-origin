"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildTimelineDetailsQuery = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const buildTimelineDetailsQuery = (indexName, id, docValueFields) => ({
  allowNoIndices: true,
  index: indexName,
  ignoreUnavailable: true,
  body: {
    docvalue_fields: docValueFields,
    query: {
      terms: {
        _id: [id]
      }
    },
    fields: ['*'],
    _source: true
  },
  size: 1
});

exports.buildTimelineDetailsQuery = buildTimelineDetailsQuery;