"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reportErrors = exports.isCompleteArtifact = exports.getArtifactId = exports.ManifestConstants = exports.ArtifactConstants = void 0;

var _artifacts = require("../../schemas/artifacts");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ArtifactConstants = {
  GLOBAL_ALLOWLIST_NAME: 'endpoint-exceptionlist',
  SAVED_OBJECT_TYPE: 'endpoint:user-artifact',
  SUPPORTED_OPERATING_SYSTEMS: ['macos', 'windows'],
  SUPPORTED_TRUSTED_APPS_OPERATING_SYSTEMS: ['macos', 'windows', 'linux'],
  GLOBAL_TRUSTED_APPS_NAME: 'endpoint-trustlist'
};
exports.ArtifactConstants = ArtifactConstants;
const ManifestConstants = {
  SAVED_OBJECT_TYPE: 'endpoint:user-artifact-manifest'
};
exports.ManifestConstants = ManifestConstants;

const getArtifactId = artifact => {
  return `${artifact.identifier}-${artifact.decodedSha256}`;
};

exports.getArtifactId = getArtifactId;

const isCompleteArtifact = artifact => {
  return _artifacts.internalArtifactCompleteSchema.is(artifact);
};

exports.isCompleteArtifact = isCompleteArtifact;

const reportErrors = (logger, errors) => {
  errors.forEach(err => {
    logger.error(err);
  });
};

exports.reportErrors = reportErrors;