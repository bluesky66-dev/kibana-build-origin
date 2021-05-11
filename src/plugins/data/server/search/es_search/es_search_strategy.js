"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.esSearchStrategyProvider = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _request_utils = require("./request_utils");

var _response_utils = require("./response_utils");

var _usage = require("../collectors/usage");

var _server = require("../../../../kibana_utils/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const esSearchStrategyProvider = (config$, logger, usage) => ({
  /**
   * @param request
   * @param options
   * @param deps
   * @throws `KbnServerError`
   * @returns `Observable<IEsSearchResponse<any>>`
   */
  search: (request, {
    abortSignal,
    ...options
  }, {
    esClient,
    uiSettingsClient
  }) => {
    // Only default index pattern type is supported here.
    // See data_enhanced for other type support.
    if (request.indexType) {
      throw new _server.KbnServerError(`Unsupported index pattern type ${request.indexType}`, 400);
    }

    const search = async () => {
      try {
        const config = await config$.pipe((0, _operators.first)()).toPromise();
        const params = { ...(await (0, _request_utils.getDefaultSearchParams)(uiSettingsClient)),
          ...(0, _request_utils.getShardTimeout)(config),
          ...request.params
        };
        const promise = esClient.asCurrentUser.search(params);
        const {
          body
        } = await (0, _request_utils.shimAbortSignal)(promise, abortSignal);
        const response = (0, _response_utils.shimHitsTotal)(body, options);
        return (0, _response_utils.toKibanaSearchResponse)(response);
      } catch (e) {
        throw (0, _server.getKbnServerError)(e);
      }
    };

    return (0, _rxjs.from)(search()).pipe((0, _operators.tap)((0, _usage.searchUsageObserver)(logger, usage, options)));
  }
});

exports.esSearchStrategyProvider = esSearchStrategyProvider;