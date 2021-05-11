"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBuffer = createBuffer;

var _lodash = require("lodash");

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _result_type = require("./result_type");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const DONT_FLUSH = false;
const FLUSH = true;

function createBuffer(bulkOperation, {
  bufferMaxDuration = 0,
  bufferMaxOperations = Number.MAX_VALUE,
  logger
} = {}) {
  const flushBuffer = new _rxjs.Subject();
  const storeUpdateBuffer = new _rxjs.Subject();
  storeUpdateBuffer.pipe((0, _operators.bufferWhen)(() => flushBuffer), (0, _operators.filter)(tasks => tasks.length > 0)).subscribe(bufferedEntities => {
    bulkOperation((0, _lodash.map)(bufferedEntities, 'entity')).then(results => {
      results.forEach(result => (0, _result_type.either)(result, entity => {
        (0, _result_type.either)(pullFirstWhere(bufferedEntities, ({
          entity: {
            id
          }
        }) => id === entity.id), ({
          onSuccess
        }) => {
          onSuccess((0, _result_type.asOk)(entity));
        }, () => {
          if (logger) {
            logger.warn(`Unhandled successful Bulk Operation result: ${entity !== null && entity !== void 0 && entity.id ? entity.id : entity}`);
          }
        });
      }, ({
        entity,
        error
      }) => {
        (0, _result_type.either)(pullFirstWhere(bufferedEntities, ({
          entity: {
            id
          }
        }) => id === entity.id), ({
          onFailure
        }) => {
          onFailure((0, _result_type.asErr)(error));
        }, () => {
          if (logger) {
            logger.warn(`Unhandled failed Bulk Operation result: ${entity !== null && entity !== void 0 && entity.id ? entity.id : entity}`);
          }
        });
      })); // if any `bufferedEntities` remain in the array then there was no result we could map to them in the bulkOperation
      // call their failure handler to avoid hanging the promise returned to the call site

      bufferedEntities.forEach(unhandledBufferedEntity => {
        unhandledBufferedEntity.onFailure((0, _result_type.asErr)(new Error(`Unhandled buffered operation for entity: ${unhandledBufferedEntity.entity.id}`)));
      });
    }).catch(ex => {
      bufferedEntities.forEach(({
        onFailure
      }) => onFailure((0, _result_type.asErr)(ex)));
    });
  });
  let countInBuffer = 0;

  const flushAndResetCounter = () => {
    countInBuffer = 0;
    flushBuffer.next();
  };

  storeUpdateBuffer.pipe( // complete once the buffer has either filled to `bufferMaxOperations` or
  // a `bufferMaxDuration` has passed. Default to `bufferMaxDuration` being the
  // current event loop tick rather than a fixed duration
  (0, _operators.flatMap)(() => {
    return ++countInBuffer === 1 ? (0, _rxjs.race)([// the race is started in response to the first operation into the buffer
    // so we flush once the remaining operations come in (which is `bufferMaxOperations - 1`)
    storeUpdateBuffer.pipe((0, _operators.bufferCount)(bufferMaxOperations - 1)), // flush buffer once max duration has passed
    (0, _rxjs.from)(resolveIn(bufferMaxDuration))]).pipe((0, _operators.first)(), (0, _operators.mapTo)(FLUSH)) : (0, _rxjs.from)([DONT_FLUSH]);
  }), (0, _operators.filter)(shouldFlush => shouldFlush)).subscribe({
    next: flushAndResetCounter,
    // As this stream is just trying to decide when to flush
    // there's no data to lose, so in the case that an error
    // is thrown, lets just flush
    error: flushAndResetCounter
  });
  return async function (entity) {
    return new Promise((resolve, reject) => {
      storeUpdateBuffer.next({
        entity,
        onSuccess: resolve,
        onFailure: reject
      });
    });
  };
}

function resolveIn(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

function pullFirstWhere(collection, predicate) {
  const indexOfFirstEntity = collection.findIndex(predicate);
  return indexOfFirstEntity >= 0 ? (0, _result_type.asOk)(collection.splice(indexOfFirstEntity, 1)[0]) : (0, _result_type.asErr)(undefined);
}