"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdSignalHistory = void 0;

var _find_previous_threshold_signals = require("./find_previous_threshold_signals");

var _utils = require("../utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getThresholdSignalHistory = async ({
  from,
  to,
  indexPattern,
  services,
  logger,
  ruleId,
  bucketByFields,
  timestampOverride,
  buildRuleMessage
}) => {
  const {
    searchResult,
    searchErrors
  } = await (0, _find_previous_threshold_signals.findPreviousThresholdSignals)({
    indexPattern,
    from,
    to,
    services,
    logger,
    ruleId,
    bucketByFields,
    timestampOverride,
    buildRuleMessage
  });
  const thresholdSignalHistory = searchResult.hits.hits.reduce((acc, hit) => {
    var _hit$_source$signal, _hit$_source$signal$t, _field, _hit$_source$signal2, _hit$_source$signal3, _hit$_source$signal4, _hit$_source$signal5;

    if (!hit._source) {
      return acc;
    }

    const terms = ((_hit$_source$signal = hit._source.signal) === null || _hit$_source$signal === void 0 ? void 0 : (_hit$_source$signal$t = _hit$_source$signal.threshold_result) === null || _hit$_source$signal$t === void 0 ? void 0 : _hit$_source$signal$t.terms) != null ? hit._source.signal.threshold_result.terms : [// Pre-7.12 signals
    {
      field: (_field = ((_hit$_source$signal2 = hit._source.signal) === null || _hit$_source$signal2 === void 0 ? void 0 : _hit$_source$signal2.rule).threshold.field) !== null && _field !== void 0 ? _field : '',
      value: ((_hit$_source$signal3 = hit._source.signal) === null || _hit$_source$signal3 === void 0 ? void 0 : _hit$_source$signal3.threshold_result).value
    }];
    const hash = (0, _utils.getThresholdTermsHash)(terms);
    const existing = acc[hash];
    const originalTime = ((_hit$_source$signal4 = hit._source.signal) === null || _hit$_source$signal4 === void 0 ? void 0 : _hit$_source$signal4.original_time) != null ? new Date((_hit$_source$signal5 = hit._source.signal) === null || _hit$_source$signal5 === void 0 ? void 0 : _hit$_source$signal5.original_time).getTime() : undefined;

    if (existing != null) {
      if (originalTime && originalTime > existing.lastSignalTimestamp) {
        acc[hash].lastSignalTimestamp = originalTime;
      }
    } else if (originalTime) {
      acc[hash] = {
        terms,
        lastSignalTimestamp: originalTime
      };
    }

    return acc;
  }, {});
  return {
    thresholdSignalHistory,
    searchErrors
  };
};

exports.getThresholdSignalHistory = getThresholdSignalHistory;