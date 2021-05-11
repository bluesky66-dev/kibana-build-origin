"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleStatusText = exports.normalizeThresholdField = exports.isThreatMatchRule = exports.isQueryRule = exports.isThresholdRule = exports.isEqlRule = exports.hasEqlSequenceQuery = exports.hasNestedEntry = exports.hasLargeValueList = exports.hasLargeValueItem = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const hasLargeValueItem = exceptionItems => {
  return exceptionItems.some(exceptionItem => hasLargeValueList(exceptionItem.entries));
};

exports.hasLargeValueItem = hasLargeValueItem;

const hasLargeValueList = entries => {
  const found = entries.filter(({
    type
  }) => type === 'list');
  return found.length > 0;
};

exports.hasLargeValueList = hasLargeValueList;

const hasNestedEntry = entries => {
  const found = entries.filter(({
    type
  }) => type === 'nested');
  return found.length > 0;
};

exports.hasNestedEntry = hasNestedEntry;

const hasEqlSequenceQuery = ruleQuery => {
  if (ruleQuery != null) {
    const parsedQuery = ruleQuery.trim().split(/[ \t\r\n]+/);
    return parsedQuery[0] === 'sequence' && parsedQuery[1] !== 'where';
  }

  return false;
};

exports.hasEqlSequenceQuery = hasEqlSequenceQuery;

const isEqlRule = ruleType => ruleType === 'eql';

exports.isEqlRule = isEqlRule;

const isThresholdRule = ruleType => ruleType === 'threshold';

exports.isThresholdRule = isThresholdRule;

const isQueryRule = ruleType => ruleType === 'query' || ruleType === 'saved_query';

exports.isQueryRule = isQueryRule;

const isThreatMatchRule = ruleType => ruleType === 'threat_match';

exports.isThreatMatchRule = isThreatMatchRule;

const normalizeThresholdField = thresholdField => {
  return Array.isArray(thresholdField) ? thresholdField : (0, _lodash.isEmpty)(thresholdField) ? [] : [thresholdField];
};

exports.normalizeThresholdField = normalizeThresholdField;

const getRuleStatusText = value => value === 'partial failure' ? 'warning' : value != null ? value : null;

exports.getRuleStatusText = getRuleStatusText;