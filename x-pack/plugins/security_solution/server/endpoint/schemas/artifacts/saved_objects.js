"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internalManifestCreateSchema = exports.internalManifestSchema = exports.internalManifestEntrySchema = exports.internalArtifactCreateSchema = exports.internalArtifactCompleteSchema = exports.internalArtifactSchema = exports.internalArtifactAdditionalFields = exports.internalArtifactRecordSchema = exports.body = void 0;

var t = _interopRequireWildcard(require("io-ts"));

var _common = require("../../../../common/endpoint/schema/common");

var _common2 = require("./common");

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


const body = t.string; // base64

exports.body = body;
const internalArtifactRecordSchema = t.exact(t.type({
  identifier: _common.identifier,
  compressionAlgorithm: _common.compressionAlgorithm,
  encryptionAlgorithm: _common.encryptionAlgorithm,
  decodedSha256: _common.sha256,
  decodedSize: _common.size,
  encodedSha256: _common.sha256,
  encodedSize: _common.size
}));
exports.internalArtifactRecordSchema = internalArtifactRecordSchema;
const internalArtifactAdditionalFields = {
  body
};
exports.internalArtifactAdditionalFields = internalArtifactAdditionalFields;
const internalArtifactSchema = t.intersection([internalArtifactRecordSchema, t.partial(internalArtifactAdditionalFields)]);
exports.internalArtifactSchema = internalArtifactSchema;
const internalArtifactCompleteSchema = t.intersection([internalArtifactRecordSchema, t.exact(t.type(internalArtifactAdditionalFields))]);
exports.internalArtifactCompleteSchema = internalArtifactCompleteSchema;
const internalArtifactCreateSchema = t.intersection([internalArtifactCompleteSchema, t.exact(t.type({
  created: _common2.created
}))]);
exports.internalArtifactCreateSchema = internalArtifactCreateSchema;
const internalManifestEntrySchema = t.exact(t.type({
  policyId: t.union([_common.identifier, t.undefined]),
  artifactId: _common.identifier
}));
exports.internalManifestEntrySchema = internalManifestEntrySchema;
const internalManifestSchema = t.exact(t.type({
  artifacts: t.array(internalManifestEntrySchema),
  schemaVersion: _common.manifestSchemaVersion,
  semanticVersion: _common.semanticVersion
}));
exports.internalManifestSchema = internalManifestSchema;
const internalManifestCreateSchema = t.intersection([internalManifestSchema, t.exact(t.type({
  created: _common2.created
}))]);
exports.internalManifestCreateSchema = internalManifestCreateSchema;