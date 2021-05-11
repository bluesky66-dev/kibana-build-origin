"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getStats = getStats;

var _common = require("../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * Parse the response data into telemetry payload
 */
async function getStats(soClient) {
  const visualizations = await soClient.find({
    type: 'visualization',
    perPage: 10000
  });
  const tableVisualizations = visualizations.saved_objects.map(({
    attributes
  }) => JSON.parse(attributes.visState)).filter(({
    type
  }) => type === _common.VIS_TYPE_TABLE);
  const defaultStats = {
    total: tableVisualizations.length,
    total_split: 0,
    split_columns: {
      total: 0,
      enabled: 0
    },
    split_rows: {
      total: 0,
      enabled: 0
    }
  };
  return tableVisualizations.reduce((acc, {
    aggs,
    params
  }) => {
    const hasSplitAgg = aggs.find(agg => agg.schema === 'split');

    if (hasSplitAgg) {
      acc.total_split += 1;
      const isSplitRow = params.row;
      const isSplitEnabled = hasSplitAgg.enabled;
      const container = isSplitRow ? acc.split_rows : acc.split_columns;
      container.total += 1;
      container.enabled = isSplitEnabled ? container.enabled + 1 : container.enabled;
    }

    return acc;
  }, defaultStats);
}