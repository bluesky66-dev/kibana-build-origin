"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildEventsHistogramQuery = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _constants = require("../../../../../../common/constants");

var _build_query = require("../../../../../utils/build_query");

var i18n = _interopRequireWildcard(require("./translations"));

var _helpers = require("./helpers");

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


const buildEventsHistogramQuery = ({
  filterQuery,
  timerange: {
    from,
    to
  },
  defaultIndex,
  stackByField = 'event.action',
  threshold
}) => {
  const filter = [...(0, _build_query.createQueryFilterClauses)(filterQuery), {
    range: {
      '@timestamp': {
        gte: from,
        lte: to,
        format: 'strict_date_optional_time'
      }
    }
  }];

  const getHistogramAggregation = () => {
    const interval = (0, _build_query.calculateTimeSeriesInterval)(from, to);
    const histogramTimestampField = '@timestamp';
    const dateHistogram = {
      date_histogram: {
        field: histogramTimestampField,
        fixed_interval: interval,
        min_doc_count: threshold != null ? Number(threshold === null || threshold === void 0 ? void 0 : threshold.value) : 0,
        extended_bounds: {
          min: (0, _moment.default)(from).valueOf(),
          max: (0, _moment.default)(to).valueOf()
        }
      }
    };
    const missing = stackByField != null && _constants.showAllOthersBucket.includes(stackByField) ? {
      missing: stackByField !== null && stackByField !== void 0 && stackByField.endsWith('.ip') ? '0.0.0.0' : i18n.ALL_OTHERS
    } : {};

    if (threshold != null) {
      var _threshold$field;

      const query = {
        eventActionGroup: {
          terms: {
            order: {
              _count: 'desc'
            },
            size: 10
          },
          aggs: {
            events: dateHistogram
          }
        }
      };
      const baseQuery = (0, _helpers.buildThresholdTermsQuery)({
        query,
        fields: (_threshold$field = threshold.field) !== null && _threshold$field !== void 0 ? _threshold$field : [],
        stackByField,
        missing
      });

      if (threshold.cardinality != null) {
        const enrichedQuery = (0, _helpers.buildThresholdCardinalityQuery)({
          query: baseQuery,
          cardinalityField: threshold.cardinality.field[0],
          cardinalityValue: threshold.cardinality.value
        });
        return enrichedQuery;
      }

      return baseQuery;
    }

    return {
      eventActionGroup: {
        terms: {
          field: stackByField,
          ...missing,
          order: {
            _count: 'desc'
          },
          size: 10
        },
        aggs: {
          events: dateHistogram
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
      aggregations: getHistogramAggregation(),
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

exports.buildEventsHistogramQuery = buildEventsHistogramQuery;