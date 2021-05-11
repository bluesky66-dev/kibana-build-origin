"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThreatSignal = void 0;

var _build_threat_mapping_filter = require("./build_threat_mapping_filter");

var _get_filter = require("../get_filter");

var _search_after_bulk_create = require("../search_after_bulk_create");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createThreatSignal = async ({
  tuples,
  threatMapping,
  threatEnrichment,
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
  buildRuleMessage,
  name,
  currentThreatList,
  currentResult
}) => {
  const threatFilter = (0, _build_threat_mapping_filter.buildThreatMappingFilter)({
    threatMapping,
    threatList: currentThreatList
  });

  if (threatFilter.query.bool.should.length === 0) {
    // empty threat list and we do not want to return everything as being
    // a hit so opt to return the existing result.
    logger.debug(buildRuleMessage('Indicator items are empty after filtering for missing data, returning without attempting a match'));
    return currentResult;
  } else {
    const esFilter = await (0, _get_filter.getFilter)({
      type,
      filters: [...filters, threatFilter],
      language,
      query,
      savedId,
      services,
      index: inputIndex,
      lists: exceptionItems
    });
    logger.debug(buildRuleMessage(`${threatFilter.query.bool.should.length} indicator items are being checked for existence of matches`));
    const result = await (0, _search_after_bulk_create.searchAfterAndBulkCreate)({
      tuples,
      listClient,
      exceptionsList: exceptionItems,
      ruleParams: params,
      services,
      logger,
      eventsTelemetry,
      id: alertId,
      inputIndexPattern: inputIndex,
      signalsIndex: outputIndex,
      filter: esFilter,
      actions,
      name,
      createdBy,
      createdAt,
      updatedBy,
      updatedAt,
      interval,
      enabled,
      pageSize: searchAfterSize,
      refresh,
      tags,
      throttle,
      buildRuleMessage,
      enrichment: threatEnrichment
    });
    logger.debug(buildRuleMessage(`${threatFilter.query.bool.should.length} items have completed match checks and the total times to search were ${result.searchAfterTimes.length !== 0 ? result.searchAfterTimes : '(unknown) '}ms`));
    return result;
  }
};

exports.createThreatSignal = createThreatSignal;