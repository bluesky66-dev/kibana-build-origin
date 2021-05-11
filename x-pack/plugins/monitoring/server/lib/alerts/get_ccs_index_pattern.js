"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCcsIndexPattern = getCcsIndexPattern;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function getCcsIndexPattern(indexPattern, remotes) {
  if (remotes.length === 0) {
    return indexPattern;
  }

  const patternsToAdd = [];

  for (const index of indexPattern.split(',')) {
    for (const remote of remotes) {
      patternsToAdd.push(`${remote}:${index}`);
    }
  }

  return [...indexPattern.split(','), ...patternsToAdd].join(',');
}