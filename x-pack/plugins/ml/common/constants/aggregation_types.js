"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aggregations = exports.mlOnlyAggregations = exports.ES_AGGREGATION = exports.KIBANA_AGGREGATION = exports.SPARSE_DATA_AGGREGATIONS = exports.ML_JOB_AGGREGATION = void 0;

var _fields = require("../types/fields");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let ML_JOB_AGGREGATION;
exports.ML_JOB_AGGREGATION = ML_JOB_AGGREGATION;

(function (ML_JOB_AGGREGATION) {
  ML_JOB_AGGREGATION["COUNT"] = "count";
  ML_JOB_AGGREGATION["HIGH_COUNT"] = "high_count";
  ML_JOB_AGGREGATION["LOW_COUNT"] = "low_count";
  ML_JOB_AGGREGATION["NON_ZERO_COUNT"] = "non_zero_count";
  ML_JOB_AGGREGATION["HIGH_NON_ZERO_COUNT"] = "high_non_zero_count";
  ML_JOB_AGGREGATION["LOW_NON_ZERO_COUNT"] = "low_non_zero_count";
  ML_JOB_AGGREGATION["DISTINCT_COUNT"] = "distinct_count";
  ML_JOB_AGGREGATION["HIGH_DISTINCT_COUNT"] = "high_distinct_count";
  ML_JOB_AGGREGATION["LOW_DISTINCT_COUNT"] = "low_distinct_count";
  ML_JOB_AGGREGATION["MIN"] = "min";
  ML_JOB_AGGREGATION["MAX"] = "max";
  ML_JOB_AGGREGATION["MEDIAN"] = "median";
  ML_JOB_AGGREGATION["LOW_MEDIAN"] = "low_median";
  ML_JOB_AGGREGATION["HIGH_MEAN"] = "high_mean";
  ML_JOB_AGGREGATION["MEAN"] = "mean";
  ML_JOB_AGGREGATION["LOW_MEAN"] = "low_mean";
  ML_JOB_AGGREGATION["HIGH_MEDIAN"] = "high_median";
  ML_JOB_AGGREGATION["METRIC"] = "metric";
  ML_JOB_AGGREGATION["VARP"] = "varp";
  ML_JOB_AGGREGATION["HIGH_VARP"] = "high_varp";
  ML_JOB_AGGREGATION["LOW_VARP"] = "low_varp";
  ML_JOB_AGGREGATION["SUM"] = "sum";
  ML_JOB_AGGREGATION["HIGH_SUM"] = "high_sum";
  ML_JOB_AGGREGATION["LOW_SUM"] = "low_sum";
  ML_JOB_AGGREGATION["NON_NULL_SUM"] = "non_null_sum";
  ML_JOB_AGGREGATION["HIGH_NON_NULL_SUM"] = "high_non_null_sum";
  ML_JOB_AGGREGATION["LOW_NON_NULL_SUM"] = "low_non_null_sum";
  ML_JOB_AGGREGATION["RARE"] = "rare";
  ML_JOB_AGGREGATION["FREQ_RARE"] = "freq_rare";
  ML_JOB_AGGREGATION["INFO_CONTENT"] = "info_content";
  ML_JOB_AGGREGATION["HIGH_INFO_CONTENT"] = "high_info_content";
  ML_JOB_AGGREGATION["LOW_INFO_CONTENT"] = "low_info_content";
  ML_JOB_AGGREGATION["TIME_OF_DAY"] = "time_of_day";
  ML_JOB_AGGREGATION["TIME_OF_WEEK"] = "time_of_week";
  ML_JOB_AGGREGATION["LAT_LONG"] = "lat_long";
})(ML_JOB_AGGREGATION || (exports.ML_JOB_AGGREGATION = ML_JOB_AGGREGATION = {}));

