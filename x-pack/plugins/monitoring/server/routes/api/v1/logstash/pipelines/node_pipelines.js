"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logstashNodePipelinesRoute = logstashNodePipelinesRoute;

var _configSchema = require("@kbn/config-schema");

var _get_node_info = require("../../../../../lib/logstash/get_node_info");

var _errors = require("../../../../../lib/errors");

var _ccs_utils = require("../../../../../lib/ccs_utils");

var _constants = require("../../../../../../common/constants");

var _get_paginated_pipelines = require("../../../../../lib/logstash/get_paginated_pipelines");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Retrieve pipelines for a node
 */


function logstashNodePipelinesRoute(server) {
  server.route({
    method: 'POST',
    path: '/api/monitoring/v1/clusters/{clusterUuid}/logstash/node/{logstashUuid}/pipelines',
    config: {
      validate: {
        params: _configSchema.schema.object({
          clusterUuid: _configSchema.schema.string(),
          logstashUuid: _configSchema.schema.string()
        }),
        payload: _configSchema.schema.object({
          ccs: _configSchema.schema.maybe(_configSchema.schema.string()),
          timeRange: _configSchema.schema.object({
            min: _configSchema.schema.string(),
            max: _configSchema.schema.string()
          }),
          pagination: _configSchema.schema.object({
            index: _configSchema.schema.number(),
            size: _configSchema.schema.number()
          }),
          sort: _configSchema.schema.maybe(_configSchema.schema.object({
            field: _configSchema.schema.string(),
            direction: _configSchema.schema.string()
          })),
          queryText: _configSchema.schema.string({
            defaultValue: ''
          })
        })
      }
    },
    handler: async req => {
      const config = server.config();
      const {
        ccs,
        pagination,
        sort,
        queryText
      } = req.payload;
      const {
        clusterUuid,
        logstashUuid
      } = req.params;
      const lsIndexPattern = (0, _ccs_utils.prefixIndexPattern)(config, _constants.INDEX_PATTERN_LOGSTASH, ccs);
      const throughputMetric = 'logstash_node_pipeline_throughput';
      const nodesCountMetric = 'logstash_node_pipeline_nodes_count'; // Mapping client and server metric keys together

      const sortMetricSetMap = {
        latestThroughput: throughputMetric,
        latestNodesCount: nodesCountMetric
      };

      if (sort) {
        sort.field = sortMetricSetMap[sort.field] || sort.field;
      }

      try {
        const response = await (0, _get_paginated_pipelines.getPaginatedPipelines)(req, lsIndexPattern, {
          clusterUuid,
          logstashUuid
        }, {
          throughputMetric,
          nodesCountMetric
        }, pagination, sort, queryText);
        return { ...response,
          nodeSummary: await (0, _get_node_info.getNodeInfo)(req, lsIndexPattern, {
            clusterUuid,
            logstashUuid
          })
        };
      } catch (err) {
        throw (0, _errors.handleError)(err, req);
      }
    }
  });
}