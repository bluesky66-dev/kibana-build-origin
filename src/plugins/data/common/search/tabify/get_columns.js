"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tabifyGetColumns = tabifyGetColumns;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getColumn = (agg, i) => {
  let name = '';

  try {
    name = agg.makeLabel();
  } catch (e) {// skip the case when makeLabel throws an error (e.x. no appropriate field for an aggregation)
  }

  return {
    aggConfig: agg,
    id: `col-${i}-${agg.id}`,
    name
  };
};
/**
 * Builds tabify columns.
 *
 * @param {AggConfigs} aggs - the agg configs object to which the aggregation response correlates
 * @param {boolean} minimalColumns - setting to true will only return a column for the last bucket/metric instead of one for each level
 */


function tabifyGetColumns(aggs, minimalColumns) {
  // pick the columns
  if (minimalColumns) {
    return aggs.map((agg, i) => getColumn(agg, i));
  } // supposed to be bucket,...metrics,bucket,...metrics


  const columns = []; // separate the metrics

  const grouped = (0, _lodash.groupBy)(aggs, agg => {
    return agg.type.type;
  });

  if (!grouped.buckets) {
    // return just the metrics, in column format
    return grouped.metrics.map((agg, i) => getColumn(agg, i));
  }

  let columnIndex = 0; // return the buckets, and after each place all of the metrics

  grouped.buckets.forEach(agg => {
    columns.push(getColumn(agg, columnIndex++));
    grouped.metrics.forEach(metric => {
      columns.push(getColumn(metric, columnIndex++));
    });
  });
  return columns;
}