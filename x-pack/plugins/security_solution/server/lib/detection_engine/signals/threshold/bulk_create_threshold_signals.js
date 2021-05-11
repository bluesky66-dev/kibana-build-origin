"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkCreateThresholdSignals = exports.transformThresholdResultsToEcs = void 0;

var _fp = require("lodash/fp");

var _setValue = _interopRequireDefault(require("set-value"));

var _utils = require("../../../../../common/detection_engine/utils");

var _single_bulk_create = require("../single_bulk_create");

var _utils2 = require("../utils");

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


const getTransformedHits = (results, inputIndex, startedAt, from, logger, threshold, ruleId, filter, timestampOverride, thresholdSignalHistory) => {
  const aggParts = threshold.field.length ? results.aggregations && (0, _utils2.getThresholdAggregationParts)(results.aggregations) : {
    field: null,
    index: 0,
    name: 'threshold_0'
  };

  if (!aggParts) {
    return [];
  }

  const getCombinations = (buckets, i, field) => {
    return buckets.reduce((acc, bucket) => {
      if (i < threshold.field.length - 1) {
        const nextLevelIdx = i + 1;
        const nextLevelAggParts = (0, _utils2.getThresholdAggregationParts)(bucket, nextLevelIdx);

        if (nextLevelAggParts == null) {
          throw new Error('Unable to parse aggregation.');
        }

        const nextLevelPath = `['${nextLevelAggParts.name}']['buckets']`;
        const nextBuckets = (0, _fp.get)(nextLevelPath, bucket);
        const combinations = getCombinations(nextBuckets, nextLevelIdx, nextLevelAggParts.field);
        combinations.forEach(val => {
          const el = {
            terms: [{
              field,
              value: bucket.key
            }, ...val.terms].filter(term => term.field != null),
            cardinality: val.cardinality,
            topThresholdHits: val.topThresholdHits,
            docCount: val.docCount
          };
          acc.push(el);
        });
      } else {
        var _threshold$cardinalit;

        const el = {
          terms: [{
            field,
            value: bucket.key
          }].filter(term => term.field != null),
          cardinality: (_threshold$cardinalit = threshold.cardinality) !== null && _threshold$cardinalit !== void 0 && _threshold$cardinalit.length ? [{
            field: threshold.cardinality[0].field,
            value: bucket.cardinality_count.value
          }] : undefined,
          topThresholdHits: bucket.top_threshold_hits,
          docCount: bucket.doc_count
        };
        acc.push(el);
      }

      return acc;
    }, []);
  }; // Recurse through the nested buckets and collect each unique combination of terms. Collect the
  // cardinality and document count from the leaf buckets and return a signal for each set of terms.


  return getCombinations(results.aggregations[aggParts.name].buckets, 0, aggParts.field).reduce((acc, bucket) => {
    var _bucket$topThresholdH;

    const hit = (_bucket$topThresholdH = bucket.topThresholdHits) === null || _bucket$topThresholdH === void 0 ? void 0 : _bucket$topThresholdH.hits.hits[0];

    if (hit == null) {
      return acc;
    }

    const timestampArray = (0, _fp.get)(timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp', hit.fields);

    if (timestampArray == null) {
      return acc;
    }

    const timestamp = timestampArray[0];

    if (typeof timestamp !== 'string') {
      return acc;
    }

    const termsHash = (0, _utils2.getThresholdTermsHash)(bucket.terms);
    const signalHit = thresholdSignalHistory[termsHash];
    const source = {
      '@timestamp': timestamp,
      ...bucket.terms.reduce((termAcc, term) => {
        if (!term.field.startsWith('signal.')) {
          return { ...termAcc,
            [term.field]: term.value
          };
        }

        return termAcc;
      }, {}),
      threshold_result: {
        terms: bucket.terms,
        cardinality: bucket.cardinality,
        count: bucket.docCount,
        // Store `from` in the signal so that we know the lower bound for the
        // threshold set in the timeline search. The upper bound will always be
        // the `original_time` of the signal (the timestamp of the latest event
        // in the set).
        from: (signalHit === null || signalHit === void 0 ? void 0 : signalHit.lastSignalTimestamp) != null ? new Date(signalHit.lastSignalTimestamp) : from
      }
    };
    acc.push({
      _index: inputIndex,
      _id: (0, _utils2.calculateThresholdSignalUuid)(ruleId, startedAt, threshold.field, bucket.terms.map(term => term.value).sort().join(',')),
      _source: source
    });
    return acc;
  }, []);
};

const transformThresholdResultsToEcs = (results, inputIndex, startedAt, from, filter, logger, threshold, ruleId, timestampOverride, thresholdSignalHistory) => {
  const transformedHits = getTransformedHits(results, inputIndex, startedAt, from, logger, threshold, ruleId, filter, timestampOverride, thresholdSignalHistory);
  const thresholdResults = { ...results,
    hits: { ...results.hits,
      hits: transformedHits
    }
  };
  delete thresholdResults.aggregations; // delete because no longer needed

  (0, _setValue.default)(thresholdResults, 'results.hits.total', transformedHits.length);
  return thresholdResults;
};

exports.transformThresholdResultsToEcs = transformThresholdResultsToEcs;

const bulkCreateThresholdSignals = async params => {
  const thresholdResults = params.someResult;
  const threshold = params.ruleParams.threshold;
  const ecsResults = transformThresholdResultsToEcs(thresholdResults, params.inputIndexPattern.join(','), params.startedAt, params.from, params.filter, params.logger, { ...threshold,
    field: (0, _utils.normalizeThresholdField)(threshold.field)
  }, params.ruleParams.ruleId, params.timestampOverride, params.thresholdSignalHistory);
  const buildRuleMessage = params.buildRuleMessage;
  return (0, _single_bulk_create.singleBulkCreate)({ ...params,
    filteredEvents: ecsResults,
    buildRuleMessage
  });
};

exports.bulkCreateThresholdSignals = bulkCreateThresholdSignals;