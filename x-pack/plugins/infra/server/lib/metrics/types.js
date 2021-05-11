"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GroupingResponseRT = exports.HistogramResponseRT = exports.HistogramBucketRT = exports.TermsWithMetrics = exports.MetricValueTypeRT = exports.TopHitsTypeRT = exports.PercentilesKeyedTypeRT = exports.PercentilesTypeRT = exports.NormalizedMetricValueRT = exports.BasicMetricValueRT = void 0;

var rt = _interopRequireWildcard(require("io-ts"));

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const NumberOrNullRT = rt.union([rt.number, rt.null]);
const BasicMetricValueRT = rt.type({
  value: NumberOrNullRT
});
exports.BasicMetricValueRT = BasicMetricValueRT;
const NormalizedMetricValueRT = rt.intersection([BasicMetricValueRT, rt.type({
  normalized_value: NumberOrNullRT
})]);
exports.NormalizedMetricValueRT = NormalizedMetricValueRT;
const PercentilesTypeRT = rt.type({
  values: rt.record(rt.string, NumberOrNullRT)
});
exports.PercentilesTypeRT = PercentilesTypeRT;
const PercentilesKeyedTypeRT = rt.type({
  values: rt.array(rt.type({
    key: rt.string,
    value: NumberOrNullRT
  }))
});
exports.PercentilesKeyedTypeRT = PercentilesKeyedTypeRT;
const TopHitsTypeRT = rt.type({
  hits: rt.type({
    total: rt.type({
      value: rt.number,
      relation: rt.string
    }),
    hits: rt.array(rt.intersection([rt.type({
      _index: rt.string,
      _id: rt.string,
      _score: NumberOrNullRT,
      _source: rt.object
    }), rt.partial({
      sort: rt.array(rt.union([rt.string, rt.number])),
      max_score: NumberOrNullRT
    })]))
  })
});
exports.TopHitsTypeRT = TopHitsTypeRT;
const MetricValueTypeRT = rt.union([BasicMetricValueRT, NormalizedMetricValueRT, PercentilesTypeRT, PercentilesKeyedTypeRT, TopHitsTypeRT]);
exports.MetricValueTypeRT = MetricValueTypeRT;
const TermsWithMetrics = rt.intersection([rt.type({
  buckets: rt.array(rt.record(rt.string, rt.union([rt.number, rt.string, MetricValueTypeRT])))
}), rt.partial({
  sum_other_doc_count: rt.number,
  doc_count_error_upper_bound: rt.number
})]);
exports.TermsWithMetrics = TermsWithMetrics;
const HistogramBucketRT = rt.record(rt.string, rt.union([rt.number, rt.string, MetricValueTypeRT, TermsWithMetrics]));
exports.HistogramBucketRT = HistogramBucketRT;
const HistogramResponseRT = rt.type({
  histogram: rt.type({
    buckets: rt.array(HistogramBucketRT)
  })
});
exports.HistogramResponseRT = HistogramResponseRT;
const GroupingBucketRT = rt.intersection([rt.type({
  key: rt.record(rt.string, rt.string),
  doc_count: rt.number
}), HistogramResponseRT]);
const GroupingResponseRT = rt.type({
  groupings: rt.intersection([rt.type({
    buckets: rt.array(GroupingBucketRT)
  }), rt.partial({
    after_key: rt.record(rt.string, rt.string)
  })])
});
exports.GroupingResponseRT = GroupingResponseRT;