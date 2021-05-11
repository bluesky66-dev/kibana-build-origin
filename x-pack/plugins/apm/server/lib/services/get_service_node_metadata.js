"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNodeMetadata = getServiceNodeMetadata;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _i18n = require("../../../common/i18n");

var _merge_projection = require("../../projections/util/merge_projection");

var _service_nodes = require("../../projections/service_nodes");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceNodeMetadata({
  serviceName,
  serviceNodeName,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_node_metadata', async () => {
    var _response$aggregation, _response$aggregation2, _response$aggregation3, _response$aggregation4;

    const {
      apmEventClient
    } = setup;
    const query = (0, _merge_projection.mergeProjection)((0, _service_nodes.getServiceNodesProjection)({
      setup,
      serviceName,
      serviceNodeName
    }), {
      body: {
        size: 0,
        aggs: {
          host: {
            terms: {
              field: _elasticsearch_fieldnames.HOST_NAME,
              size: 1
            }
          },
          containerId: {
            terms: {
              field: _elasticsearch_fieldnames.CONTAINER_ID,
              size: 1
            }
          }
        }
      }
    });
    const response = await apmEventClient.search(query);
    return {
      host: ((_response$aggregation = response.aggregations) === null || _response$aggregation === void 0 ? void 0 : (_response$aggregation2 = _response$aggregation.host.buckets[0]) === null || _response$aggregation2 === void 0 ? void 0 : _response$aggregation2.key) || _i18n.NOT_AVAILABLE_LABEL,
      containerId: ((_response$aggregation3 = response.aggregations) === null || _response$aggregation3 === void 0 ? void 0 : (_response$aggregation4 = _response$aggregation3.containerId.buckets[0]) === null || _response$aggregation4 === void 0 ? void 0 : _response$aggregation4.key) || _i18n.NOT_AVAILABLE_LABEL
    };
  });
}