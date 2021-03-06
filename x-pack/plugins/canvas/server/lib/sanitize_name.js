"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sanitizeName = sanitizeName;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function sanitizeName(name) {
  // invalid characters
  const invalid = ['(', ')'];
  const pattern = invalid.map(v => escapeRegExp(v)).join('|');
  const regex = new RegExp(pattern, 'g');
  return name.replace(regex, '_');
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}