const SPARSE_DATA_AGGREGATIONS = [ML_JOB_AGGREGATION.NON_ZERO_COUNT, ML_JOB_AGGREGATION.HIGH_NON_ZERO_COUNT, ML_JOB_AGGREGATION.LOW_NON_ZERO_COUNT, ML_JOB_AGGREGATION.NON_NULL_SUM, ML_JOB_AGGREGATION.HIGH_NON_NULL_SUM, ML_JOB_AGGREGATION.LOW_NON_NULL_SUM];
exports.SPARSE_DATA_AGGREGATIONS = SPARSE_DATA_AGGREGATIONS;
let KIBANA_AGGREGATION;
exports.KIBANA_AGGREGATION = KIBANA_AGGREGATION;

(function (KIBANA_AGGREGATION) {
  KIBANA_AGGREGATION["COUNT"] = "count";
  KIBANA_AGGREGATION["AVG"] = "avg";
  KIBANA_AGGREGATION["MAX"] = "max";
  KIBANA_AGGREGATION["MIN"] = "min";
  KIBANA_AGGREGATION["SUM"] = "sum";
  KIBANA_AGGREGATION["MEDIAN"] = "median";
  KIBANA_AGGREGATION["CARDINALITY"] = "cardinality";
})(KIBANA_AGGREGATION || (exports.KIBANA_AGGREGATION = KIBANA_AGGREGATION = {}));

let ES_AGGREGATION; // aggregation object missing id, title and fields and has null for kibana and dsl aggregation names.
// this is used as the basis for the ML only aggregations

exports.ES_AGGREGATION = ES_AGGREGATION;

(function (ES_AGGREGATION) {
  ES_AGGREGATION["COUNT"] = "count";
  ES_AGGREGATION["AVG"] = "avg";
  ES_AGGREGATION["MAX"] = "max";
  ES_AGGREGATION["MIN"] = "min";
  ES_AGGREGATION["SUM"] = "sum";
  ES_AGGREGATION["PERCENTILES"] = "percentiles";
  ES_AGGREGATION["CARDINALITY"] = "cardinality";
})(ES_AGGREGATION || (exports.ES_AGGREGATION = ES_AGGREGATION = {}));

function getBasicMlOnlyAggregation() {
  return {
    kibanaName: null,
    dslName: null,
    type: _fields.METRIC_AGG_TYPE,
    mlModelPlotAgg: {
      max: KIBANA_AGGREGATION.MAX,
      min: KIBANA_AGGREGATION.MIN
    }
  };
} // list of aggregations only support by ML and which don't have an equivalent ES aggregation
// note, not all aggs have a field list. Some aggs cannot be used with a field.


