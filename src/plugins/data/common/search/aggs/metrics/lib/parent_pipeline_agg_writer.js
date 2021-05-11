"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parentPipelineAggWriter = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const parentPipelineAggWriter = (agg, output, aggConfigs) => {
  const customMetric = agg.getParam('customMetric');
  const metricAgg = agg.getParam('metricAgg');
  const selectedMetric = customMetric || aggConfigs && aggConfigs.getResponseAggById(metricAgg);

  if (customMetric && customMetric.type.name !== 'count') {
    output.parentAggs = (output.parentAggs || []).concat(selectedMetric);
  }

  output.params = {
    buckets_path: selectedMetric.type.name === 'count' ? '_count' : selectedMetric.id
  };
};

exports.parentPipelineAggWriter = parentPipelineAggWriter;