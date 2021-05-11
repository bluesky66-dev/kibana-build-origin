"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.microToSec = microToSec;
exports.removeZeroesFromTail = removeZeroesFromTail;
exports.getPageLoadDistribution = getPageLoadDistribution;
exports.getPLDChartSteps = exports.MICRO_TO_SEC = void 0;

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _merge_projection = require("../../projections/util/merge_projection");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MICRO_TO_SEC = 1000000;
exports.MICRO_TO_SEC = MICRO_TO_SEC;

function microToSec(val) {
  return Math.round((val / MICRO_TO_SEC + Number.EPSILON) * 100) / 100;
}

function removeZeroesFromTail(distData) {
  if (distData.length > 0) {
    while (distData[distData.length - 1].y === 0) {
      distData.pop();
    }
  }

  return distData;
}

const getPLDChartSteps = ({
  maxDuration,
  minDuration,
  initStepValue
}) => {
  let stepValue = 0.5; // if diff is too low, let's lower
  // down the steps value to increase steps

  if (maxDuration - minDuration <= 5 * MICRO_TO_SEC) {
    stepValue = 0.1;
  }

  if (initStepValue) {
    stepValue = initStepValue;
  }

  let initValue = minDuration;
  const stepValues = [initValue];

  while (initValue < maxDuration) {
    initValue += stepValue * MICRO_TO_SEC;
    stepValues.push(initValue);
  }

  return stepValues;
};

exports.getPLDChartSteps = getPLDChartSteps;

async function getPageLoadDistribution({
  setup,
  minPercentile,
  maxPercentile,
  urlQuery
}) {
  var _loadDistribution$val, _durPercentiles$value, _durPercentiles$value2;

  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  }); // we will first get 100 steps using 0sec and 50sec duration,
  // most web apps will cover this use case
  // if 99th percentile is greater than 50sec,
  // we will fetch additional 5 steps beyond 99th percentile

  let maxDuration = (maxPercentile ? +maxPercentile : 50) * MICRO_TO_SEC;
  const minDuration = minPercentile ? +minPercentile * MICRO_TO_SEC : 0;
  const stepValues = getPLDChartSteps({
    maxDuration,
    minDuration
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      aggs: {
        durPercentiles: {
          percentiles: {
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            percents: [50, 75, 90, 95, 99],
            hdr: {
              number_of_significant_value_digits: 3
            }
          }
        },
        loadDistribution: {
          percentile_ranks: {
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            values: stepValues,
            keyed: false,
            hdr: {
              number_of_significant_value_digits: 3
            }
          }
        }
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const {
    aggregations,
    hits: {
      total
    }
  } = await apmEventClient.search(params);

  if (total.value === 0) {
    return null;
  }

  const {
    durPercentiles,
    loadDistribution
  } = aggregations !== null && aggregations !== void 0 ? aggregations : {};
  let pageDistVals = (_loadDistribution$val = loadDistribution === null || loadDistribution === void 0 ? void 0 : loadDistribution.values) !== null && _loadDistribution$val !== void 0 ? _loadDistribution$val : [];
  const maxPercQuery = (_durPercentiles$value = durPercentiles === null || durPercentiles === void 0 ? void 0 : durPercentiles.values['99.0']) !== null && _durPercentiles$value !== void 0 ? _durPercentiles$value : 0; // we assumed that page load will never exceed 50secs, if 99th percentile is
  // greater then let's fetch additional 10 steps, to cover that on the chart

  if (maxPercQuery > maxDuration && !maxPercentile) {
    const additionalStepsPageVals = await getPercentilesDistribution({
      setup,
      maxDuration: maxPercQuery,
      // we pass 50sec as min to get next steps
      minDuration: maxDuration
    });
    pageDistVals = pageDistVals.concat(additionalStepsPageVals);
    maxDuration = maxPercQuery;
  } // calculate the diff to get actual page load on specific duration value


  let pageDist = pageDistVals.map(({
    key,
    value
  }, index, arr) => {
    return {
      x: microToSec(key),
      y: index === 0 ? value : value - arr[index - 1].value
    };
  });
  pageDist = removeZeroesFromTail(pageDist);
  Object.entries((_durPercentiles$value2 = durPercentiles === null || durPercentiles === void 0 ? void 0 : durPercentiles.values) !== null && _durPercentiles$value2 !== void 0 ? _durPercentiles$value2 : {}).forEach(([key, val]) => {
    var _durPercentiles$value3;

    if (durPercentiles !== null && durPercentiles !== void 0 && (_durPercentiles$value3 = durPercentiles.values) !== null && _durPercentiles$value3 !== void 0 && _durPercentiles$value3[key]) {
      durPercentiles.values[key] = microToSec(val);
    }
  });
  return {
    pageLoadDistribution: pageDist,
    percentiles: durPercentiles === null || durPercentiles === void 0 ? void 0 : durPercentiles.values,
    minDuration: microToSec(minDuration),
    maxDuration: microToSec(maxDuration)
  };
}

const getPercentilesDistribution = async ({
  setup,
  minDuration,
  maxDuration
}) => {
  var _aggregations$loadDis;

  const stepValues = getPLDChartSteps({
    minDuration: minDuration + 0.5 * MICRO_TO_SEC,
    maxDuration,
    initStepValue: 0.5
  });
  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      aggs: {
        loadDistribution: {
          percentile_ranks: {
            field: _elasticsearch_fieldnames.TRANSACTION_DURATION,
            values: stepValues,
            keyed: false,
            hdr: {
              number_of_significant_value_digits: 3
            }
          }
        }
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const {
    aggregations
  } = await apmEventClient.search(params);
  return (_aggregations$loadDis = aggregations === null || aggregations === void 0 ? void 0 : aggregations.loadDistribution.values) !== null && _aggregations$loadDis !== void 0 ? _aggregations$loadDis : [];
};