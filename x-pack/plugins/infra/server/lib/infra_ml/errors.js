"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isMlPrivilegesError = exports.InsufficientAnomalyMlJobsConfigured = exports.UnknownCategoryError = exports.InsufficientLogAnalysisMlJobConfigurationError = exports.NoLogAnalysisMlJobError = void 0;

var _server = require("../../../../ml/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */


class NoLogAnalysisMlJobError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.NoLogAnalysisMlJobError = NoLogAnalysisMlJobError;

class InsufficientLogAnalysisMlJobConfigurationError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.InsufficientLogAnalysisMlJobConfigurationError = InsufficientLogAnalysisMlJobConfigurationError;

class UnknownCategoryError extends Error {
  constructor(categoryId) {
    super(`Unknown ml category ${categoryId}`);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.UnknownCategoryError = UnknownCategoryError;

class InsufficientAnomalyMlJobsConfigured extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.InsufficientAnomalyMlJobsConfigured = InsufficientAnomalyMlJobsConfigured;

const isMlPrivilegesError = error => {
  return error instanceof _server.UnknownMLCapabilitiesError || error instanceof _server.InsufficientMLCapabilities || error instanceof _server.MLPrivilegesUninitialized;
};

exports.isMlPrivilegesError = isMlPrivilegesError;