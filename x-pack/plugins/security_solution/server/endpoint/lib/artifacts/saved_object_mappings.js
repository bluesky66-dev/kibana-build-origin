"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.manifestType = exports.exceptionsArtifactType = exports.manifestSavedObjectMappings = exports.exceptionsArtifactSavedObjectMappings = exports.manifestSavedObjectType = exports.exceptionsArtifactSavedObjectType = void 0;

var _common = require("./common");

var _migrations = require("./migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exceptionsArtifactSavedObjectType = _common.ArtifactConstants.SAVED_OBJECT_TYPE;
exports.exceptionsArtifactSavedObjectType = exceptionsArtifactSavedObjectType;
const manifestSavedObjectType = _common.ManifestConstants.SAVED_OBJECT_TYPE;
exports.manifestSavedObjectType = manifestSavedObjectType;
const exceptionsArtifactSavedObjectMappings = {
  properties: {
    identifier: {
      type: 'keyword'
    },
    compressionAlgorithm: {
      type: 'keyword',
      index: false
    },
    encryptionAlgorithm: {
      type: 'keyword',
      index: false
    },
    encodedSha256: {
      type: 'keyword'
    },
    encodedSize: {
      type: 'long',
      index: false
    },
    decodedSha256: {
      type: 'keyword',
      index: false
    },
    decodedSize: {
      type: 'long',
      index: false
    },
    created: {
      type: 'date',
      index: false
    },
    body: {
      type: 'binary'
    }
  }
};
exports.exceptionsArtifactSavedObjectMappings = exceptionsArtifactSavedObjectMappings;
const manifestSavedObjectMappings = {
  properties: {
    created: {
      type: 'date',
      index: false
    },
    schemaVersion: {
      type: 'keyword'
    },
    semanticVersion: {
      type: 'keyword',
      index: false
    },
    artifacts: {
      type: 'nested',
      properties: {
        policyId: {
          type: 'keyword',
          index: false
        },
        artifactId: {
          type: 'keyword',
          index: false
        }
      }
    }
  }
};
exports.manifestSavedObjectMappings = manifestSavedObjectMappings;
const exceptionsArtifactType = {
  name: exceptionsArtifactSavedObjectType,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: exceptionsArtifactSavedObjectMappings
};
exports.exceptionsArtifactType = exceptionsArtifactType;
const manifestType = {
  name: manifestSavedObjectType,
  hidden: false,
  namespaceType: 'agnostic',
  mappings: manifestSavedObjectMappings,
  migrations: _migrations.migrations
};
exports.manifestType = manifestType;