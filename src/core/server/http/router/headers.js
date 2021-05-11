"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterHeaders = filterHeaders;

var _std = require("@kbn/std");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const normalizeHeaderField = field => field.trim().toLowerCase();

function filterHeaders(headers, fieldsToKeep, fieldsToExclude = []) {
  const fieldsToExcludeNormalized = fieldsToExclude.map(normalizeHeaderField); // Normalize list of headers we want to allow in upstream request

  const fieldsToKeepNormalized = fieldsToKeep.map(normalizeHeaderField).filter(name => !fieldsToExcludeNormalized.includes(name));
  return (0, _std.pick)(headers, fieldsToKeepNormalized);
}