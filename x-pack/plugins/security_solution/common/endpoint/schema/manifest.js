"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manifestDispatchSchema = exports.manifestSchema = exports.manifestBaseSchema = exports.manifestEntryDispatchSchema = exports.manifestEntrySchema = exports.manifestEntryBaseSchema = void 0;

var t = _interopRequireWildcard(require("io-ts"));

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


const manifestEntryBaseSchema = t.exact(t.type({
  relative_url: _common.relativeUrl,
  decoded_sha256: _common.sha256,
  decoded_size: _common.size,
  encoded_sha256: _common.sha256,
  encoded_size: _common.size,
  encryption_algorithm: _common.encryptionAlgorithm
}));
exports.manifestEntryBaseSchema = manifestEntryBaseSchema;
const manifestEntrySchema = t.intersection([manifestEntryBaseSchema, t.exact(t.type({
  compression_algorithm: _common.compressionAlgorithm
}))]);
exports.manifestEntrySchema = manifestEntrySchema;
const manifestEntryDispatchSchema = t.intersection([manifestEntryBaseSchema, t.exact(t.type({
  compression_algorithm: _common.compressionAlgorithmDispatch
}))]);
exports.manifestEntryDispatchSchema = manifestEntryDispatchSchema;
const manifestBaseSchema = t.exact(t.type({
  manifest_version: _common.semanticVersion,
  schema_version: _common.manifestSchemaVersion
}));
exports.manifestBaseSchema = manifestBaseSchema;
const manifestSchema = t.intersection([manifestBaseSchema, t.exact(t.type({
  artifacts: t.record(_common.identifier, manifestEntrySchema)
}))]);
exports.manifestSchema = manifestSchema;
const manifestDispatchSchema = t.intersection([manifestBaseSchema, t.exact(t.type({
  artifacts: t.record(_common.identifier, manifestEntryDispatchSchema)
}))]);
exports.manifestDispatchSchema = manifestDispatchSchema;