"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LEGACY_CHARTS_LIBRARY = exports.ChartType = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Type of charts able to render
 */
const ChartType = Object.freeze({
  Line: 'line',
  Area: 'area',
  Histogram: 'histogram'
});
exports.ChartType = ChartType;
const LEGACY_CHARTS_LIBRARY = 'visualization:visualize:legacyChartsLibrary';
exports.LEGACY_CHARTS_LIBRARY = LEGACY_CHARTS_LIBRARY;