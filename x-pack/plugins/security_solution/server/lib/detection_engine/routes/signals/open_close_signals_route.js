"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSignalsStatusRoute = void 0;

var _set_signal_status_type_dependents = require("../../../../../common/detection_engine/schemas/request/set_signal_status_type_dependents");

var _set_signal_status_schema = require("../../../../../common/detection_engine/schemas/request/set_signal_status_schema");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _route_validation = require("../../../../utils/build_validation/route_validation");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setSignalsStatusRoute = router => {
  router.post({
    path: _constants.DETECTION_ENGINE_SIGNALS_STATUS_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_set_signal_status_schema.setSignalsStatusSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$securitySolu;

    const {
      conflicts,
      signal_ids: signalIds,
      query,
      status
    } = request.body;
    const clusterClient = context.core.elasticsearch.legacy.client;
    const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _set_signal_status_type_dependents.setSignalStatusValidateTypeDependents)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    if (!siemClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    let queryObject;

    if (signalIds) {
      queryObject = {
        ids: {
          values: signalIds
        }
      };
    }

    if (query) {
      queryObject = {
        bool: {
          filter: query
        }
      };
    }

    try {
      const result = await clusterClient.callAsCurrentUser('updateByQuery', {
        index: siemClient.getSignalsIndex(),
        conflicts: conflicts !== null && conflicts !== void 0 ? conflicts : 'abort',
        refresh: 'wait_for',
        body: {
          script: {
            source: `ctx._source.signal.status = '${status}'`,
            lang: 'painless'
          },
          query: queryObject
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

exports.setSignalsStatusRoute = setSignalsStatusRoute;