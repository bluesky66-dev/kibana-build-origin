"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateRawDocs = migrateRawDocs;
exports.CorruptSavedObjectError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * This file provides logic for migrating raw documents.
 */

/**
 * Error thrown when saved object migrations encounter a corrupt saved object.
 * Corrupt saved objects cannot be serialized because:
 *  - there's no `[type]` property which contains the type attributes
 *  - the type or namespace in the _id doesn't match the `type` or `namespace`
 *    properties
 */
class CorruptSavedObjectError extends Error {
  constructor(rawId) {
    super(`Unable to migrate the corrupt saved object document with _id: '${rawId}'.`); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.rawId = rawId;
    Object.setPrototypeOf(this, CorruptSavedObjectError.prototype);
  }

}
/**
 * Applies the specified migration function to every saved object document in the list
 * of raw docs. Any raw docs that are not valid saved objects will simply be passed through.
 *
 * @param {TransformFn} migrateDoc
 * @param {SavedObjectsRawDoc[]} rawDocs
 * @returns {SavedObjectsRawDoc[]}
 */


exports.CorruptSavedObjectError = CorruptSavedObjectError;

async function migrateRawDocs(serializer, migrateDoc, rawDocs, log) {
  const migrateDocWithoutBlocking = transformNonBlocking(migrateDoc);
  const processedDocs = [];

  for (const raw of rawDocs) {
    const options = {
      namespaceTreatment: 'lax'
    };

    if (serializer.isRawSavedObject(raw, options)) {
      const savedObject = serializer.rawToSavedObject(raw, options);
      savedObject.migrationVersion = savedObject.migrationVersion || {};
      processedDocs.push(...(await migrateDocWithoutBlocking(savedObject)).map(attrs => serializer.savedObjectToRaw({
        references: [],
        ...attrs
      })));
    } else {
      throw new CorruptSavedObjectError(raw._id);
    }
  }

  return processedDocs;
}
/**
 * Migration transform functions are potentially CPU heavy e.g. doing decryption/encryption
 * or (de)/serializing large JSON payloads.
 * Executing all transforms for a batch in a synchronous loop can block the event-loop for a long time.
 * To prevent this we use setImmediate to ensure that the event-loop can process other parallel
 * work in between each transform.
 */


function transformNonBlocking(transform) {
  // promises aren't enough to unblock the event loop
  return doc => new Promise((resolve, reject) => {
    // set immediate is though
    setImmediate(() => {
      try {
        resolve(transform(doc));
      } catch (e) {
        reject(e);
      }
    });
  });
}