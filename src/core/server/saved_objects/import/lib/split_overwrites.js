"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitOverwrites = splitOverwrites;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function splitOverwrites(savedObjects, retries) {
  const objectsToOverwrite = [];
  const objectsToNotOverwrite = [];
  const overwrites = retries.filter(retry => retry.overwrite).map(retry => `${retry.type}:${retry.id}`);

  for (const savedObject of savedObjects) {
    if (overwrites.includes(`${savedObject.type}:${savedObject.id}`)) {
      objectsToOverwrite.push(savedObject);
    } else {
      objectsToNotOverwrite.push(savedObject);
    }
  }

  return {
    objectsToOverwrite,
    objectsToNotOverwrite
  };
}