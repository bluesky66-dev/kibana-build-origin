"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleAnnotationResponse = void 0;

var _lodash = require("lodash");

var _filter = require("./filter");

var _buckets = require("./buckets");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const handleAnnotationResponse = timestamp => (0, _lodash.flow)(_buckets.getAnnotationBuckets, (0, _filter.filterAnnotations)(timestamp));

exports.handleAnnotationResponse = handleAnnotationResponse;