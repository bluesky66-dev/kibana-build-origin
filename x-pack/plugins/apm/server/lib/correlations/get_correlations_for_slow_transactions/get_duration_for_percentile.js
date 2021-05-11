"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDurationForPercentile = getDurationForPercentile;

var _elasticsearch_fieldnames = require("../../../../common/elasticsearch_fieldnames");

var _processor_event = require("../../../../common/processor_event");

var _with_apm_span = require("../../../utils/with_apm_span");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getDurationForPercentile({
  durationPercentile,
  backgroundFilters,
  setup
}) {
  return (0, _with_apm_span.withApmSpan)('get_duration_for_percentiles', async () => {
    var _res$aggregations;

    const {
      apmEventClient
    } = setup;
    const res = await apmEventClient.search({
      apm: {
        events: [_processor_event.ProcessorEvent.transaction]
      },
      body: {
        size: 0,
        query: {
          bool: {
            filter: backgroundFilters
          }
        },
        aggs: {
          percentile: {
            percentiles: {
              field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
              percents: [durationPercentile]
            }
          }
        }
      }
    });
    return Object.values(((_res$aggregations = res.aggregations) === null || _res$aggregations === void 0 ? void 0 : _res$aggregations.percentile.values) || {})[0];
  });
}