"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.querySignalsRoute = void 0;

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _query_signals_index_schema = require("../../../../../common/detection_engine/schemas/request/query_signals_index_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const querySignalsRoute = router => {
  router.post({
    path: _constants.DETECTION_ENGINE_QUERY_SIGNALS_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_query_signals_index_schema.querySignalsSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const {
      query,
      aggs,
      _source,
      track_total_hits,
      size
    } = request.body;
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    if (query == null && aggs == null && _source == null && track_total_hits == null && size == null) {
      return siemResponse.error({
        statusCode: 400,
        body: '"value" must have at least 1 children'
      });
    }

    const clusterClient = context.core.elasticsearch.legacy.client;
    const siemClient = context.securitySolution.getAppClient();

    try {
      const result = await clusterClient.callAsCurrentUser('search', {
        index: siemClient.getSignalsIndex(),
        body: {
          query,
          aggs,
          _source,
          track_total_hits,
          size
        },
        ignoreUnavailable: true
      });
      return response.ok({
        body: result
      });
    } catch (err) {
      // error while getting or updating signal with id: id in signal index .siem-signals
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.querySignalsRoute = querySignalsRoute;