"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBatchedFunction = void 0;

var _timed_item_buffer = require("./timed_item_buffer");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createBatchedFunction = params => {
  const {
    onCall,
    onBatch,
    maxItemAge = 10,
    flushOnMaxItems = 25
  } = params;
  const buffer = new _timed_item_buffer.TimedItemBuffer({
    onFlush: onBatch,
    maxItemAge,
    flushOnMaxItems
  });

  const fn = (...args) => {
    const [result, batchEntry] = onCall(...args);
    buffer.write(batchEntry);
    return result;
  };

  return [fn, buffer];
};

exports.createBatchedFunction = createBatchedFunction;