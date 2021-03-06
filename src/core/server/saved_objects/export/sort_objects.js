"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sortObjects = sortObjects;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function sortObjects(savedObjects) {
  const path = new Set();
  const sorted = new Set();
  const objectsByTypeId = new Map(savedObjects.map(object => [`${object.type}:${object.id}`, object]));

  function includeObjects(objects) {
    for (const object of objects) {
      if (path.has(object)) {
        continue;
      }

      const refdObjects = object.references.map(ref => objectsByTypeId.get(`${ref.type}:${ref.id}`)).filter(ref => !!ref);

      if (refdObjects.length) {
        path.add(object);
        includeObjects(refdObjects);
        path.delete(object);
      }

      sorted.add(object);
    }
  }

  includeObjects(savedObjects);
  return [...sorted];
}