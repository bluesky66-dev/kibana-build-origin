"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NoteSavedObjectToReturnRuntimeType = exports.NoteSavedObjectRuntimeType = exports.SavedNoteRuntimeType = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _utility_types = require("../../../utility_types");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable @typescript-eslint/no-empty-interface */

/*
 *  Note Types
 */


const SavedNoteRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  timelineId: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
}), runtimeTypes.partial({
  eventId: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  note: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  created: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  createdBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string),
  updated: (0, _utility_types.unionWithNullType)(runtimeTypes.number),
  updatedBy: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
})]);
exports.SavedNoteRuntimeType = SavedNoteRuntimeType;
/**
 * Note Saved object type with metadata
 */

const NoteSavedObjectRuntimeType = runtimeTypes.intersection([runtimeTypes.type({
  id: runtimeTypes.string,
  attributes: SavedNoteRuntimeType,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  noteId: runtimeTypes.string,
  timelineVersion: runtimeTypes.union([runtimeTypes.string, runtimeTypes.null, runtimeTypes.undefined])
})]);
exports.NoteSavedObjectRuntimeType = NoteSavedObjectRuntimeType;
const NoteSavedObjectToReturnRuntimeType = runtimeTypes.intersection([SavedNoteRuntimeType, runtimeTypes.type({
  noteId: runtimeTypes.string,
  version: runtimeTypes.string
}), runtimeTypes.partial({
  timelineVersion: (0, _utility_types.unionWithNullType)(runtimeTypes.string)
})]);
exports.NoteSavedObjectToReturnRuntimeType = NoteSavedObjectToReturnRuntimeType;