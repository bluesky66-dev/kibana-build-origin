"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsListingRoute = beatsListingRoute;

var _configSchema = require("@kbn/config-schema");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _beats = require("../../../../lib/beats");

var _errors = require("../../../../lib/errors");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function beatsListingRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/beats/beats',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          })
        })
      }
    },

    async handler(req) {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const beatsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_BEATS, ccs);

      try {
        const [stats, listing] = await Promise.all([(0, _beats.getStats)(req, beatsIndexPattern, clusterUuid), (0, _beats.getBeats)(req, beatsIndexPattern, clusterUuid)]);
        return {
          stats,
          listing
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }

  });
}