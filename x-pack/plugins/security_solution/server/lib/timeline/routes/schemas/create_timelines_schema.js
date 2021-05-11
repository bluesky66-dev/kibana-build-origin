"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTimelineSchema = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _timeline = require("../../../../../common/types/timeline");

var _utility_types = require("../../../../../common/utility_types");

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


const createTimelineSchema = rt.intersection([rt.type({
  timeline: _timeline.SavedTimelineRuntimeType
}), rt.partial({
  status: (0, _utility_types.unionWithNullType)(_timeline.TimelineStatusLiteralRt),
  timelineId: (0, _utility_types.unionWithNullType)(rt.string),
  templateTimelineId: (0, _utility_types.unionWithNullType)(rt.string),
  templateTimelineVersion: (0, _utility_types.unionWithNullType)(rt.number),
  timelineType: (0, _utility_types.unionWithNullType)(_timeline.TimelineTypeLiteralRt),
  version: (0, _utility_types.unionWithNullType)(rt.string)
})]);
exports.createTimelineSchema = createTimelineSchema;