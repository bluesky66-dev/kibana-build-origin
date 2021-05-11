"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeFilter = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const timeFilter = () => ({
  name: 'timeFilter',
  displayName: 'Time filter',
  type: 'filter',
  help: 'Set a time window',
  icon: 'calendar',
  height: 50,
  expression: `timefilterControl compact=true column=@timestamp
| render`,
  filter: 'timefilter column=@timestamp from=now-24h to=now'
});

exports.timeFilter = timeFilter;