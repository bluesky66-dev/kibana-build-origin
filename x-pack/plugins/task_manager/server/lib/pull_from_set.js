"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pullFromSet = pullFromSet;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function pullFromSet(set, capacity) {
  if (capacity > 0 && set.size > 0) {
    const values = [];

    for (const value of set) {
      if (set.delete(value)) {
        values.push(value);

        if (values.length === capacity) {
          return values;
        }
      }
    }

    return values;
  }

  return [];
}