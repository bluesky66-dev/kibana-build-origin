"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAnnotationBuckets = getAnnotationBuckets;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getAnnotationBuckets(resp, annotation) {
  return (0, _lodash.get)(resp, `aggregations.${annotation.id}.buckets`, []).filter(bucket => !(0, _lodash.isEmpty)(bucket.hits.hits.hits)).map(bucket => ({
    key: bucket.key,
    docs: bucket.hits.hits.hits.map(doc => doc._source)
  }));
}