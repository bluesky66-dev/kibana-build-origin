"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHeapMemoryChart = getHeapMemoryChart;

var _eui_theme_light = _interopRequireDefault(require("@elastic/eui/dist/eui_theme_light.json"));

var _i18n = require("@kbn/i18n");

var _with_apm_span = require("../../../../../utils/with_apm_span");

var _elasticsearch_fieldnames = require("../../../../../../common/elasticsearch_fieldnames");

var _fetch_and_transform_metrics = require("../../../fetch_and_transform_metrics");

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


const series = {
  heapMemoryUsed: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesUsed', {
      defaultMessage: 'Avg. used'
    }),
    color: _eui_theme_light.default.euiColorVis0
  },
  heapMemoryCommitted: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesCommitted', {
      defaultMessage: 'Avg. committed'
    }),
    color: _eui_theme_light.default.euiColorVis1
  },
  heapMemoryMax: {
    title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemorySeriesMax', {
      defaultMessage: 'Avg. limit'
    }),
    color: _eui_theme_light.default.euiColorVis2
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.agentMetrics.java.heapMemoryChartTitle', {
    defaultMessage: 'Heap Memory'
  }),
  key: 'heap_memory_area_chart',
  type: 'area',
  yUnit: 'bytes',
  series
};

function getHeapMemoryChart({
  environment,
  setup,
  serviceName,
  serviceNodeName
}) {
  return (0, _with_apm_span.withApmSpan)('get_heap_memory_charts', () => (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
    environment,
    setup,
    serviceName,
    serviceNodeName,
    chartBase,
    aggs: {
      heapMemoryMax: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_MAX
        }
      },
      heapMemoryCommitted: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_COMMITTED
        }
      },
      heapMemoryUsed: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_JAVA_HEAP_MEMORY_USED
        }
      }
    },
    additionalFilters: [{
      term: {
        [_elasticsearch_fieldnames.AGENT_NAME]: 'java'
      }
    }]
  }));
}