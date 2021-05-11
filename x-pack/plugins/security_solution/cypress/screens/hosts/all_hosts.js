"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HOSTS_NAMES_DRAGGABLE = exports.HOSTS_NAMES = exports.ALL_HOSTS_TABLE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const ALL_HOSTS_TABLE = '[data-test-subj="table-allHosts-loading-false"]';
exports.ALL_HOSTS_TABLE = ALL_HOSTS_TABLE;
const HOSTS_NAMES = '[data-test-subj="draggable-content-host.name"] a.euiLink';
exports.HOSTS_NAMES = HOSTS_NAMES;
const HOSTS_NAMES_DRAGGABLE = '[data-test-subj="draggable-content-host.name"]';
exports.HOSTS_NAMES_DRAGGABLE = HOSTS_NAMES_DRAGGABLE;