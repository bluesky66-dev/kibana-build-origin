"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTableData = getTableData;

var _build_request_body = require("./table/build_request_body");

var _handle_error_response = require("./handle_error_response");

var _lodash = require("lodash");

var _process_bucket = require("./table/process_bucket");

var _get_es_query_uisettings = require("./helpers/get_es_query_uisettings");

var _get_index_pattern = require("./helpers/get_index_pattern");

var _fields_fetcher = require("./helpers/fields_fetcher");

var _calculate_label = require("../../../common/calculate_label");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getTableData(req, panel) {
  const panelIndexPattern = panel.index_pattern;
  const {
    searchStrategy,
    capabilities
  } = await req.framework.searchStrategyRegistry.getViableStrategy(req, panelIndexPattern);
  const esQueryConfig = await (0, _get_es_query_uisettings.getEsQueryConfig)(req);
  const {
    indexPatternObject
  } = await (0, _get_index_pattern.getIndexPatternObject)(req, panelIndexPattern);
  const extractFields = (0, _fields_fetcher.createFieldsFetcher)(req, searchStrategy, capabilities);

  const calculatePivotLabel = async () => {
    if (panel.pivot_id && indexPatternObject !== null && indexPatternObject !== void 0 && indexPatternObject.title) {
      const fields = await extractFields(indexPatternObject.title);
      return (0, _calculate_label.extractFieldLabel)(fields, panel.pivot_id);
    }

    return panel.pivot_id;
  };

  const meta = {
    type: panel.type,
    pivot_label: panel.pivot_label || (await calculatePivotLabel()),
    uiRestrictions: capabilities.uiRestrictions
  };

  try {
    const uiSettings = req.getUiSettingsService();
    const body = await (0, _build_request_body.buildRequestBody)(req, panel, esQueryConfig, indexPatternObject, capabilities, uiSettings);
    const [resp] = await searchStrategy.search(req, [{
      body,
      index: panelIndexPattern
    }]);
    const buckets = (0, _lodash.get)(resp.rawResponse ? resp.rawResponse : resp, 'aggregations.pivot.buckets', []);
    const series = await Promise.all(buckets.map((0, _process_bucket.processBucket)(panel, req, searchStrategy, capabilities, extractFields)));
    return { ...meta,
      series
    };
  } catch (err) {
    if (err.body || err.name === 'KQLSyntaxError') {
      err.response = err.body;
      return { ...meta,
        ...(0, _handle_error_response.handleErrorResponse)(panel)(err)
      };
    }
  }
}