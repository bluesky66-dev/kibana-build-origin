"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeriesRequestParams = getSeriesRequestParams;

var _build_request_body = require("./build_request_body");

var _get_es_shard_timeout = require("../helpers/get_es_shard_timeout");

var _get_index_pattern = require("../helpers/get_index_pattern");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getSeriesRequestParams(req, panel, series, esQueryConfig, capabilities) {
  const uiSettings = req.getUiSettingsService();
  const indexPattern = series.override_index_pattern && series.series_index_pattern || panel.index_pattern;
  const {
    indexPatternObject,
    indexPatternString
  } = await (0, _get_index_pattern.getIndexPatternObject)(req, indexPattern);
  const request = await (0, _build_request_body.buildRequestBody)(req, panel, series, esQueryConfig, indexPatternObject, capabilities, uiSettings);
  const esShardTimeout = await (0, _get_es_shard_timeout.getEsShardTimeout)(req);
  return {
    index: indexPatternString,
    body: { ...request,
      timeout: esShardTimeout > 0 ? `${esShardTimeout}ms` : undefined
    }
  };
}