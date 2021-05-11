"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPackagePolicyWithManifestMock = exports.createPackagePolicyWithInitialManifestMock = exports.createPackagePolicyWithConfigMock = exports.toArtifactRecords = exports.getMockManifest = exports.getEmptyMockArtifacts = exports.getMockArtifactsWithDiff = exports.getMockArtifacts = void 0;

var _lodash = require("lodash");

var _mocks = require("../../../../../fleet/common/mocks");

var _saved_objects = require("../../schemas/artifacts/saved_objects.mock");

var _common = require("./common");

var _manifest = require("./manifest");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getMockArtifacts = async opts => {
  return Promise.all([// Exceptions items
  ..._common.ArtifactConstants.SUPPORTED_OPERATING_SYSTEMS.map(async os => {
    return (0, _saved_objects.getInternalArtifactMock)(os, 'v1', opts);
  }), // Trusted Apps items
  ..._common.ArtifactConstants.SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS.map(async os => {
    return (0, _saved_objects.getInternalArtifactMock)(os, 'v1', opts, _common.ArtifactConstants.GLOBAL_TRUSTED_APPS_NAME);
  })]);
};

exports.getMockArtifacts = getMockArtifacts;

const getMockArtifactsWithDiff = async opts => {
  return Promise.all(_common.ArtifactConstants.SUPPORTED_OPERATING_SYSTEMS.map(async os => {
    if (os === 'macos') {
      return (0, _saved_objects.getInternalArtifactMockWithDiffs)(os, 'v1');
    }

    return (0, _saved_objects.getInternalArtifactMock)(os, 'v1', opts);
  }));
};

exports.getMockArtifactsWithDiff = getMockArtifactsWithDiff;

const getEmptyMockArtifacts = async opts => {
  return Promise.all(_common.ArtifactConstants.SUPPORTED_OPERATING_SYSTEMS.map(async os => {
    return (0, _saved_objects.getEmptyInternalArtifactMock)(os, 'v1', opts);
  }));
};

exports.getEmptyMockArtifacts = getEmptyMockArtifacts;

const getMockManifest = async opts => {
  const manifest = new _manifest.Manifest();
  const artifacts = await getMockArtifacts(opts);
  artifacts.forEach(artifact => manifest.addEntry(artifact));
  return manifest;
};

exports.getMockManifest = getMockManifest;

const toArtifactRecord = (artifactName, artifact) => ({
  compression_algorithm: artifact.compressionAlgorithm,
  decoded_sha256: artifact.decodedSha256,
  decoded_size: artifact.decodedSize,
  encoded_sha256: artifact.encodedSha256,
  encoded_size: artifact.encodedSize,
  encryption_algorithm: artifact.encryptionAlgorithm,
  relative_url: `/api/endpoint/artifacts/download/${artifactName}/${artifact.decodedSha256}`
});

const toArtifactRecords = artifacts => (0, _lodash.mapValues)(artifacts, (artifact, key) => toArtifactRecord(key, artifact));

exports.toArtifactRecords = toArtifactRecords;

const createPackagePolicyWithConfigMock = options => {
  const {
    config,
    ...packagePolicyOverrides
  } = options;
  const packagePolicy = (0, _mocks.createPackagePolicyMock)();
  packagePolicy.inputs[0].config = options.config;
  return { ...packagePolicy,
    ...packagePolicyOverrides
  };
};

exports.createPackagePolicyWithConfigMock = createPackagePolicyWithConfigMock;

const createPackagePolicyWithInitialManifestMock = () => {
  return createPackagePolicyWithConfigMock({
    config: {
      artifact_manifest: {
        value: {
          artifacts: {
            'endpoint-exceptionlist-macos-v1': {
              compression_algorithm: 'zlib',
              encryption_algorithm: 'none',
              decoded_sha256: 'd801aa1fb7ddcc330a5e3173372ea6af4a3d08ec58074478e85aa5603e926658',
              encoded_sha256: 'f8e6afa1d5662f5b37f83337af774b5785b5b7f1daee08b7b00c2d6813874cda',
              decoded_size: 14,
              encoded_size: 22,
              relative_url: '/api/endpoint/artifacts/download/endpoint-exceptionlist-macos-v1/d801aa1fb7ddcc330a5e3173372ea6af4a3d08ec58074478e85aa5603e926658'
            },
            'endpoint-exceptionlist-windows-v1': {
              compression_algorithm: 'zlib',
              encryption_algorithm: 'none',
              decoded_sha256: 'd801aa1fb7ddcc330a5e3173372ea6af4a3d08ec58074478e85aa5603e926658',
              encoded_sha256: 'f8e6afa1d5662f5b37f83337af774b5785b5b7f1daee08b7b00c2d6813874cda',
              decoded_size: 14,
              encoded_size: 22,
              relative_url: '/api/endpoint/artifacts/download/endpoint-exceptionlist-windows-v1/d801aa1fb7ddcc330a5e3173372ea6af4a3d08ec58074478e85aa5603e926658'
            }
          },
          manifest_version: '1.0.0',
          schema_version: 'v1'
        }
      }
    }
  });
};

exports.createPackagePolicyWithInitialManifestMock = createPackagePolicyWithInitialManifestMock;

const createPackagePolicyWithManifestMock = () => {
  return createPackagePolicyWithConfigMock({
    config: {
      artifact_manifest: {
        value: {
          artifacts: {
            'endpoint-exceptionlist-macos-v1': {
              compression_algorithm: 'zlib',
              encryption_algorithm: 'none',
              decoded_sha256: '96b76a1a911662053a1562ac14c4ff1e87c2ff550d6fe52e1e0b3790526597d3',
              encoded_sha256: '975382ab55d019cbab0bbac207a54e2a7d489fad6e8f6de34fc6402e5ef37b1e',
              decoded_size: 432,
              encoded_size: 147,
              relative_url: '/api/endpoint/artifacts/download/endpoint-exceptionlist-macos-v1/96b76a1a911662053a1562ac14c4ff1e87c2ff550d6fe52e1e0b3790526597d3'
            },
            'endpoint-exceptionlist-windows-v1': {
              compression_algorithm: 'zlib',
              encryption_algorithm: 'none',
              decoded_sha256: '96b76a1a911662053a1562ac14c4ff1e87c2ff550d6fe52e1e0b3790526597d3',
              encoded_sha256: '975382ab55d019cbab0bbac207a54e2a7d489fad6e8f6de34fc6402e5ef37b1e',
              decoded_size: 432,
              encoded_size: 147,
              relative_url: '/api/endpoint/artifacts/download/endpoint-exceptionlist-windows-v1/96b76a1a911662053a1562ac14c4ff1e87c2ff550d6fe52e1e0b3790526597d3'
            }
          },
          manifest_version: '1.0.1',
          schema_version: 'v1'
        }
      }
    }
  });
};

exports.createPackagePolicyWithManifestMock = createPackagePolicyWithManifestMock;