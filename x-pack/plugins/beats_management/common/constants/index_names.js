"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.POLICY_NAMES = exports.INDEX_NAMES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const INDEX_NAMES = {
  BEATS: '.management-beats',
  EVENTS: '.management-beats-events-*',
  EVENTS_ALIAS: '.management-beats-events'
};
exports.INDEX_NAMES = INDEX_NAMES;
const POLICY_NAMES = {
  EVENTS: '.beats-management-events-retention'
};
exports.POLICY_NAMES = POLICY_NAMES;