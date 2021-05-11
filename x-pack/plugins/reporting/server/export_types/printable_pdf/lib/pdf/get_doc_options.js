"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDocOptions = getDocOptions;
exports.REPORTING_TABLE_LAYOUT = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REPORTING_TABLE_LAYOUT = 'noBorder';
exports.REPORTING_TABLE_LAYOUT = REPORTING_TABLE_LAYOUT;

function getDocOptions(tableBorderWidth) {
  return {
    tableLayouts: {
      [REPORTING_TABLE_LAYOUT]: {
        // format is function (i, node) { ... };
        hLineWidth: () => 0,
        vLineWidth: () => 0,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0
      }
    }
  };
}