const mlOnlyAggregations = [{
  id: ML_JOB_AGGREGATION.NON_ZERO_COUNT,
  title: 'Non zero count',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.HIGH_NON_ZERO_COUNT,
  title: 'High non zero count',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LOW_NON_ZERO_COUNT,
  title: 'Low non zero count',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.HIGH_DISTINCT_COUNT,
  title: 'High distinct count',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LOW_DISTINCT_COUNT,
  title: 'Low distinct count',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.METRIC,
  title: 'Metric',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.VARP,
  title: 'varp',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.HIGH_VARP,
  title: 'High varp',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LOW_VARP,
  title: 'Low varp',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.NON_NULL_SUM,
  title: 'Non null sum',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.HIGH_NON_NULL_SUM,
  title: 'High non null sum',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LOW_NON_NULL_SUM,
  title: 'Low non null sum',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.RARE,
  title: 'Rare',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.FREQ_RARE,
  title: 'Freq rare',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.INFO_CONTENT,
  title: 'Info content',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.HIGH_INFO_CONTENT,
  title: 'High info content',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LOW_INFO_CONTENT,
  title: 'Low info content',
  fields: [],
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.TIME_OF_DAY,
  title: 'Time of day',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.TIME_OF_WEEK,
  title: 'Time of week',
  ...getBasicMlOnlyAggregation()
}, {
  id: ML_JOB_AGGREGATION.LAT_LONG,
  title: 'Lat long',
  fields: [],
  ...getBasicMlOnlyAggregation()
}];
exports.mlOnlyAggregations = mlOnlyAggregations;
const aggregations = [{
  id: ML_JOB_AGGREGATION.COUNT,
  title: 'Count',
  kibanaName: KIBANA_AGGREGATION.COUNT,
  dslName: ES_AGGREGATION.COUNT,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  }
}, {
  id: ML_JOB_AGGREGATION.HIGH_COUNT,
  title: 'High count',
  kibanaName: KIBANA_AGGREGATION.COUNT,
  dslName: ES_AGGREGATION.COUNT,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  }
}, {
  id: ML_JOB_AGGREGATION.LOW_COUNT,
  title: 'Low count',
  kibanaName: KIBANA_AGGREGATION.COUNT,
  dslName: ES_AGGREGATION.COUNT,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  }
}, {
  id: ML_JOB_AGGREGATION.MEAN,
  title: 'Mean',
  kibanaName: KIBANA_AGGREGATION.AVG,
  dslName: ES_AGGREGATION.AVG,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.AVG,
    min: KIBANA_AGGREGATION.AVG
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.HIGH_MEAN,
  title: 'High mean',
  kibanaName: KIBANA_AGGREGATION.AVG,
  dslName: ES_AGGREGATION.AVG,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.AVG,
    min: KIBANA_AGGREGATION.AVG
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.LOW_MEAN,
  title: 'Low mean',
  kibanaName: KIBANA_AGGREGATION.AVG,
  dslName: ES_AGGREGATION.AVG,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.AVG,
    min: KIBANA_AGGREGATION.AVG
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.SUM,
  title: 'Sum',
  kibanaName: KIBANA_AGGREGATION.SUM,
  dslName: ES_AGGREGATION.SUM,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.SUM,
    min: KIBANA_AGGREGATION.SUM
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.HIGH_SUM,
  title: 'High sum',
  kibanaName: KIBANA_AGGREGATION.SUM,
  dslName: ES_AGGREGATION.SUM,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.SUM,
    min: KIBANA_AGGREGATION.SUM
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.LOW_SUM,
  title: 'Low sum',
  kibanaName: KIBANA_AGGREGATION.SUM,
  dslName: ES_AGGREGATION.SUM,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.SUM,
    min: KIBANA_AGGREGATION.SUM
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.MEDIAN,
  title: 'Median',
  kibanaName: KIBANA_AGGREGATION.MEDIAN,
  dslName: ES_AGGREGATION.PERCENTILES,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.HIGH_MEDIAN,
  title: 'High median',
  kibanaName: KIBANA_AGGREGATION.MEDIAN,
  dslName: ES_AGGREGATION.PERCENTILES,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.LOW_MEDIAN,
  title: 'Low median',
  kibanaName: KIBANA_AGGREGATION.MEDIAN,
  dslName: ES_AGGREGATION.PERCENTILES,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.MIN,
  title: 'Min',
  kibanaName: KIBANA_AGGREGATION.MIN,
  dslName: ES_AGGREGATION.MIN,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MIN,
    min: KIBANA_AGGREGATION.MIN
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.MAX,
  title: 'Max',
  kibanaName: KIBANA_AGGREGATION.MAX,
  dslName: ES_AGGREGATION.MAX,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MAX
  },
  fields: []
}, {
  id: ML_JOB_AGGREGATION.DISTINCT_COUNT,
  title: 'Distinct count',
  kibanaName: KIBANA_AGGREGATION.CARDINALITY,
  dslName: ES_AGGREGATION.CARDINALITY,
  type: _fields.METRIC_AGG_TYPE,
  mlModelPlotAgg: {
    max: KIBANA_AGGREGATION.MAX,
    min: KIBANA_AGGREGATION.MIN
  },
  fields: []
}];
exports.aggregations = aggregations;