"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPanelData = getPanelData;

var _get_table_data = require("./get_table_data");

var _get_series_data = require("./get_series_data");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getPanelData(req) {
  return panel => {
    if (panel.type === 'table') {
      return (0, _get_table_data.getTableData)(req, panel);
    }

    return (0, _get_series_data.getSeriesData)(req, panel);
  };
}