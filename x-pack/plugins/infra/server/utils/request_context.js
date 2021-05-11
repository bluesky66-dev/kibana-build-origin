"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assertHasInfraPlugins = assertHasInfraPlugins;
exports.assertHasInfraMlPlugins = assertHasInfraMlPlugins;
exports.NoMlPluginError = exports.MissingContextValuesError = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/* eslint-disable max-classes-per-file */

class MissingContextValuesError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.MissingContextValuesError = MissingContextValuesError;

class NoMlPluginError extends Error {
  constructor(message) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }

}

exports.NoMlPluginError = NoMlPluginError;

function assertHasInfraPlugins(context) {
  if (context.infra == null) {
    throw new MissingContextValuesError('Failed to access "infra" context values.');
  }
}

function assertHasInfraMlPlugins(context) {
  var _context$infra, _context$infra2;

  assertHasInfraPlugins(context);

  if (((_context$infra = context.infra) === null || _context$infra === void 0 ? void 0 : _context$infra.mlAnomalyDetectors) == null || ((_context$infra2 = context.infra) === null || _context$infra2 === void 0 ? void 0 : _context$infra2.mlSystem) == null) {
    throw new NoMlPluginError('Failed to access ML plugin.');
  }
}