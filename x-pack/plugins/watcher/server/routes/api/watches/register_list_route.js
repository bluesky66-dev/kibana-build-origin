"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerListRoute = registerListRoute;

var _lodash = require("lodash");

var _fetch_all_from_scroll = require("../../../lib/fetch_all_from_scroll");

var _constants = require("../../../../common/constants");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");

var _index = require("../../../models/watch/index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


function fetchWatches(dataClient) {
  const params = {
    index: _constants.INDEX_NAMES.WATCHES,
    scroll: _constants.ES_SCROLL_SETTINGS.KEEPALIVE,
    body: {
      size: _constants.ES_SCROLL_SETTINGS.PAGE_SIZE
    },
    ignore: [404]
  };
  return dataClient.callAsCurrentUser('search', params).then(response => (0, _fetch_all_from_scroll.fetchAllFromScroll)(response, dataClient));
}

function registerListRoute(deps) {
  deps.router.get({
    path: '/api/watcher/watches',
    validate: false
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    try {
      const hits = await fetchWatches(ctx.watcher.client);
      const watches = hits.map(hit => {
        const id = (0, _lodash.get)(hit, '_id');
        const watchJson = (0, _lodash.get)(hit, '_source');
        const watchStatusJson = (0, _lodash.get)(hit, '_source.status');
        return _index.Watch.fromUpstreamJson({
          id,
          watchJson,
          watchStatusJson
        }, {
          throwExceptions: {
            Action: false
          }
        });
      });
      return response.ok({
        body: {
          watches: watches.map(watch => watch.downstreamJson)
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        return response.customError({
          statusCode: e.statusCode,
          body: {
            message: e.message
          }
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}