"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findThresholdSignals = void 0;

var _saferLodashSet = require("@elastic/safer-lodash-set");

var _utils = require("../../../../../common/detection_engine/utils");

var _single_search_after = require("../single_search_after");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findThresholdSignals = async ({
  from,
  to,
  inputIndexPattern,
  services,
  logger,
  filter,
  threshold,
  buildRuleMessage,
  timestampOverride
}) => {
  var _threshold$cardinalit; // Leaf aggregations used below


  const leafAggs = {
    top_threshold_hits: {
      top_hits: {
        sort: [{
          [timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp']: {
            order: 'desc'
          }
        }],
        fields: [{
          field: '*',
          include_unmapped: true
        }],
        size: 1
      }
    },
    ...((_threshold$cardinalit = threshold.cardinality) !== null && _threshold$cardinalit !== void 0 && _threshold$cardinalit.length ? {
      cardinality_count: {
        cardinality: {
          field: threshold.cardinality[0].field
        }
      },
      cardinality_check: {
        bucket_selector: {
          buckets_path: {
            cardinalityCount: 'cardinality_count'
          },
          script: `params.cardinalityCount >= ${threshold.cardinality[0].value}` // TODO: cardinality operator

        }
      }
    } : {})
  };
  const thresholdFields = (0, _utils.normalizeThresholdField)(threshold.field); // Generate a nested terms aggregation for each threshold grouping field provided, appending leaf
  // aggregations to 1) filter out buckets that don't meet the cardinality threshold, if provided, and
  // 2) return the latest hit for each bucket so that we can persist the timestamp of the event in the
  // `original_time` of the signal. This will be used for dupe mitigation purposes by the detection
  // engine.

  const aggregations = thresholdFields.length ? thresholdFields.reduce((acc, field, i) => {
    var _thresholdFields$leng;

    const aggPath = [...Array(i + 1).keys()].map(j => {
      return `['threshold_${j}:${thresholdFields[j]}']`;
    }).join(`['aggs']`);
    (0, _saferLodashSet.set)(acc, aggPath, {
      terms: {
        field,
        min_doc_count: threshold.value,
        // not needed on parent agg, but can help narrow down result set
        size: 10000 // max 10k buckets

      }
    });

    if (i === ((_thresholdFields$leng = thresholdFields.length) !== null && _thresholdFields$leng !== void 0 ? _thresholdFields$leng : 0) - 1) {
      (0, _saferLodashSet.set)(acc, `${aggPath}['aggs']`, leafAggs);
    }

    return acc;
  }, {}) : {
    // No threshold grouping fields provided
    threshold_0: {
      terms: {
        script: {
          source: '""',
          // Group everything in the same bucket
          lang: 'painless'
        },
        min_doc_count: threshold.value
      },
      aggs: leafAggs
    }
  };
  return (0, _single_search_after.singleSearchAfter)({
    aggregations,
    searchAfterSortId: undefined,
    timestampOverride,
    index: inputIndexPattern,
    from,
    to,
    services,
    logger,
    filter,
    pageSize: 1,
    sortOrder: 'desc',
    buildRuleMessage,
    excludeDocsWithTimestampOverride: false
  });
};

exports.findThresholdSignals = findThresholdSignals;