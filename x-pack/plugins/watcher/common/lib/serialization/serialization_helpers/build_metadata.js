"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildMetadata = buildMetadata;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/*
watch.metadata
 */

function buildMetadata({
  index,
  timeField,
  triggerIntervalSize,
  triggerIntervalUnit,
  aggType,
  aggField,
  termSize,
  termField,
  thresholdComparator,
  timeWindowSize,
  timeWindowUnit,
  threshold
}) {
  return {
    watcherui: {
      index,
      time_field: timeField,
      trigger_interval_size: triggerIntervalSize,
      trigger_interval_unit: triggerIntervalUnit,
      agg_type: aggType,
      agg_field: aggField,
      term_size: termSize,
      term_field: termField,
      threshold_comparator: thresholdComparator,
      time_window_size: timeWindowSize,
      time_window_unit: timeWindowUnit,
      threshold
    }
  };
}