"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coreUsageStatsType = void 0;

var _constants = require("./constants");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
const coreUsageStatsType = {
  name: _constants.CORE_USAGE_STATS_TYPE,
  hidden: true,
  namespaceType: 'agnostic',
  mappings: {
    dynamic: false,
    // we aren't querying or aggregating over this data, so we don't need to specify any fields
    properties: {}
  }
};
exports.coreUsageStatsType = coreUsageStatsType;