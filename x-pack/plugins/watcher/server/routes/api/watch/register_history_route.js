"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerHistoryRoute = registerHistoryRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _fetch_all_from_scroll = require("../../../lib/fetch_all_from_scroll");

var _constants = require("../../../../common/constants");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");

var _index = require("../../../models/watch_history_item/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


const paramsSchema = _configSchema.schema.object({
  watchId: _configSchema.schema.string()
});

const querySchema = _configSchema.schema.object({
  startTime: _configSchema.schema.string()
});

function fetchHistoryItems(dataClient, watchId, startTime) {
  const params = {
    index: _constants.INDEX_NAMES.WATCHER_HISTORY,
    scroll: _constants.ES_SCROLL_SETTINGS.KEEPALIVE,
    body: {
      size: _constants.ES_SCROLL_SETTINGS.PAGE_SIZE,
      sort: [{
        'result.execution_time': 'desc'
      }],
      query: {
        bool: {
          must: [{
            term: {
              watch_id: watchId
            }
          }]
        }
      }
    }
  }; // Add time range clause to query if startTime is specified

  if (startTime !== 'all') {
    const timeRangeQuery = {
      range: {
        'result.execution_time': {
          gte: startTime
        }
      }
    };
    params.body.query.bool.must.push(timeRangeQuery);
  }

  return dataClient.callAsCurrentUser('search', params).then(response => (0, _fetch_all_from_scroll.fetchAllFromScroll)(response, dataClient));
}

function registerHistoryRoute(deps) {
  deps.router.get({
    path: '/api/watcher/watch/{watchId}/history',
    validate: {
      params: paramsSchema,
      query: querySchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const {
      watchId
    } = request.params;
    const {
      startTime
    } = request.query;

    try {
      const hits = await fetchHistoryItems(ctx.watcher.client, watchId, startTime);
      const watchHistoryItems = hits.map(hit => {
        const id = (0, _lodash.get)(hit, '_id');
        const watchHistoryItemJson = (0, _lodash.get)(hit, '_source');
        const opts = {
          includeDetails: false
        };
        return _index.WatchHistoryItem.fromUpstreamJson({
          id,
          watchId,
          watchHistoryItemJson
        }, opts);
      });
      return response.ok({
        body: {
          watchHistoryItems: watchHistoryItems.map(watchHistoryItem => watchHistoryItem.downstreamJson)
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        return response.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}