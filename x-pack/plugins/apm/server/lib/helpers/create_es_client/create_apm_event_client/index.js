"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createApmEventClient = createApmEventClient;

var _server = require("../../../../../../observability/server");

var _call_async_with_debug = require("../call_async_with_debug");

var _cancel_es_request_on_abort = require("../cancel_es_request_on_abort");

var _add_filter_to_exclude_legacy_data = require("./add_filter_to_exclude_legacy_data");

var _unpack_processor_events = require("./unpack_processor_events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createApmEventClient({
  esClient,
  debug,
  request,
  indices,
  options: {
    includeFrozen
  } = {
    includeFrozen: false
  }
}) {
  return {
    async search(params, {
      includeLegacyData = false
    } = {}) {
      const withProcessorEventFilter = (0, _unpack_processor_events.unpackProcessorEvents)(params, indices);
      const withPossibleLegacyDataFilter = !includeLegacyData ? (0, _add_filter_to_exclude_legacy_data.addFilterToExcludeLegacyData)(withProcessorEventFilter) : withProcessorEventFilter;
      const searchParams = { ...withPossibleLegacyDataFilter,
        ignore_throttled: !includeFrozen,
        ignore_unavailable: true
      };
      return (0, _call_async_with_debug.callAsyncWithDebug)({
        cb: () => {
          const searchPromise = (0, _cancel_es_request_on_abort.cancelEsRequestOnAbort)(esClient.search(searchParams), request);
          return (0, _server.unwrapEsResponse)(searchPromise);
        },
        getDebugMessage: () => ({
          body: (0, _call_async_with_debug.getDebugBody)(searchParams, 'search'),
          title: (0, _call_async_with_debug.getDebugTitle)(request)
        }),
        debug
      });
    }

  };
}