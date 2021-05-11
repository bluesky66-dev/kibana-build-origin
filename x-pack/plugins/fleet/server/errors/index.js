"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "defaultIngestErrorHandler", {
  enumerable: true,
  get: function () {
    return _handlers.defaultIngestErrorHandler;
  }
});
Object.defineProperty(exports, "ingestErrorToResponseOptions", {
  enumerable: true,
  get: function () {
    return _handlers.ingestErrorToResponseOptions;
  }
});
Object.defineProperty(exports, "isLegacyESClientError", {
  enumerable: true,
  get: function () {
    return _handlers.isLegacyESClientError;
  }
});
Object.defineProperty(exports, "isESClientError", {
  enumerable: true,
  get: function () {
    return _handlers.isESClientError;
  }
});
exports.AgentPolicyDeletionError = exports.AgentUnenrollmentError = exports.AgentReassignmentError = exports.ConcurrentInstallOperationError = exports.FleetAdminUserInvalidError = exports.PackageOperationNotSupportedError = exports.PackageCacheError = exports.PackageInvalidArchiveError = exports.PackageUnsupportedMediaTypeError = exports.AgentPolicyNameExistsError = exports.AgentPolicyError = exports.PackageOutdatedError = exports.PackageNotFoundError = exports.RegistryResponseError = exports.RegistryConnectionError = exports.RegistryError = exports.IngestManagerError = void 0;

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */


class IngestManagerError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name; // for stack traces
  }

}

exports.IngestManagerError = IngestManagerError;

class RegistryError extends IngestManagerError {}

exports.RegistryError = RegistryError;

class RegistryConnectionError extends RegistryError {}

exports.RegistryConnectionError = RegistryConnectionError;

class RegistryResponseError extends RegistryError {}

exports.RegistryResponseError = RegistryResponseError;

class PackageNotFoundError extends IngestManagerError {}

exports.PackageNotFoundError = PackageNotFoundError;

class PackageOutdatedError extends IngestManagerError {}

exports.PackageOutdatedError = PackageOutdatedError;

class AgentPolicyError extends IngestManagerError {}

exports.AgentPolicyError = AgentPolicyError;

class AgentPolicyNameExistsError extends AgentPolicyError {}

exports.AgentPolicyNameExistsError = AgentPolicyNameExistsError;

class PackageUnsupportedMediaTypeError extends IngestManagerError {}

exports.PackageUnsupportedMediaTypeError = PackageUnsupportedMediaTypeError;

class PackageInvalidArchiveError extends IngestManagerError {}

exports.PackageInvalidArchiveError = PackageInvalidArchiveError;

class PackageCacheError extends IngestManagerError {}

exports.PackageCacheError = PackageCacheError;

class PackageOperationNotSupportedError extends IngestManagerError {}

exports.PackageOperationNotSupportedError = PackageOperationNotSupportedError;

class FleetAdminUserInvalidError extends IngestManagerError {}

exports.FleetAdminUserInvalidError = FleetAdminUserInvalidError;

class ConcurrentInstallOperationError extends IngestManagerError {}

exports.ConcurrentInstallOperationError = ConcurrentInstallOperationError;

class AgentReassignmentError extends IngestManagerError {}

exports.AgentReassignmentError = AgentReassignmentError;

class AgentUnenrollmentError extends IngestManagerError {}

exports.AgentUnenrollmentError = AgentUnenrollmentError;

class AgentPolicyDeletionError extends IngestManagerError {}

exports.AgentPolicyDeletionError = AgentPolicyDeletionError;