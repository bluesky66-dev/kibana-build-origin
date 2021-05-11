"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initMetadataRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _lodash = require("lodash");

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _function = require("fp-ts/lib/function");

var _metadata_api = require("../../../common/http_api/metadata_api");

var _get_metric_metadata = require("./lib/get_metric_metadata");

var _pick_feature_name = require("./lib/pick_feature_name");

var _get_cloud_metric_metadata = require("./lib/get_cloud_metric_metadata");

var _get_node_info = require("./lib/get_node_info");

var _runtime_types = require("../../../common/runtime_types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const escapeHatch = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

const initMetadataRoute = libs => {
  const {
    framework
  } = libs;
  framework.registerRoute({
    method: 'post',
    path: '/api/infra/metadata',
    validate: {
      body: escapeHatch
    }
  }, async (requestContext, request, response) => {
    try {
      const {
        nodeId,
        nodeType,
        sourceId,
        timeRange
      } = (0, _pipeable.pipe)(_metadata_api.InfraMetadataRequestRT.decode(request.body), (0, _Either.fold)((0, _runtime_types.throwErrors)(_boom.default.badRequest), _function.identity));
      const {
        configuration
      } = await libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
      const metricsMetadata = await (0, _get_metric_metadata.getMetricMetadata)(framework, requestContext, configuration, nodeId, nodeType, timeRange);
      const metricFeatures = (0, _pick_feature_name.pickFeatureName)(metricsMetadata.buckets).map(nameToFeature('metrics'));
      const info = await (0, _get_node_info.getNodeInfo)(framework, requestContext, configuration, nodeId, nodeType, timeRange);
      const cloudInstanceId = (0, _lodash.get)(info, 'cloud.instance.id');
      const cloudMetricsMetadata = cloudInstanceId ? await (0, _get_cloud_metric_metadata.getCloudMetricsMetadata)(framework, requestContext, configuration, cloudInstanceId, timeRange) : {
        buckets: []
      };
      const cloudMetricsFeatures = (0, _pick_feature_name.pickFeatureName)(cloudMetricsMetadata.buckets).map(nameToFeature('metrics'));
      const id = metricsMetadata.id;
      const name = metricsMetadata.name || id;
      return response.ok({
        body: _metadata_api.InfraMetadataRT.encode({
          id,
          name,
          features: [...metricFeatures, ...cloudMetricsFeatures],
          info
        })
      });
    } catch (error) {
      return response.internalError({
        body: error.message
      });
    }
  });
};

exports.initMetadataRoute = initMetadataRoute;

const nameToFeature = source => name => ({
  name,
  source
});