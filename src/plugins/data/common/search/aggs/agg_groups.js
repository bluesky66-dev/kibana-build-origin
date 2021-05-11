"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AggGroupLabels = exports.AggGroupNames = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const AggGroupNames = Object.freeze({
  Buckets: 'buckets',
  Metrics: 'metrics',
  None: 'none'
});
exports.AggGroupNames = AggGroupNames;
const AggGroupLabels = {
  [AggGroupNames.Buckets]: _i18n.i18n.translate('data.search.aggs.aggGroups.bucketsText', {
    defaultMessage: 'Buckets'
  }),
  [AggGroupNames.Metrics]: _i18n.i18n.translate('data.search.aggs.aggGroups.metricsText', {
    defaultMessage: 'Metrics'
  }),
  [AggGroupNames.None]: _i18n.i18n.translate('data.search.aggs.aggGroups.noneText', {
    defaultMessage: 'None'
  })
};
exports.AggGroupLabels = AggGroupLabels;