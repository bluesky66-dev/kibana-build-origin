"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractErrors = extractErrors;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function extractErrors( // TODO: define saved object type
savedObjectResults, savedObjectsToImport) {
  const errors = [];
  const originalSavedObjectsMap = new Map();

  for (const savedObject of savedObjectsToImport) {
    originalSavedObjectsMap.set(`${savedObject.type}:${savedObject.id}`, savedObject);
  }

  for (const savedObject of savedObjectResults) {
    if (savedObject.error) {
      var _originalSavedObject$;

      const originalSavedObject = originalSavedObjectsMap.get(`${savedObject.type}:${savedObject.id}`);
      const title = originalSavedObject === null || originalSavedObject === void 0 ? void 0 : (_originalSavedObject$ = originalSavedObject.attributes) === null || _originalSavedObject$ === void 0 ? void 0 : _originalSavedObject$.title;
      const {
        destinationId
      } = savedObject;

      if (savedObject.error.statusCode === 409) {
        errors.push({
          id: savedObject.id,
          type: savedObject.type,
          title,
          meta: {
            title
          },
          error: {
            type: 'conflict',
            ...(destinationId && {
              destinationId
            })
          }
        });
        continue;
      }

      errors.push({
        id: savedObject.id,
        type: savedObject.type,
        title,
        meta: {
          title
        },
        error: { ...savedObject.error,
          type: 'unknown'
        }
      });
    }
  }

  return errors;
}