"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getObjectReferencesToFetch = getObjectReferencesToFetch;
exports.fetchNestedDependencies = fetchNestedDependencies;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getObjectReferencesToFetch(savedObjectsMap) {
  const objectsToFetch = new Map();

  for (const savedObject of savedObjectsMap.values()) {
    for (const ref of savedObject.references || []) {
      if (!savedObjectsMap.has(objKey(ref))) {
        objectsToFetch.set(objKey(ref), {
          type: ref.type,
          id: ref.id
        });
      }
    }
  }

  return [...objectsToFetch.values()];
}

async function fetchNestedDependencies(savedObjects, savedObjectsClient, namespace) {
  const savedObjectsMap = new Map();

  for (const savedObject of savedObjects) {
    savedObjectsMap.set(objKey(savedObject), savedObject);
  }

  let objectsToFetch = getObjectReferencesToFetch(savedObjectsMap);

  while (objectsToFetch.length > 0) {
    const bulkGetResponse = await savedObjectsClient.bulkGet(objectsToFetch, {
      namespace
    }); // Push to array result

    for (const savedObject of bulkGetResponse.saved_objects) {
      savedObjectsMap.set(objKey(savedObject), savedObject);
    }

    objectsToFetch = getObjectReferencesToFetch(savedObjectsMap);
  }

  const allObjects = [...savedObjectsMap.values()];
  return {
    objects: allObjects.filter(obj => !obj.error),
    missingRefs: allObjects.filter(obj => !!obj.error).map(obj => ({
      type: obj.type,
      id: obj.id
    }))
  };
}

const objKey = obj => `${obj.type}:${obj.id}`;