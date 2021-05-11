"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installPrepackagedTimelines = void 0;

var _path = _interopRequireWildcard(require("path"));

var _stream = require("stream");

var _import_timelines = require("./import_timelines");

var _common = require("./common");

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


const installPrepackagedTimelines = async (maxTimelineImportExportSize, frameworkRequest, isImmutable, filePath, fileName) => {
  let readStream;
  const dir = (0, _path.resolve)((0, _path.join)(__dirname, filePath !== null && filePath !== void 0 ? filePath : '../../../detection_engine/rules/prepackaged_timelines'));
  const file = fileName !== null && fileName !== void 0 ? fileName : 'index.ndjson';

  const dataPath = _path.default.join(dir, file);

  try {
    readStream = await (0, _common.getReadables)(dataPath);
  } catch (err) {
    return {
      success: false,
      success_count: 0,
      timelines_installed: 0,
      timelines_updated: 0,
      errors: [{
        error: {
          message: `read prepackaged timelines error: ${err.message}`,
          status_code: 500
        }
      }]
    };
  }

  return (0, _common.loadData)(readStream, docs => docs instanceof _stream.Readable ? (0, _import_timelines.importTimelines)(docs, maxTimelineImportExportSize, frameworkRequest, isImmutable) : Promise.reject(new Error(`read prepackaged timelines error`)));
};

exports.installPrepackagedTimelines = installPrepackagedTimelines;