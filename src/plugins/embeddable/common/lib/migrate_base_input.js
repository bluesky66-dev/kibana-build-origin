"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.baseEmbeddableMigrations = exports.injectBaseEmbeddableInput = exports.extractBaseEmbeddableInput = exports.telemetryBaseEmbeddableInput = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const telemetryBaseEmbeddableInput = (state, telemetryData) => {
  return telemetryData;
};

exports.telemetryBaseEmbeddableInput = telemetryBaseEmbeddableInput;

const extractBaseEmbeddableInput = state => {
  return {
    state,
    references: []
  };
};

exports.extractBaseEmbeddableInput = extractBaseEmbeddableInput;

const injectBaseEmbeddableInput = (state, references) => {
  return state;
};

exports.injectBaseEmbeddableInput = injectBaseEmbeddableInput;
const baseEmbeddableMigrations = {};
exports.baseEmbeddableMigrations = baseEmbeddableMigrations;