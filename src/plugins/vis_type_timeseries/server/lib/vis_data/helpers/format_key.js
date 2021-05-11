"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatKey = formatKey;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function formatKey(key, series) {
  if (/{{\s*key\s*}}/.test(series.label)) {
    return series.label.replace(/{{\s*key\s*}}/, key);
  }

  return key;
}