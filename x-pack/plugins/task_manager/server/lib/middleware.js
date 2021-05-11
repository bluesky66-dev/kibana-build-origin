"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addMiddlewareToChain = addMiddlewareToChain;
exports.createInitialMiddleware = createInitialMiddleware;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function addMiddlewareToChain(prev, next) {
  return {
    beforeSave: next.beforeSave ? chain(prev.beforeSave, next.beforeSave) : prev.beforeSave,
    beforeRun: next.beforeRun ? chain(prev.beforeRun, next.beforeRun) : prev.beforeRun,
    beforeMarkRunning: next.beforeMarkRunning ? chain(prev.beforeMarkRunning, next.beforeMarkRunning) : prev.beforeMarkRunning
  };
}

const chain = (prev, next) => params => next(params).then(prev);

function createInitialMiddleware() {
  return {
    beforeSave: async saveOpts => saveOpts,
    beforeRun: async runOpts => runOpts,
    beforeMarkRunning: async runOpts => runOpts
  };
}