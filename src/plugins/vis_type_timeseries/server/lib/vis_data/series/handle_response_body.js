"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleResponseBody = handleResponseBody;

var _build_processor_function = require("../build_processor_function");

var _series = require("../response_processors/series");

var _lodash = require("lodash");

var _i18n = require("@kbn/i18n");

var _fields_fetcher = require("./../helpers/fields_fetcher");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function handleResponseBody(panel, req, searchStrategy, capabilities) {
  return async resp => {
    if (resp.error) {
      const err = new Error(resp.error.type);
      err.response = JSON.stringify(resp);
      throw err;
    }

    const aggregations = (0, _lodash.get)(resp, 'aggregations');

    if (!aggregations) {
      const message = _i18n.i18n.translate('visTypeTimeseries.series.missingAggregationKeyErrorMessage', {
        defaultMessage: 'The aggregations key is missing from the response, check your permissions for this request.'
      });

      throw Error(message);
    }

    const keys = Object.keys(aggregations);

    if (keys.length !== 1) {
      throw Error(_i18n.i18n.translate('visTypeTimeseries.series.shouldOneSeriesPerRequestErrorMessage', {
        defaultMessage: 'There should only be one series per request.'
      }));
    }

    const [seriesId] = keys;
    const meta = (0, _lodash.get)(resp, `aggregations.${seriesId}.meta`, {});
    const series = panel.series.find(s => s.id === (meta.seriesId || seriesId));
    const extractFields = (0, _fields_fetcher.createFieldsFetcher)(req, searchStrategy, capabilities);
    const processor = (0, _build_processor_function.buildProcessorFunction)(_series.processors, resp, panel, series, meta, extractFields);
    return await processor([]);
  };
}