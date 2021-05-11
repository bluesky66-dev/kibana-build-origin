"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startTracingSpan = exports.tracingSpanRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _uuid = _interopRequireDefault(require("uuid"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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


const tracingSpanRT = rt.type({
  duration: rt.number,
  id: rt.string,
  name: rt.string,
  start: rt.number
});
exports.tracingSpanRT = tracingSpanRT;

const startTracingSpan = name => {
  const initialState = {
    duration: Number.POSITIVE_INFINITY,
    id: _uuid.default.v4(),
    name,
    start: Date.now()
  };
  return (endTime = Date.now()) => ({ ...initialState,
    duration: endTime - initialState.start
  });
};

exports.startTracingSpan = startTracingSpan;