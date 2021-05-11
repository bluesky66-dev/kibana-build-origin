"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.table = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const table = () => ({
  name: 'table',
  displayName: 'Data table',
  type: 'chart',
  help: 'A scrollable grid for displaying data in a tabular format',
  icon: 'visTable',
  expression: `filters
| demodata
| table
| render`
});

exports.table = table;