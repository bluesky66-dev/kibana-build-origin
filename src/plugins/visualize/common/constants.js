"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GLOBAL_STATE_STORAGE_KEY = exports.STATE_STORAGE_KEY = exports.AGGS_TERMS_SIZE_SETTING = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const AGGS_TERMS_SIZE_SETTING = 'discover:aggs:terms:size';
exports.AGGS_TERMS_SIZE_SETTING = AGGS_TERMS_SIZE_SETTING;
const STATE_STORAGE_KEY = '_a';
exports.STATE_STORAGE_KEY = STATE_STORAGE_KEY;
const GLOBAL_STATE_STORAGE_KEY = '_g';
exports.GLOBAL_STATE_STORAGE_KEY = GLOBAL_STATE_STORAGE_KEY;