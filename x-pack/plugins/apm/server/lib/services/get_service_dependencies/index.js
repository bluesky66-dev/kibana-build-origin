"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getServiceDependencies = getServiceDependencies;

var _lodash = require("lodash");

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _maybe = require("../../../../common/utils/maybe");

var _is_finite_number = require("../../../../common/utils/is_finite_number");

var _join_by_key = require("../../../../common/utils/join_by_key");

var _get_metrics = require("./get_metrics");

var _get_destination_map = require("./get_destination_map");

var _calculate_throughput = require("../../helpers/calculate_throughput");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getServiceDependencies({
  setup,
  serviceName,
  environment,
  numBuckets
}) {
  return (0, _with_apm_span.withApmSpan)('get_service_dependencies', async () => {
    const {
      start,
      end
    } = setup;
    const [allMetrics, destinationMap] = await Promise.all([(0, _get_metrics.getMetrics)({
      setup,
      serviceName,
      environment,
      numBuckets
    }), (0, _get_destination_map.getDestinationMap)({
      setup,
      serviceName,
      environment
    })]);
    const metricsWithDestinationIds = allMetrics.map(metricItem => {
      const spanDestination = metricItem.span.destination.service.resource;
      const destination = (0, _maybe.maybe)(destinationMap[spanDestination]);
      const id = (destination === null || destination === void 0 ? void 0 : destination.id) || {
        [_elasticsearch_fieldnames.SPAN_DESTINATION_SERVICE_RESOURCE]: spanDestination
      };
      return (0, _lodash.merge)({
        id,
        metrics: [metricItem],
        span: {
          destination: {
            service: {
              resource: spanDestination
            }
          }
        }
      }, destination);
    }, []);
    const metricsJoinedByDestinationId = (0, _join_by_key.joinByKey)(metricsWithDestinationIds, 'id', (a, b) => {
      const {
        metrics: metricsA,
        ...itemA
      } = a;
      const {
        metrics: metricsB,
        ...itemB
      } = b;
      return (0, _lodash.merge)({}, itemA, itemB, {
        metrics: metricsA.concat(metricsB)
      });
    });
    const metricsByResolvedAddress = metricsJoinedByDestinationId.map(item => {
      var _mergedMetrics$value$;

      const mergedMetrics = item.metrics.reduce((prev, current) => {
        return {
          value: {
            count: prev.value.count + current.value.count,
            latency_sum: prev.value.latency_sum + current.value.latency_sum,
            error_count: prev.value.error_count + current.value.error_count
          },
          timeseries: (0, _join_by_key.joinByKey)([...prev.timeseries, ...current.timeseries], 'x', (a, b) => ({
            x: a.x,
            count: a.count + b.count,
            latency_sum: a.latency_sum + b.latency_sum,
            error_count: a.error_count + b.error_count
          }))
        };
      }, {
        value: {
          count: 0,
          latency_sum: 0,
          error_count: 0
        },
        timeseries: []
      });
      const destMetrics = {
        latency: {
          value: mergedMetrics.value.count > 0 ? mergedMetrics.value.latency_sum / mergedMetrics.value.count : null,
          timeseries: mergedMetrics.timeseries.map(point => ({
            x: point.x,
            y: point.count > 0 ? point.latency_sum / point.count : null
          }))
        },
        throughput: {
          value: mergedMetrics.value.count > 0 ? (0, _calculate_throughput.calculateThroughput)({
            start,
            end,
            value: mergedMetrics.value.count
          }) : null,
          timeseries: mergedMetrics.timeseries.map(point => ({
            x: point.x,
            y: point.count > 0 ? (0, _calculate_throughput.calculateThroughput)({
              start,
              end,
              value: point.count
            }) : null
          }))
        },
        errorRate: {
          value: mergedMetrics.value.count > 0 ? ((_mergedMetrics$value$ = mergedMetrics.value.error_count) !== null && _mergedMetrics$value$ !== void 0 ? _mergedMetrics$value$ : 0) / mergedMetrics.value.count : null,
          timeseries: mergedMetrics.timeseries.map(point => {
            var _point$error_count;

            return {
              x: point.x,
              y: point.count > 0 ? ((_point$error_count = point.error_count) !== null && _point$error_count !== void 0 ? _point$error_count : 0) / point.count : null
            };
          })
        }
      };

      if (item.service) {
        return {
          name: item.service.name,
          type: 'service',
          serviceName: item.service.name,
          environment: item.service.environment,
          // agent.name should always be there, type returned from joinByKey is too pessimistic
          agentName: item.agent.name,
          ...destMetrics
        };
      }

      return {
        name: item.span.destination.service.resource,
        type: 'external',
        spanType: item.span.type,
        spanSubtype: item.span.subtype,
        ...destMetrics
      };
    });
    const latencySums = metricsByResolvedAddress.map(metric => {
      var _metric$latency$value, _metric$throughput$va;

      return ((_metric$latency$value = metric.latency.value) !== null && _metric$latency$value !== void 0 ? _metric$latency$value : 0) * ((_metric$throughput$va = metric.throughput.value) !== null && _metric$throughput$va !== void 0 ? _metric$throughput$va : 0);
    }).filter(_is_finite_number.isFiniteNumber);
    const minLatencySum = Math.min(...latencySums);
    const maxLatencySum = Math.max(...latencySums);
    return metricsByResolvedAddress.map(metric => {
      const impact = (0, _is_finite_number.isFiniteNumber)(metric.latency.value) && (0, _is_finite_number.isFiniteNumber)(metric.throughput.value) ? (metric.latency.value * metric.throughput.value - minLatencySum) / (maxLatencySum - minLatencySum) * 100 : 0;
      return { ...metric,
        impact
      };
    });
  });
}