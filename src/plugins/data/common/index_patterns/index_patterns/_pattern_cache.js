"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createIndexPatternCache = createIndexPatternCache;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function createIndexPatternCache() {
  const vals = {};
  const cache = {
    get: id => {
      return vals[id];
    },
    set: (id, prom) => {
      vals[id] = prom;
      return prom;
    },
    clear: id => {
      delete vals[id];
    },
    clearAll: () => {
      for (const id in vals) {
        if (vals.hasOwnProperty(id)) {
          delete vals[id];
        }
      }
    }
  };
  return cache;
}