"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildAnomaliesHistogramQuery = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _build_query = require("../../../../../utils/build_query");

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


const buildAnomaliesHistogramQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex,
  stackByField = 'job_id'
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      timestamp: {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];

  const getHistogramAggregation = () => {
    const interval = (0, _build_query.calculateTimeSeriesInterval)(from, to);
    const histogramTimestampField = 'timestamp';
    const dateHistogram = {
      date_histogram: {
        field: histogramTimestampField,
        fixed_interval: interval,
        min_doc_count: 0,
        extended_bounds: {
          min: (0, _moment.default)(from).valueOf(),
          max: (0, _moment.default)(to).valueOf()
        }
      }
    };
    return {
      anomalyActionGroup: {
        terms: {
          field: stackByField,
          order: {
            _count: 'desc'
          },
          size: 10
        },
        aggs: {
          anomalies: dateHistogram
        }
      }
    };
  };

  const dslQuery = {
    index: defaultIndex,
    allowNoIndices: true,
    ignoreUnavailable: true,
    track_total_hits: true,
    body: {
      aggs: getHistogramAggregation(),
      query: {
        bool: {
          filter
        }
      },
      size: 0
    }
  };
  return dslQuery;
};

exports.buildAnomaliesHistogramQuery = buildAnomaliesHistogramQuery;