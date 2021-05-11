"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickFeatureName = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pickFeatureName = buckets => {
  if (buckets) {
    const metadata = buckets.map(bucket => bucket.key);
    return metadata;
  } else {
    return [];
  }
};

exports.pickFeatureName = pickFeatureName;