"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildThreatEnrichment = void 0;

var _constants = require("../../../../../common/constants");

var _enrich_signal_threat_matches = require("./enrich_signal_threat_matches");

var _get_threat_list = require("./get_threat_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildThreatEnrichment = ({
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
}) => {
  const getMatchedThreats = async ids => {
    const matchedThreatsFilter = {
      query: {
        bool: {
          filter: {
            ids: {
              values: ids
            }
          }
        }
      }
    };
    const threatResponse = await (0, _get_threat_list.getThreatList)({
      callCluster: services.callCluster,
      exceptionItems,
      threatFilters: [...threatFilters, matchedThreatsFilter],
      query: threatQuery,
      language: threatLanguage,
      index: threatIndex,
      listClient,
      searchAfter: undefined,
      sortField: undefined,
      sortOrder: undefined,
      logger,
      buildRuleMessage,
      perPage: undefined
    });
    return threatResponse.hits.hits;
  };

  const defaultedIndicatorPath = threatIndicatorPath ? threatIndicatorPath : _constants.DEFAULT_INDICATOR_SOURCE_PATH;
  return signals => (0, _enrich_signal_threat_matches.enrichSignalThreatMatches)(signals, getMatchedThreats, defaultedIndicatorPath);
};

exports.buildThreatEnrichment = buildThreatEnrichment;