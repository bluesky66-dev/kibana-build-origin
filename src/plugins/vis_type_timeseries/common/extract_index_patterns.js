"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractIndexPatterns = extractIndexPatterns;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function extractIndexPatterns(panel, defaultIndex) {
  const patterns = [];

  if (panel.index_pattern) {
    patterns.push(panel.index_pattern);
  }

  panel.series.forEach(series => {
    const indexPattern = series.series_index_pattern;

    if (indexPattern && series.override_index_pattern) {
      patterns.push(indexPattern);
    }
  });

  if (panel.annotations) {
    panel.annotations.forEach(item => {
      const indexPattern = item.index_pattern;

      if (indexPattern) {
        patterns.push(indexPattern);
      }
    });
  }

  if (patterns.length === 0 && defaultIndex) {
    patterns.push(defaultIndex);
  }

  return (0, _lodash.uniq)(patterns).sort();
}