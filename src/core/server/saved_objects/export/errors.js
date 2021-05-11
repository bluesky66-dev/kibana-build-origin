"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SavedObjectsExportError = void 0;

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
class SavedObjectsExportError extends Error {
  constructor(type, message, attributes) {
    super(message); // Set the prototype explicitly, see:
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

    this.type = type;
    this.attributes = attributes;
    Object.setPrototypeOf(this, SavedObjectsExportError.prototype);
  }

  static exportSizeExceeded(limit) {
    return new SavedObjectsExportError('export-size-exceeded', `Can't export more than ${limit} objects`);
  }

  static objectFetchError(objects) {
    return new SavedObjectsExportError('object-fetch-error', 'Error fetching objects to export', {
      objects
    });
  }
  /**
   * Error returned when a {@link SavedObjectsExportTransform | export tranform} threw an error
   */


  static objectTransformError(objects, cause) {
    return new SavedObjectsExportError('object-transform-error', 'Error transforming objects to export', {
      objects,
      cause: cause.message
    });
  }
  /**
   * Error returned when a {@link SavedObjectsExportTransform | export tranform} performed an invalid operation
   * during the transform, such as removing objects from the export, or changing an object's type or id.
   */


  static invalidTransformError(objectKeys) {
    return new SavedObjectsExportError('invalid-transform-error', 'Invalid transform performed on objects to export', {
      objectKeys
    });
  }

}

exports.SavedObjectsExportError = SavedObjectsExportError;