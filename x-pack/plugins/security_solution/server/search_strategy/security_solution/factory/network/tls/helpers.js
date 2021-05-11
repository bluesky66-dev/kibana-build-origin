"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatNetworkTlsEdges = exports.getNetworkTlsEdges = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNetworkTlsEdges = response => formatNetworkTlsEdges((0, _fp.getOr)([], 'aggregations.sha1.buckets', response.rawResponse));

exports.getNetworkTlsEdges = getNetworkTlsEdges;

const formatNetworkTlsEdges = buckets => buckets.map(bucket => {
  const edge = {
    node: {
      _id: bucket.key,
      subjects: bucket.subjects.buckets.map(({
        key
      }) => key),
      ja3: bucket.ja3.buckets.map(({
        key
      }) => key),
      issuers: bucket.issuers.buckets.map(({
        key
      }) => key),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      notAfter: bucket.not_after.buckets.map(({
        key_as_string
      }) => key_as_string)
    },
    cursor: {
      value: bucket.key,
      tiebreaker: null
    }
  };
  return edge;
});

exports.formatNetworkTlsEdges = formatNetworkTlsEdges;