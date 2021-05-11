"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pie = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const pie = () => ({
  name: 'pie',
  displayName: 'Pie',
  type: 'chart',
  width: 300,
  height: 300,
  help: 'A simple pie chart',
  icon: 'visPie',
  expression: `filters
| demodata
| pointseries color="state" size="max(price)"
| pie
| render`
});

exports.pie = pie;