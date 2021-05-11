"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHttpEdges = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getHttpEdges = response => formatHttpEdges((0, _fp.getOr)([], `aggregations.url.buckets`, response.rawResponse));

exports.getHttpEdges = getHttpEdges;

const formatHttpEdges = buckets => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    domains: bucket.domains.buckets.map(({
      key
    }) => key),
    methods: bucket.methods.buckets.map(({
      key
    }) => key),
    statuses: bucket.status.buckets.map(({
      key
    }) => `${key}`),
    lastHost: (0, _fp.get)('source.hits.hits[0]._source.host.name', bucket),
    lastSourceIp: (0, _fp.get)('source.hits.hits[0]._source.source.ip', bucket),
    path: bucket.key,
    requestCount: bucket.doc_count
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));