"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.areaChart = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const areaChart = () => ({
  name: 'areaChart',
  displayName: 'Area',
  help: 'A line chart with a filled body',
  type: 'chart',
  icon: 'visArea',
  expression: `filters
  | demodata
  | pointseries x="time" y="mean(price)"
  | plot defaultStyle={seriesStyle lines=1 fill=1}
  | render`
});

exports.areaChart = areaChart;