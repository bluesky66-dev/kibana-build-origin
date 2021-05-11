"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWorkspacePath = createWorkspacePath;
exports.APP_ICON = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const APP_ICON = 'graphApp';
exports.APP_ICON = APP_ICON;

function createWorkspacePath(id) {
  return `/app/graph#/workspace/${id}`;
}