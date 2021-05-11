"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.beatsAggResponseHandler = exports.beatsUuidsAgg = exports.beatsAggFilterPath = exports.getDiffCalculation = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getDiffCalculation = (max, min) => {
  // no need to test max >= 0, but min <= 0 which is normal for a derivative after restart
  // because we are aggregating/collapsing on ephemeral_ids
  if (max !== null && min !== null && max >= 0 && min >= 0 && max >= min) {
    return max - min;
  }

  return null;
};

exports.getDiffCalculation = getDiffCalculation;
const beatsAggFilterPath = ['aggregations.total', 'aggregations.types.buckets.key', 'aggregations.types.buckets.uuids.buckets.doc_count', 'aggregations.min_events_total.value', 'aggregations.max_events_total.value', 'aggregations.min_bytes_sent_total.value', 'aggregations.max_bytes_sent_total.value'];
exports.beatsAggFilterPath = beatsAggFilterPath;

const beatsUuidsAgg = maxBucketSize => ({
  types: {
    terms: {
      field: 'beats_stats.beat.type',
      size: 1000 // 1000 different types of beats possible seems like enough

    },
    aggs: {
      uuids: {
        terms: {
          field: 'beats_stats.beat.uuid',
          size: maxBucketSize
        }
      }
    }
  },
  total: {
    cardinality: {
      field: 'beats_stats.beat.uuid',
      precision_threshold: 10000
    }
  },
  ephemeral_ids: {
    terms: {
      field: 'beats_stats.metrics.beat.info.ephemeral_id',
      size: maxBucketSize
    },
    aggs: {
      min_events: {
        min: {
          field: 'beats_stats.metrics.libbeat.pipeline.events.total'
        }
      },
      max_events: {
        max: {
          field: 'beats_stats.metrics.libbeat.pipeline.events.total'
        }
      },
      min_bytes_sent: {
        min: {
          field: 'beats_stats.metrics.libbeat.output.write.bytes'
        }
      },
      max_bytes_sent: {
        max: {
          field: 'beats_stats.metrics.libbeat.output.write.bytes'
        }
      }
    }
  },
  min_events_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>min_events'
    }
  },
  max_events_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>max_events'
    }
  },
  min_bytes_sent_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>min_bytes_sent'
    }
  },
  max_bytes_sent_total: {
    sum_bucket: {
      buckets_path: 'ephemeral_ids>max_bytes_sent'
    }
  }
});

exports.beatsUuidsAgg = beatsUuidsAgg;

const beatsAggResponseHandler = response => {
  // beat types stat
  const buckets = (0, _lodash.get)(response, 'aggregations.types.buckets', []);
  const beatTotal = (0, _lodash.get)(response, 'aggregations.total.value', null);
  const beatTypes = buckets.reduce((types, typeBucket) => {
    return [...types, {
      type: (0, _lodash.upperFirst)(typeBucket.key),
      count: (0, _lodash.get)(typeBucket, 'uuids.buckets.length')
    }];
  }, []);
  const eventsTotalMax = (0, _lodash.get)(response, 'aggregations.max_events_total.value', null);
  const eventsTotalMin = (0, _lodash.get)(response, 'aggregations.min_events_total.value', null);
  const bytesSentMax = (0, _lodash.get)(response, 'aggregations.max_bytes_sent_total.value', null);
  const bytesSentMin = (0, _lodash.get)(response, 'aggregations.min_bytes_sent_total.value', null);
  return {
    beatTotal,
    beatTypes,
    totalEvents: getDiffCalculation(eventsTotalMax, eventsTotalMin),
    bytesSent: getDiffCalculation(bytesSentMax, bytesSentMin)
  };
};

exports.beatsAggResponseHandler = beatsAggResponseHandler;