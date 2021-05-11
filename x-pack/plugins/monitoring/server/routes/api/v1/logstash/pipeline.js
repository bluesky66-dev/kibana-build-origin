"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashPipelineRoute = logstashPipelineRoute;

var _configSchema = require("@kbn/config-schema");

var _errors = require("../../../../lib/errors");

var _get_pipeline_versions = require("../../../../lib/logstash/get_pipeline_versions");

var _get_pipeline = require("../../../../lib/logstash/get_pipeline");

var _get_pipeline_vertex = require("../../../../lib/logstash/get_pipeline_vertex");

var _ccs_utils = require("../../../../lib/ccs_utils");

var _constants = require("../../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getPipelineVersion(versions, pipelineHash) {
  return pipelineHash ? versions.find(({
    hash
  }) => hash === pipelineHash) : versions[0];
}
/*
 * Logstash Pipeline route.
 */


function logstashPipelineRoute(server) {
  /**
   * Logstash Pipeline Viewer request.
   *
   * This will fetch all data required to display a Logstash Pipeline Viewer page.
   *
   * The current details returned are:
   *
   * - Pipeline Metrics
   */
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/pipeline/{pipelineId}/{pipelineHash?}',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          pipelineId: _configSchema.schema.string(),
          pipelineHash: _configSchema.schema.maybe(_configSchema.schema.string())
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          detailVertexId: _configSchema.schema.maybe(_configSchema.schema.string())
        })
      }
    },
    handler: async req => {
      const config = server.config();
      const ccs = req.payload.ccs;
      const clusterUuid = req.params.clusterUuid;
      const detailVertexId = req.payload.detailVertexId;
      const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);
      const pipelineId = req.params.pipelineId; // Optional params default to empty string, set to null to be more explicit.

      const pipelineHash = req.params.pipelineHash || null; // Figure out which version of the pipeline we want to show

      let versions;

      try {
        versions = await (0, _get_pipeline_versions.getPipelineVersions)(req, config, lsIndexPattern, clusterUuid, pipelineId);
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }

      const version = getPipelineVersion(versions, pipelineHash);
      const promises = [(0, _get_pipeline.getPipeline)(req, config, lsIndexPattern, clusterUuid, pipelineId, version)];

      if (detailVertexId) {
        promises.push((0, _get_pipeline_vertex.getPipelineVertex)(req, config, lsIndexPattern, clusterUuid, pipelineId, version, detailVertexId));
      }

      try {
        const [pipeline, vertex] = await Promise.all(promises);
        return {
          versions,
          pipeline,
          vertex
        };
      } catch (err) {
        return (0, _errors.handleError)(err, req);
      }
    }
  });
}