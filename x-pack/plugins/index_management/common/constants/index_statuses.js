"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INDEX_CLEARING_CACHE = exports.INDEX_MERGING = exports.INDEX_FORCEMERGING = exports.INDEX_FLUSHING = exports.INDEX_REFRESHING = exports.INDEX_OPENING = exports.INDEX_CLOSING = exports.INDEX_OPEN = exports.INDEX_CLOSED = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INDEX_CLOSED = 'close';
exports.INDEX_CLOSED = INDEX_CLOSED;
const INDEX_OPEN = 'open';
exports.INDEX_OPEN = INDEX_OPEN;
const INDEX_CLOSING = 'closing';
exports.INDEX_CLOSING = INDEX_CLOSING;
const INDEX_OPENING = 'opening';
exports.INDEX_OPENING = INDEX_OPENING;
const INDEX_REFRESHING = 'refreshing';
exports.INDEX_REFRESHING = INDEX_REFRESHING;
const INDEX_FLUSHING = 'flushing';
exports.INDEX_FLUSHING = INDEX_FLUSHING;
const INDEX_FORCEMERGING = 'forcemerging';
exports.INDEX_FORCEMERGING = INDEX_FORCEMERGING;
const INDEX_MERGING = 'merging';
exports.INDEX_MERGING = INDEX_MERGING;
const INDEX_CLEARING_CACHE = 'clearing cache';
exports.INDEX_CLEARING_CACHE = INDEX_CLEARING_CACHE;