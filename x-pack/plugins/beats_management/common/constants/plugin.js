"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MANAGEMENT_SECTION = exports.CONFIG_PREFIX = exports.PLUGIN = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN = {
  ID: 'beats_management'
};
exports.PLUGIN = PLUGIN;
const CONFIG_PREFIX = 'xpack.beats';
exports.CONFIG_PREFIX = CONFIG_PREFIX;
const MANAGEMENT_SECTION = 'beats_management';
exports.MANAGEMENT_SECTION = MANAGEMENT_SECTION;