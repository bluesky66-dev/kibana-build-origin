"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createErrorFromShardFailure = exports.createAsyncRequestRTs = exports.jsonFromBase64StringRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

var _jsonStableStringify = _interopRequireDefault(require("json-stable-stringify"));

var _typed_json = require("../../common/typed_json");

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


const jsonFromBase64StringRT = new rt.Type('JSONFromBase64String', _typed_json.jsonValueRT.is, (value, context) => {
  try {
    return rt.success(JSON.parse(Buffer.from(value, 'base64').toString()));
  } catch (error) {
    return rt.failure(error, context);
  }
}, a => Buffer.from((0, _jsonStableStringify.default)(a)).toString('base64'));
exports.jsonFromBase64StringRT = jsonFromBase64StringRT;

const createAsyncRequestRTs = (stateCodec, paramsCodec) => {
  const asyncRecoveredRequestRT = rt.type({
    id: stateCodec,
    params: paramsCodec
  });
  const asyncInitialRequestRT = rt.type({
    id: rt.undefined,
    params: paramsCodec
  });
  const asyncRequestRT = rt.union([asyncRecoveredRequestRT, asyncInitialRequestRT]);
  return {
    asyncInitialRequestRT,
    asyncRecoveredRequestRT,
    asyncRequestRT
  };
};

exports.createAsyncRequestRTs = createAsyncRequestRTs;

const createErrorFromShardFailure = failure => ({
  type: 'shardFailure',
  shardInfo: {
    index: failure.index,
    node: failure.node,
    shard: failure.shard
  },
  message: failure.reason.reason
});

exports.createErrorFromShardFailure = createErrorFromShardFailure;