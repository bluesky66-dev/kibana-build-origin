"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertRequestBody = convertRequestBody;
exports.getCallMsearch = getCallMsearch;

var _operators = require("rxjs/operators");

var _server = require("../../../../kibana_utils/server");

var _2 = require("..");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/** @internal */
function convertRequestBody(requestBody, {
  timeout
}) {
  return requestBody.searches.reduce((req, curr) => {
    const header = JSON.stringify({
      ignore_unavailable: true,
      ...curr.header
    });
    const body = JSON.stringify({
      timeout,
      ...curr.body
    });
    return `${req}${header}\n${body}\n`;
  }, '');
}

/**
 * Helper for the `/internal/_msearch` route, exported separately here
 * so that it can be reused elsewhere in the data plugin on the server,
 * e.g. SearchSource
 *
 * @internal
 */
function getCallMsearch(dependencies) {
  /**
   * @throws KbnServerError
   */
  return async (params) => {
    const {
      esClient,
      globalConfig$,
      uiSettings
    } = dependencies; // get shardTimeout

    const config = await globalConfig$.pipe((0, _operators.first)()).toPromise();
    const timeout = (0, _2.getShardTimeout)(config); // trackTotalHits is not supported by msearch

    const {
      track_total_hits: _,
      ...defaultParams
    } = await (0, _2.getDefaultSearchParams)(uiSettings);

    try {
      var _response$body$respon;

      const promise = esClient.asCurrentUser.msearch({
        body: convertRequestBody(params.body, timeout)
      }, {
        querystring: defaultParams
      });
      const response = await (0, _2.shimAbortSignal)(promise, params.signal);
      return {
        body: { ...response,
          body: {
            responses: (_response$body$respon = response.body.responses) === null || _response$body$respon === void 0 ? void 0 : _response$body$respon.map(r => (0, _2.shimHitsTotal)(r))
          }
        }
      };
    } catch (e) {
      throw (0, _server.getKbnServerError)(e);
    }
  };
}