"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortAndOrderReindexOperations = exports.queuedOpHasStarted = exports.isQueuedOp = void 0;

var _function = require("fp-ts/lib/function");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const sortReindexOperations = ops => {
  const parallel = [];
  const queue = [];

  for (const op of ops) {
    var _op$attributes$reinde;

    if ((_op$attributes$reinde = op.attributes.reindexOptions) !== null && _op$attributes$reinde !== void 0 && _op$attributes$reinde.queueSettings) {
      queue.push(op);
    } else {
      parallel.push(op);
    }
  }

  return {
    parallel,
    queue
  };
};

const orderQueuedReindexOperations = ({
  parallel,
  queue
}) => ({
  parallel,
  // Sort asc
  queue: queue.sort((a, b) => a.attributes.reindexOptions.queueSettings.queuedAt - b.attributes.reindexOptions.queueSettings.queuedAt)
});

const isQueuedOp = op => {
  var _op$attributes$reinde2;

  return Boolean((_op$attributes$reinde2 = op.attributes.reindexOptions) === null || _op$attributes$reinde2 === void 0 ? void 0 : _op$attributes$reinde2.queueSettings);
};

exports.isQueuedOp = isQueuedOp;

const queuedOpHasStarted = op => {
  var _op$attributes$reinde3, _op$attributes$reinde4;

  return Boolean((_op$attributes$reinde3 = op.attributes.reindexOptions) === null || _op$attributes$reinde3 === void 0 ? void 0 : (_op$attributes$reinde4 = _op$attributes$reinde3.queueSettings) === null || _op$attributes$reinde4 === void 0 ? void 0 : _op$attributes$reinde4.startedAt);
};

exports.queuedOpHasStarted = queuedOpHasStarted;
const sortAndOrderReindexOperations = (0, _function.flow)(sortReindexOperations, orderQueuedReindexOperations);
exports.sortAndOrderReindexOperations = sortAndOrderReindexOperations;