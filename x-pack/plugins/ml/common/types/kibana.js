"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSavedSearchSavedObject = isSavedSearchSavedObject;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// custom edits or fixes for default kibana types which are incomplete
// TODO define saved object type

function isSavedSearchSavedObject(ss) {
  return ss !== null;
}