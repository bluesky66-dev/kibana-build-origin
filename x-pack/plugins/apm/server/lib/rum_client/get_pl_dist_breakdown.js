"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPageLoadDistBreakdown = exports.getBreakdownField = void 0;

var _rum_page_load_transactions = require("../../projections/rum_page_load_transactions");

var _processor_event = require("../../../common/processor_event");

var _merge_projection = require("../../projections/util/merge_projection");

var _elasticsearch_fieldnames = require("../../../common/elasticsearch_fieldnames");

var _get_page_load_distribution = require("./get_page_load_distribution");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getBreakdownField = breakdown => {
  switch (breakdown) {
    case 'Location':
      return _elasticsearch_fieldnames.CLIENT_GEO_COUNTRY_ISO_CODE;

    case 'Device':
      return _elasticsearch_fieldnames.USER_AGENT_DEVICE;

    case 'OS':
      return _elasticsearch_fieldnames.USER_AGENT_OS;

    case 'Browser':
    default:
      return _elasticsearch_fieldnames.USER_AGENT_NAME;
  }
};

exports.getBreakdownField = getBreakdownField;

const getPageLoadDistBreakdown = async ({
  setup,
  minPercentile,
  maxPercentile,
  breakdown,
  urlQuery
}) => {
  // convert secs to micros
  const stepValues = (0, _get_page_load_distribution.getPLDChartSteps)({
    maxDuration: (maxPercentile ? +maxPercentile : 50) * _get_page_load_distribution.MICRO_TO_SEC,
    minDuration: minPercentile ? +minPercentile * _get_page_load_distribution.MICRO_TO_SEC : 0
  });
  const projection = (0, _rum_page_load_transactions.getRumPageLoadTransactionsProjection)({
    setup,
    urlQuery
  });
  const params = (0, _merge_projection.mergeProjection)(projection, {
    apm: {
      events: [_processor_event.ProcessorEvent.transaction]
    },
    body: {
      size: 0,
      aggs: {
        breakdowns: {
          terms: {
            field: getBreakdownField(breakdown),
            size: 9
          },
          aggs: {
            page_dist: {
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
      }
    }
  });
  const {
    apmEventClient
  } = setup;
  const {
    aggregations
  } = await apmEventClient.search(params);
  const pageDistBreakdowns = aggregations === null || aggregations === void 0 ? void 0 : aggregations.breakdowns.buckets;
  return pageDistBreakdowns === null || pageDistBreakdowns === void 0 ? void 0 : pageDistBreakdowns.map(({
    key,
    page_dist: pageDist
  }) => {
    var _pageDist$values;

    let seriesData = (_pageDist$values = pageDist.values) === null || _pageDist$values === void 0 ? void 0 : _pageDist$values.map(({
      key: pKey,
      value
    }, index, arr) => {
      return {
        x: (0, _get_page_load_distribution.microToSec)(pKey),
        y: index === 0 ? value : value - arr[index - 1].value
      };
    }); // remove 0 values from tail

    seriesData = (0, _get_page_load_distribution.removeZeroesFromTail)(seriesData);
    return {
      name: String(key),
      data: seriesData
    };
  });
};

exports.getPageLoadDistBreakdown = getPageLoadDistBreakdown;