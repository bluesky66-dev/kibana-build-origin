"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThreatSignals = void 0;

var _chunk = _interopRequireDefault(require("lodash/fp/chunk"));

var _get_threat_list = require("./get_threat_list");

var _create_threat_signal = require("./create_threat_signal");

var _utils = require("./utils");

var _build_threat_enrichment = require("./build_threat_enrichment");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createThreatSignals = async ({
  tuples,
  threatMapping,
  query,
  inputIndex,
  type,
  filters,
  language,
  savedId,
  services,
  exceptionItems,
  listClient,
  logger,
  eventsTelemetry,
  alertId,
  outputIndex,
  params,
  searchAfterSize,
  actions,
  createdBy,
  createdAt,
  updatedBy,
  interval,
  updatedAt,
  enabled,
  refresh,
  tags,
  throttle,
  threatFilters,
  threatQuery,
  threatLanguage,
  buildRuleMessage,
  threatIndex,
  threatIndicatorPath,
  name,
  concurrentSearches,
  itemsPerSearch
}) => {
  logger.debug(buildRuleMessage('Indicator matching rule starting'));
  const perPage = concurrentSearches * itemsPerSearch;
  let results = {
    success: true,
    bulkCreateTimes: [],
    searchAfterTimes: [],
    lastLookBackDate: null,
    createdSignalsCount: 0,
    createdSignals: [],
    errors: []
  };
  let threatListCount = await (0, _get_threat_list.getThreatListCount)({
    callCluster: services.callCluster,
    exceptionItems,
    threatFilters,
    query: threatQuery,
    language: threatLanguage,
    index: threatIndex
  });
  logger.debug(buildRuleMessage(`Total indicator items: ${threatListCount}`));
  let threatList = await (0, _get_threat_list.getThreatList)({
    callCluster: services.callCluster,
    exceptionItems,
    threatFilters,
    query: threatQuery,
    language: threatLanguage,
    index: threatIndex,
    listClient,
    searchAfter: undefined,
    sortField: undefined,
    sortOrder: undefined,
    logger,
    buildRuleMessage,
    perPage
  });
  const threatEnrichment = (0, _build_threat_enrichment.buildThreatEnrichment)({
    buildRuleMessage,
    exceptionItems,
    listClient,
    logger,
    services,
    threatFilters,
    threatIndex,
    threatIndicatorPath,
    threatLanguage,
    threatQuery
  });

  while (threatList.hits.hits.length !== 0) {
    const chunks = (0, _chunk.default)(itemsPerSearch, threatList.hits.hits);
    logger.debug(buildRuleMessage(`${chunks.length} concurrent indicator searches are starting.`));
    const concurrentSearchesPerformed = chunks.map(slicedChunk => (0, _create_threat_signal.createThreatSignal)({
      tuples,
      threatEnrichment,
      threatMapping,
      query,
      inputIndex,
      type,
      filters,
      language,
      savedId,
      services,
      exceptionItems,
      listClient,
      logger,
      eventsTelemetry,
      alertId,
      outputIndex,
      params,
      searchAfterSize,
      actions,
      createdBy,
      createdAt,
      updatedBy,
      updatedAt,
      interval,
      enabled,
      tags,
      refresh,
      throttle,
      buildRuleMessage,
      name,
      currentThreatList: slicedChunk,
      currentResult: results
    }));
    const searchesPerformed = await Promise.all(concurrentSearchesPerformed);
    results = (0, _utils.combineConcurrentResults)(results, searchesPerformed);
    threatListCount -= threatList.hits.hits.length;
    logger.debug(buildRuleMessage(`Concurrent indicator match searches completed with ${results.createdSignalsCount} signals found`, `search times of ${results.searchAfterTimes}ms,`, `bulk create times ${results.bulkCreateTimes}ms,`, `all successes are ${results.success}`));

    if (results.createdSignalsCount >= params.maxSignals) {
      logger.debug(buildRuleMessage(`Indicator match has reached its max signals count ${params.maxSignals}. Additional indicator items not checked are ${threatListCount}`));
      break;
    }

    logger.debug(buildRuleMessage(`Indicator items left to check are ${threatListCount}`));
    threatList = await (0, _get_threat_list.getThreatList)({
      callCluster: services.callCluster,
      exceptionItems,
      query: threatQuery,
      language: threatLanguage,
      threatFilters,
      index: threatIndex,
      searchAfter: threatList.hits.hits[threatList.hits.hits.length - 1].sort,
      sortField: undefined,
      sortOrder: undefined,
      listClient,
      buildRuleMessage,
      logger,
      perPage
    });
  }

  logger.debug(buildRuleMessage('Indicator matching rule has completed'));
  return results;
};

exports.createThreatSignals = createThreatSignals;