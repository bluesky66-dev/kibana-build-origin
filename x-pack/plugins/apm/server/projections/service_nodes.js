"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNodesProjection = getServiceNodesProjection;

var _elasticsearch_fieldnames = require("../../common/elasticsearch_fieldnames");

var _merge_projection = require("./util/merge_projection");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceNodesProjection({
  setup,
  serviceName,
  serviceNodeName
}) {
  return (0, _merge_projection.mergeProjection)((0, _metrics.getMetricsProjection)({
    setup,
    serviceName,
    serviceNodeName
  }), {
    body: {
      aggs: {
        nodes: {
          terms: {
            field: _elasticsearch_fieldnames.SERVICE_NODE_NAME
          }
        }
      }
    }
  });
}