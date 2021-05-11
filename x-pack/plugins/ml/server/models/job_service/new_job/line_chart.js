"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newJobLineChartProvider = newJobLineChartProvider;

var _lodash = require("lodash");

var _fields = require("../../../../common/types/fields");

var _job_utils = require("../../../../common/util/job_utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function newJobLineChartProvider({
  asCurrentUser
}) {
  async function newJobLineChart(indexPatternTitle, timeField, start, end, intervalMs, query, aggFieldNamePairs, splitFieldName, splitFieldValue, runtimeMappings) {
    const json = getSearchJsonFromConfig(indexPatternTitle, timeField, start, end, intervalMs, query, aggFieldNamePairs, splitFieldName, splitFieldValue, runtimeMappings);
    const {
      body
    } = await asCurrentUser.search(json);
    return processSearchResults(body, aggFieldNamePairs.map(af => af.field));
  }

  return {
    newJobLineChart
  };
}

function processSearchResults(resp, fields) {
  const aggregationsByTime = (0, _lodash.get)(resp, ['aggregations', 'times', 'buckets'], []);
  const tempResults = {};
  fields.forEach((f, i) => tempResults[i] = []);
  aggregationsByTime.forEach(dataForTime => {
    const time = +dataForTime.key;
    const docCount = +dataForTime.doc_count;
    fields.forEach((field, i) => {
      let value;

      if (field === _fields.EVENT_RATE_FIELD_ID) {
        value = docCount;
      } else if (typeof dataForTime[i].value !== 'undefined') {
        value = dataForTime[i].value;
      } else if (typeof dataForTime[i].values !== 'undefined') {
        value = dataForTime[i].values[_job_utils.ML_MEDIAN_PERCENTS];
      }

      tempResults[i].push({
        time,
        value
      });
    });
  });
  return {
    success: true,
    results: tempResults,
    totalResults: resp.hits.total.value
  };
}

function getSearchJsonFromConfig(indexPatternTitle, timeField, start, end, intervalMs, query, aggFieldNamePairs, splitFieldName, splitFieldValue, runtimeMappings) {
  const json = {
    index: indexPatternTitle,
    size: 0,
    track_total_hits: true,
    body: {
      query: {},
      aggs: {
        times: {
          date_histogram: {
            field: timeField,
            fixed_interval: `${intervalMs}ms`,
            min_doc_count: 0,
            extended_bounds: {
              min: start,
              max: end
            }
          },
          aggs: {}
        }
      },
      ...(runtimeMappings !== undefined ? {
        runtime_mappings: runtimeMappings
      } : {})
    }
  };

  if (query.bool === undefined) {
    query.bool = {
      must: []
    };
  } else if (query.bool.must === undefined) {
    query.bool.must = [];
  }

  query.bool.must.push({
    range: {
      [timeField]: {
        gte: start,
        lte: end,
        format: 'epoch_millis'
      }
    }
  });

  if (splitFieldName !== null && splitFieldValue !== null) {
    query.bool.must.push({
      term: {
        [splitFieldName]: splitFieldValue
      }
    });
  }

  json.body.query = query;
  const aggs = {};
  aggFieldNamePairs.forEach(({
    agg,
    field
  }, i) => {
    if (field !== null && field !== _fields.EVENT_RATE_FIELD_ID) {
      aggs[i] = {
        [agg]: {
          field
        }
      };

      if (agg === 'percentiles') {
        aggs[i][agg].percents = [_job_utils.ML_MEDIAN_PERCENTS];
      }
    }
  });
  json.body.aggs.times.aggs = aggs;
  return json;
}