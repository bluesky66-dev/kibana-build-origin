"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatDnsEdges = exports.getDnsEdges = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDnsEdges = response => formatDnsEdges((0, _fp.getOr)([], `aggregations.dns_name_query_count.buckets`, response.rawResponse));

exports.getDnsEdges = getDnsEdges;

const formatDnsEdges = buckets => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    dnsBytesIn: getOrNumber('dns_bytes_in.value', bucket),
    dnsBytesOut: getOrNumber('dns_bytes_out.value', bucket),
    dnsName: bucket.key,
    queryCount: bucket.doc_count,
    uniqueDomains: getOrNumber('unique_domains.value', bucket)
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

exports.formatDnsEdges = formatDnsEdges;

const getOrNumber = (path, bucket) => {
  const numb = (0, _fp.get)(path, bucket);

  if (numb == null) {
    return null;
  }

  return numb;
};