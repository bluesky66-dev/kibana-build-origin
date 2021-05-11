"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.joinByKey = joinByKey;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function joinByKey(items, key, mergeFn = (a, b) => (0, _lodash.merge)({}, a, b)) {
  const keys = (0, _lodash.castArray)(key);
  return items.reduce((prev, current) => {
    let item = prev.find(prevItem => keys.every(k => (0, _lodash.isEqual)(prevItem[k], current[k])));

    if (!item) {
      item = { ...current
      };
      prev.push(item);
    } else {
      (0, _lodash.pull)(prev, item).push(mergeFn(item, current));
    }

    return prev;
  }, []);
}