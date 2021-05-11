"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MLPrivilegesUninitialized = exports.InsufficientMLCapabilities = exports.UnknownMLCapabilitiesError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class UnknownMLCapabilitiesError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.UnknownMLCapabilitiesError = UnknownMLCapabilitiesError;

class InsufficientMLCapabilities extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.InsufficientMLCapabilities = InsufficientMLCapabilities;

class MLPrivilegesUninitialized extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.MLPrivilegesUninitialized = MLPrivilegesUninitialized;