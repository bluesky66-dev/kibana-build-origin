"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPivotTransform = isPivotTransform;
exports.isLatestTransform = isLatestTransform;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Generic type for transform response
 */

/**
 * Transform with pivot configuration
 */

/**
 * Transform with latest function configuration
 */

function isPivotTransform(transform) {
  return transform.hasOwnProperty('pivot');
}

function isLatestTransform(transform) {
  return transform.hasOwnProperty('latest');
}