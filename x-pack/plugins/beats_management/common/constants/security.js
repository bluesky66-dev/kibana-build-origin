"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LICENSES = exports.REQUIRED_LICENSES = exports.REQUIRED_ROLES = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REQUIRED_ROLES = ['beats_admin'];
exports.REQUIRED_ROLES = REQUIRED_ROLES;
const REQUIRED_LICENSES = ['standard', 'gold', 'trial', 'platinum', 'enterprise'];
exports.REQUIRED_LICENSES = REQUIRED_LICENSES;
const LICENSES = ['oss', 'basic', 'standard', 'gold', 'trial', 'platinum', 'enterprise'];
exports.LICENSES = LICENSES;