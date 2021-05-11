"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INVALID_TEMPLATE_NAME_CHARS = exports.INVALID_INDEX_PATTERN_CHARS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INVALID_INDEX_PATTERN_CHARS = ['\\', '/', '?', '"', '<', '>', '|'];
exports.INVALID_INDEX_PATTERN_CHARS = INVALID_INDEX_PATTERN_CHARS;
const INVALID_TEMPLATE_NAME_CHARS = ['"', '*', '\\', ',', '?'];
exports.INVALID_TEMPLATE_NAME_CHARS = INVALID_TEMPLATE_NAME_CHARS;