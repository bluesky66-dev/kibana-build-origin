"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InvalidJSONProperty = exports.SavedObjectNotFound = exports.DuplicateField = exports.KbnError = void 0;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/* eslint-disable max-classes-per-file */
// abstract error class
class KbnError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}
/**
 * when a mapping already exists for a field the user is attempting to add
 * @param {String} name - the field name
 */


exports.KbnError = KbnError;

class DuplicateField extends KbnError {
  constructor(name) {
    super(`The field "${name}" already exists in this mapping`);
  }

}
/**
 * A saved object was not found
 */


exports.DuplicateField = DuplicateField;

class SavedObjectNotFound extends KbnError {
  constructor(type, id, link) {
    const idMsg = id ? ` (id: ${id})` : '';
    let message = `Could not locate that ${type}${idMsg}`;

    if (link) {
      message += `, [click here to re-create it](${link})`;
    }

    super(message);

    _defineProperty(this, "savedObjectType", void 0);

    _defineProperty(this, "savedObjectId", void 0);

    this.savedObjectType = type;
    this.savedObjectId = id;
  }

}
/**
 * This error is for scenarios where a saved object is detected that has invalid JSON properties.
 * There was a scenario where we were importing objects with double-encoded JSON, and the system
 * was silently failing. This error is now thrown in those scenarios.
 */


exports.SavedObjectNotFound = SavedObjectNotFound;

class InvalidJSONProperty extends KbnError {
  constructor(message) {
    super(message);
  }

}

exports.InvalidJSONProperty = InvalidJSONProperty;