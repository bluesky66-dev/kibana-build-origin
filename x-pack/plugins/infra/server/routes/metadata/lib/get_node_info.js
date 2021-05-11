"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNodeInfo = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _lodash = require("lodash");

var _get_pod_node_name = require("./get_pod_node_name");

var _constants = require("../../../lib/constants");

var _inventory_models = require("../../../../common/inventory_models");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getNodeInfo = async (framework, requestContext, sourceConfiguration, nodeId, nodeType, timeRange) => {
  // If the nodeType is a Kubernetes pod then we need to get the node info
  // from a host record instead of a pod. This is due to the fact that any host
  // can report pod details and we can't rely on the host/cloud information associated
  // with the kubernetes.pod.uid. We need to first lookup the `kubernetes.node.name`
  // then use that to lookup the host's node information.
  if (nodeType === 'pod') {
    const kubernetesNodeName = await (0, _get_pod_node_name.getPodNodeName)(framework, requestContext, sourceConfiguration, nodeId, nodeType, timeRange);

    if (kubernetesNodeName) {
      return getNodeInfo(framework, requestContext, sourceConfiguration, kubernetesNodeName, 'host', timeRange);
    }

    return {};
  }

  const fields = (0, _inventory_models.findInventoryFields)(nodeType, sourceConfiguration.fields);
  const timestampField = sourceConfiguration.fields.timestamp;
  const params = {
    allowNoIndices: true,
    ignoreUnavailable: true,
    terminateAfter: 1,
    index: sourceConfiguration.metricAlias,
    body: {
      size: 1,
      _source: ['host.*', 'cloud.*', 'agent.*'],
      sort: [{
        [timestampField]: 'desc'
      }],
      query: {
        bool: {
          filter: [{
            match: {
              [fields.id]: nodeId
            }
          }, {
            range: {
              [timestampField]: {
                gte: timeRange.from,
                lte: timeRange.to,
                format: 'epoch_millis'
              }
            }
          }]
        }
      }
    }
  };

  if (!_constants.CLOUD_METRICS_MODULES.some(m => (0, _lodash.startsWith)(nodeType, m))) {
    (0, _saferLodashSet.set)(params, 'body.query.bool.must_not', _constants.CLOUD_METRICS_MODULES.map(module => ({
      match: {
        'event.module': module
      }
    })));
  }

  const response = await framework.callWithRequest(requestContext, 'search', params);
  const firstHit = (0, _lodash.first)(response.hits.hits);

  if (firstHit) {
    return firstHit._source;
  }

  return {};
};

exports.getNodeInfo = getNodeInfo;