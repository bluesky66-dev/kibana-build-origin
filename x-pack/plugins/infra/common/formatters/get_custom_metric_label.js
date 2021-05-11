"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCustomMetricLabel = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getCustomMetricLabel = metric => {
  const METRIC_LABELS = {
    avg: _i18n.i18n.translate('xpack.infra.waffle.aggregationNames.avg', {
      defaultMessage: 'Avg of {field}',
      values: {
        field: metric.field
      }
    }),
    max: _i18n.i18n.translate('xpack.infra.waffle.aggregationNames.max', {
      defaultMessage: 'Max of {field}',
      values: {
        field: metric.field
      }
    }),
    min: _i18n.i18n.translate('xpack.infra.waffle.aggregationNames.min', {
      defaultMessage: 'Min of {field}',
      values: {
        field: metric.field
      }
    }),
    rate: _i18n.i18n.translate('xpack.infra.waffle.aggregationNames.rate', {
      defaultMessage: 'Rate of {field}',
      values: {
        field: metric.field
      }
    })
  };
  return metric.label ? metric.label : METRIC_LABELS[metric.aggregation];
};

exports.getCustomMetricLabel = getCustomMetricLabel;