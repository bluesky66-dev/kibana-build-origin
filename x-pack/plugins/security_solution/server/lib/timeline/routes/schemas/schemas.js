"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pinnedEventIds = exports.globalNotes = exports.eventNotes = void 0;

var runtimeTypes = _interopRequireWildcard(require("io-ts"));

var _utility_types = require("../../../../../common/utility_types");

var _note = require("../../../../../common/types/timeline/note");

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


const eventNotes = (0, _utility_types.unionWithNullType)(runtimeTypes.array(_note.SavedNoteRuntimeType));
exports.eventNotes = eventNotes;
const globalNotes = (0, _utility_types.unionWithNullType)(runtimeTypes.array(_note.SavedNoteRuntimeType));
exports.globalNotes = globalNotes;
const pinnedEventIds = (0, _utility_types.unionWithNullType)(runtimeTypes.array(runtimeTypes.string));
exports.pinnedEventIds = pinnedEventIds;