"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enhancedEsSearchStrategyProvider = void 0;

var _operators = require("rxjs/operators");

var _rxjs = require("rxjs");

var _server = require("../../../../../src/plugins/data/server");

var _common = require("../../common");

var _request_utils = require("./request_utils");

var _response_utils = require("./response_utils");

var _server2 = require("../../../../../src/plugins/kibana_utils/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const enhancedEsSearchStrategyProvider = (config, legacyConfig$, logger, usage) => {
  async function cancelAsyncSearch(id, esClient) {
    try {
      await esClient.asCurrentUser.asyncSearch.delete({
        id
      });
    } catch (e) {
      throw (0, _server2.getKbnServerError)(e);
    }
  }

  function asyncSearch({
    id,
    ...request
  }, options, {
    esClient,
    uiSettingsClient
  }) {
    const client = esClient.asCurrentUser.asyncSearch;

    const search = async () => {
      const params = id ? (0, _request_utils.getDefaultAsyncGetParams)(options) : { ...(await (0, _request_utils.getDefaultAsyncSubmitParams)(uiSettingsClient, config, options)),
        ...request.params
      };
      const promise = id ? client.get({ ...params,
        id
      }) : client.submit(params);
      const {
        body
      } = await (0, _server.shimAbortSignal)(promise, options.abortSignal);
      const response = (0, _server.shimHitsTotal)(body.response, options);
      return (0, _response_utils.toAsyncKibanaSearchResponse)({ ...body,
        response
      });
    };

    const cancel = async () => {
      if (id) {
        await cancelAsyncSearch(id, esClient);
      }
    };

    return (0, _common.pollSearch)(search, cancel, options).pipe((0, _operators.tap)(response => id = response.id), (0, _operators.tap)((0, _server.searchUsageObserver)(logger, usage)), (0, _operators.catchError)(e => {
      throw (0, _server2.getKbnServerError)(e);
    }));
  }

  async function rollupSearch(request, options, {
    esClient,
    uiSettingsClient
  }) {
    const legacyConfig = await legacyConfig$.pipe((0, _operators.first)()).toPromise();
    const {
      body,
      index,
      ...params
    } = request.params;
    const method = 'POST';
    const path = encodeURI(`/${index}/_rollup_search`);
    const querystring = { ...(0, _server.getShardTimeout)(legacyConfig),
      ...(await (0, _request_utils.getIgnoreThrottled)(uiSettingsClient)),
      ...(await (0, _server.getDefaultSearchParams)(uiSettingsClient)),
      ...params
    };

    try {
      const promise = esClient.asCurrentUser.transport.request({
        method,
        path,
        body,
        querystring
      });
      const esResponse = await (0, _server.shimAbortSignal)(promise, options === null || options === void 0 ? void 0 : options.abortSignal);
      const response = esResponse.body;
      return {
        rawResponse: (0, _server.shimHitsTotal)(response, options),
        ...(0, _server.getTotalLoaded)(response)
      };
    } catch (e) {
      throw (0, _server2.getKbnServerError)(e);
    }
  }

  return {
    /**
     * @param request
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Observable<IEsSearchResponse<any>>`
     * @throws `KbnServerError`
     */
    search: (request, options, deps) => {
      logger.debug(`search ${JSON.stringify(request.params) || request.id}`);

      if (request.indexType && request.indexType !== 'rollup') {
        throw new _server2.KbnServerError('Unknown indexType', 400);
      }

      if (request.indexType === undefined) {
        return asyncSearch(request, options, deps);
      } else {
        return (0, _rxjs.from)(rollupSearch(request, options, deps));
      }
    },

    /**
     * @param id async search ID to cancel, as returned from _async_search API
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    cancel: async (id, options, {
      esClient
    }) => {
      logger.debug(`cancel ${id}`);
      await cancelAsyncSearch(id, esClient);
    },

    /**
     *
     * @param id async search ID to extend, as returned from _async_search API
     * @param keepAlive
     * @param options
     * @param deps `SearchStrategyDependencies`
     * @returns `Promise<void>`
     * @throws `KbnServerError`
     */
    extend: async (id, keepAlive, options, {
      esClient
    }) => {
      logger.debug(`extend ${id} by ${keepAlive}`);

      try {
        await esClient.asCurrentUser.asyncSearch.get({
          id,
          keep_alive: keepAlive
        });
      } catch (e) {
        throw (0, _server2.getKbnServerError)(e);
      }
    }
  };
};

exports.enhancedEsSearchStrategyProvider = enhancedEsSearchStrategyProvider;