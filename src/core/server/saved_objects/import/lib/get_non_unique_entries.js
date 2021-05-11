"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNonUniqueEntries = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getNonUniqueEntries = objects => {
  const idCountMap = objects.reduce((acc, {
    type,
    id
  }) => {
    var _acc$get;

    const key = `${type}:${id}`;
    const val = (_acc$get = acc.get(key)) !== null && _acc$get !== void 0 ? _acc$get : 0;
    return acc.set(key, val + 1);
  }, new Map());
  const nonUniqueEntries = [];
  idCountMap.forEach((value, key) => {
    if (value >= 2) {
      nonUniqueEntries.push(key);
    }
  });
  return nonUniqueEntries;
};

exports.getNonUniqueEntries = getNonUniqueEntries;