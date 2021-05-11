"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSeriesData = getSeriesData;

var _get_request_params = require("./series/get_request_params");

var _handle_response_body = require("./series/handle_response_body");

var _handle_error_response = require("./handle_error_response");

var _get_annotations = require("./get_annotations");

var _get_es_query_uisettings = require("./helpers/get_es_query_uisettings");

var _get_active_series = require("./helpers/get_active_series");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getSeriesData(req, panel) {
  const {
    searchStrategy,
    capabilities
  } = await req.framework.searchStrategyRegistry.getViableStrategyForPanel(req, panel);
  const esQueryConfig = await (0, _get_es_query_uisettings.getEsQueryConfig)(req);
  const meta = {
    type: panel.type,
    uiRestrictions: capabilities.uiRestrictions
  };

  try {
    const bodiesPromises = (0, _get_active_series.getActiveSeries)(panel).map(series => (0, _get_request_params.getSeriesRequestParams)(req, panel, series, esQueryConfig, capabilities));
    const searches = (await Promise.all(bodiesPromises)).reduce((acc, items) => acc.concat(items), []);
    const data = await searchStrategy.search(req, searches);
    const handleResponseBodyFn = (0, _handle_response_body.handleResponseBody)(panel, req, searchStrategy, capabilities);
    const series = await Promise.all(data.map(async resp => await handleResponseBodyFn(resp.rawResponse ? resp.rawResponse : resp)));
    let annotations = null;

    if (panel.annotations && panel.annotations.length) {
      annotations = await (0, _get_annotations.getAnnotations)({
        req,
        panel,
        series,
        esQueryConfig,
        searchStrategy,
        capabilities
      });
    }

    return { ...meta,
      [panel.id]: {
        annotations,
        id: panel.id,
        series: series.reduce((acc, series) => acc.concat(series), [])
      }
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