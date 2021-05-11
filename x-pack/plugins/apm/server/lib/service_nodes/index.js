"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceNodes = void 0;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _service_nodes = require("../../../common/service_nodes");

var _service_nodes2 = require("../../projections/service_nodes");

var _merge_projection = require("../../projections/util/merge_projection");

var _with_apm_span = require("../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getServiceNodes = ({
  setup,
  serviceName
}) => {
  return (0, _with_apm_span.withApmSpan)('get_service_nodes', async () => {
    const {
      apmEventClient
    } = setup;
    const projection = (0, _service_nodes2.getServiceNodesProjection)({
      setup,
      serviceName
    });
    const params = (0, _merge_projection.mergeProjection)(projection, {
      body: {
        aggs: {
          nodes: {
            terms: { ...projection.body.aggs.nodes.terms,
              size: 10000,
              missing: _service_nodes.SERVICE_NODE_NAME_MISSING
            },
            aggs: {
              cpu: {
                avg: {
                  field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
                }
              },
              heapMemory: {
                avg: {
                  field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_USED
                }
              },
              nonHeapMemory: {
                avg: {
                  field: _elasticsearch_fieldnames.METRIC_JAVA_NON_HEAP_MEMORY_USED
                }
              },
              threadCount: {
                max: {
                  field: _elasticsearch_fieldnames.METRIC_JAVA_THREAD_COUNT
                }
              }
            }
          }
        }
      }
    });
    const response = await apmEventClient.search(params);

    if (!response.aggregations) {
      return [];
    }

    return response.aggregations.nodes.buckets.map(bucket => ({
      name: bucket.key,
      cpu: bucket.cpu.value,
      heapMemory: bucket.heapMemory.value,
      nonHeapMemory: bucket.nonHeapMemory.value,
      threadCount: bucket.threadCount.value
    })).filter(item => item.cpu !== null || item.heapMemory !== null || item.nonHeapMemory !== null || item.threadCount != null);
  });
};

exports.getServiceNodes = getServiceNodes;