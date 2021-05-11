"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateIndexPatterBasedOnMetrics = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const calculateIndexPatterBasedOnMetrics = (options, source) => {
  const {
    metrics
  } = options;

  if (metrics.every(m => m.type === 'logRate')) {
    return source.configuration.logAlias;
  }

  if (metrics.some(m => m.type === 'logRate')) {
    return `${source.configuration.logAlias},${source.configuration.metricAlias}`;
  }

  return source.configuration.metricAlias;
};

exports.calculateIndexPatterBasedOnMetrics = calculateIndexPatterBasedOnMetrics;