"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCPUChartData = getCPUChartData;

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
  systemCPUMax: {
    title: _i18n.i18n.translate('xpack.apm.chart.cpuSeries.systemMaxLabel', {
      defaultMessage: 'System max'
    }),
    color: _eui_theme_light.default.euiColorVis1
  },
  systemCPUAverage: {
    title: _i18n.i18n.translate('xpack.apm.chart.cpuSeries.systemAverageLabel', {
      defaultMessage: 'System average'
    }),
    color: _eui_theme_light.default.euiColorVis0
  },
  processCPUMax: {
    title: _i18n.i18n.translate('xpack.apm.chart.cpuSeries.processMaxLabel', {
      defaultMessage: 'Process max'
    }),
    color: _eui_theme_light.default.euiColorVis7
  },
  processCPUAverage: {
    title: _i18n.i18n.translate('xpack.apm.chart.cpuSeries.processAverageLabel', {
      defaultMessage: 'Process average'
    }),
    color: _eui_theme_light.default.euiColorVis5
  }
};
const chartBase = {
  title: _i18n.i18n.translate('xpack.apm.serviceDetails.metrics.cpuUsageChartTitle', {
    defaultMessage: 'CPU usage'
  }),
  key: 'cpu_usage_chart',
  type: 'linemark',
  yUnit: 'percent',
  series
};

function getCPUChartData({
  environment,
  setup,
  serviceName,
  serviceNodeName
}) {
  return (0, _with_apm_span.withApmSpan)('get_cpu_metric_charts', () => (0, _fetch_and_transform_metrics.fetchAndTransformMetrics)({
    environment,
    setup,
    serviceName,
    serviceNodeName,
    chartBase,
    aggs: {
      systemCPUAverage: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
        }
      },
      systemCPUMax: {
        max: {
          field: _elasticsearch_fieldnames.METRIC_SYSTEM_CPU_PERCENT
        }
      },
      processCPUAverage: {
        avg: {
          field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
        }
      },
      processCPUMax: {
        max: {
          field: _elasticsearch_fieldnames.METRIC_PROCESS_CPU_PERCENT
        }
      }
    }
  }));
}