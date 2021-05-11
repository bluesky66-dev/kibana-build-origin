"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const debug = () => ({
  name: 'debug',
  displayName: 'Debug data',
  help: 'Just dumps the configuration of the element',
  icon: 'bug',
  expression: `demodata
| render as=debug`
});

exports.debug = debug;