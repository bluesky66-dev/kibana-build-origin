"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkConflicts = checkConflicts;

var _uuid = require("uuid");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isUnresolvableConflict = error => {
  var _error$metadata;

  return error.statusCode === 409 && ((_error$metadata = error.metadata) === null || _error$metadata === void 0 ? void 0 : _error$metadata.isNotOverwritable);
};

async function checkConflicts({
  objects,
  savedObjectsClient,
  namespace,
  ignoreRegularConflicts,
  retries = [],
  createNewCopies
}) {
  const filteredObjects = [];
  const errors = [];
  const importIdMap = new Map();
  const pendingOverwrites = new Set(); // exit early if there are no objects to check

  if (objects.length === 0) {
    return {
      filteredObjects,
      errors,
      importIdMap,
      pendingOverwrites
    };
  }

  const retryMap = retries.reduce((acc, cur) => acc.set(`${cur.type}:${cur.id}`, cur), new Map());
  const objectsToCheck = objects.map(x => {
    var _retryMap$get$destina, _retryMap$get;

    const id = (_retryMap$get$destina = (_retryMap$get = retryMap.get(`${x.type}:${x.id}`)) === null || _retryMap$get === void 0 ? void 0 : _retryMap$get.destinationId) !== null && _retryMap$get$destina !== void 0 ? _retryMap$get$destina : x.id;
    return { ...x,
      id
    };
  });
  const checkConflictsResult = await savedObjectsClient.checkConflicts(objectsToCheck, {
    namespace
  });
  const errorMap = checkConflictsResult.errors.reduce((acc, {
    type,
    id,
    error
  }) => acc.set(`${type}:${id}`, error), new Map());
  objects.forEach(object => {
    const {
      type,
      id,
      attributes: {
        title
      }
    } = object;
    const {
      destinationId,
      overwrite,
      createNewCopy
    } = retryMap.get(`${type}:${id}`) || {};
    const errorObj = errorMap.get(`${type}:${destinationId !== null && destinationId !== void 0 ? destinationId : id}`);

    if (errorObj && isUnresolvableConflict(errorObj)) {
      // Any object create attempt that would result in an unresolvable conflict should have its ID regenerated. This way, when an object
      // with a "multi-namespace" type is exported from one namespace and imported to another, it does not result in an error, but instead a
      // new object is created.
      // This code path should not be triggered for a retry, but in case the consumer is using the import APIs incorrectly and attempting to
      // retry an object with a destinationId that would result in an unresolvable conflict, we regenerate the ID here as a fail-safe.
      const omitOriginId = createNewCopies || createNewCopy;
      importIdMap.set(`${type}:${id}`, {
        id: (0, _uuid.v4)(),
        omitOriginId
      });
      filteredObjects.push(object);
    } else if (errorObj && errorObj.statusCode !== 409) {
      errors.push({
        type,
        id,
        title,
        meta: {
          title
        },
        error: { ...errorObj,
          type: 'unknown'
        }
      });
    } else if ((errorObj === null || errorObj === void 0 ? void 0 : errorObj.statusCode) === 409 && !ignoreRegularConflicts && !overwrite) {
      const error = {
        type: 'conflict',
        ...(destinationId && {
          destinationId
        })
      };
      errors.push({
        type,
        id,
        title,
        meta: {
          title
        },
        error
      });
    } else {
      filteredObjects.push(object);

      if ((errorObj === null || errorObj === void 0 ? void 0 : errorObj.statusCode) === 409) {
        pendingOverwrites.add(`${type}:${id}`);
      }
    }
  });
  return {
    filteredObjects,
    errors,
    importIdMap,
    pendingOverwrites
  };
}