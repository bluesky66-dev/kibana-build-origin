"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkTimelinesStatus = void 0;

var _path = _interopRequireWildcard(require("path"));

var _saved_object = require("../../saved_object");

var _common = require("./common");

var _get_timelines_to_install = require("./get_timelines_to_install");

var _get_timelines_to_update = require("./get_timelines_to_update");

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


const checkTimelinesStatus = async (frameworkRequest, filePath, fileName) => {
  let readStream;
  let timeline;
  const dir = (0, _path.resolve)((0, _path.join)(__dirname, filePath !== null && filePath !== void 0 ? filePath : '../../../detection_engine/rules/prepackaged_timelines'));
  const file = fileName !== null && fileName !== void 0 ? fileName : 'index.ndjson';

  const dataPath = _path.default.join(dir, file);

  try {
    readStream = await (0, _common.getReadables)(dataPath);
    timeline = await (0, _saved_object.getExistingPrepackagedTimelines)(frameworkRequest);
  } catch (err) {
    return {
      timelinesToInstall: [],
      timelinesToUpdate: [],
      prepackagedTimelines: []
    };
  }

  return (0, _common.loadData)(readStream, timelinesFromFileSystem => {
    if (Array.isArray(timelinesFromFileSystem)) {
      var _timeline$timeline;

      const parsedTimelinesFromFileSystem = timelinesFromFileSystem.map(t => JSON.parse(t));
      const prepackagedTimelines = (_timeline$timeline = timeline.timeline) !== null && _timeline$timeline !== void 0 ? _timeline$timeline : [];
      const timelinesToInstall = (0, _get_timelines_to_install.getTimelinesToInstall)(parsedTimelinesFromFileSystem, prepackagedTimelines);
      const timelinesToUpdate = (0, _get_timelines_to_update.getTimelinesToUpdate)(parsedTimelinesFromFileSystem, prepackagedTimelines);
      return Promise.resolve({
        timelinesToInstall,
        timelinesToUpdate,
        prepackagedTimelines
      });
    } else {
      return Promise.reject(new Error('load timeline error'));
    }
  }, 'utf-8');
};

exports.checkTimelinesStatus = checkTimelinesStatus;