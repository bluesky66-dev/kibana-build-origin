"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsImportError = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * @public
 */
class SavedObjectsImportError extends Error {
  constructor(type, message, attributes) {
    super(message); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.type = type;
    this.attributes = attributes;
    Object.setPrototypeOf(this, SavedObjectsImportError.prototype);
  }

  static importSizeExceeded(limit) {
    return new SavedObjectsImportError('import-size-exceeded', `Can't import more than ${limit} objects`);
  }

  static nonUniqueImportObjects(nonUniqueEntries) {
    return new SavedObjectsImportError('non-unique-entries', `Non-unique import objects detected: [${nonUniqueEntries.join()}]`);
  }

  static nonUniqueRetryObjects(nonUniqueRetryObjects) {
    return new SavedObjectsImportError('non-unique-retry-objects', `Non-unique retry objects: [${nonUniqueRetryObjects.join()}]`);
  }

  static nonUniqueRetryDestinations(nonUniqueRetryDestinations) {
    return new SavedObjectsImportError('non-unique-retry-destination', `Non-unique retry destinations: [${nonUniqueRetryDestinations.join()}]`);
  }

  static referencesFetchError(objects) {
    return new SavedObjectsImportError('references-fetch-error', 'Error fetching references for imported objects', {
      objects
    });
  }

}

exports.SavedObjectsImportError = SavedObjectsImportError;