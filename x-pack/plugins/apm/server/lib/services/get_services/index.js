"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServices = getServices;

var _lodash = require("lodash");

var _with_apm_span = require("../../../utils/with_apm_span");

var _get_legacy_data_status = require("./get_legacy_data_status");

var _get_services_items = require("./get_services_items");

var _has_historical_agent_data = require("./has_historical_agent_data");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getServices({
  environment,
  setup,
  searchAggregatedTransactions,
  logger
}) {
  return (0, _with_apm_span.withApmSpan)('get_services', async () => {
    const [items, hasLegacyData] = await Promise.all([(0, _get_services_items.getServicesItems)({
      environment,
      setup,
      searchAggregatedTransactions,
      logger
    }), (0, _get_legacy_data_status.getLegacyDataStatus)(setup)]);
    const noDataInCurrentTimeRange = (0, _lodash.isEmpty)(items);
    const hasHistoricalData = noDataInCurrentTimeRange ? await (0, _has_historical_agent_data.hasHistoricalAgentData)(setup) : true;
    return {
      items,
      hasHistoricalData,
      hasLegacyData
    };
  });
}