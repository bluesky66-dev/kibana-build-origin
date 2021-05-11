"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExistingPrepackagedRules = exports.getNonPackagedRules = exports.getRules = exports.getRulesCount = exports.getNonPackagedRulesCount = exports.FILTER_PREPACKED_RULES = exports.FILTER_NON_PREPACKED_RULES = void 0;

var _constants = require("../../../../common/constants");

var _types = require("./types");

var _find_rules = require("./find_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FILTER_NON_PREPACKED_RULES = `alert.attributes.tags: "${_constants.INTERNAL_IMMUTABLE_KEY}:false"`;
exports.FILTER_NON_PREPACKED_RULES = FILTER_NON_PREPACKED_RULES;
const FILTER_PREPACKED_RULES = `alert.attributes.tags: "${_constants.INTERNAL_IMMUTABLE_KEY}:true"`;
exports.FILTER_PREPACKED_RULES = FILTER_PREPACKED_RULES;

const getNonPackagedRulesCount = async ({
  alertsClient
}) => {
  return getRulesCount({
    alertsClient,
    filter: FILTER_NON_PREPACKED_RULES
  });
};

exports.getNonPackagedRulesCount = getNonPackagedRulesCount;

const getRulesCount = async ({
  alertsClient,
  filter
}) => {
  const firstRule = await (0, _find_rules.findRules)({
    alertsClient,
    filter,
    perPage: 1,
    page: 1,
    sortField: 'createdAt',
    sortOrder: 'desc',
    fields: undefined
  });
  return firstRule.total;
};

exports.getRulesCount = getRulesCount;

const getRules = async ({
  alertsClient,
  filter
}) => {
  const count = await getRulesCount({
    alertsClient,
    filter
  });
  const rules = await (0, _find_rules.findRules)({
    alertsClient,
    filter,
    perPage: count,
    page: 1,
    sortField: 'createdAt',
    sortOrder: 'desc',
    fields: undefined
  });

  if ((0, _types.isAlertTypes)(rules.data)) {
    return rules.data;
  } else {
    // If this was ever true, you have a really messed up system.
    // This is keep typescript happy since we have an unknown with data
    return [];
  }
};

exports.getRules = getRules;

const getNonPackagedRules = async ({
  alertsClient
}) => {
  return getRules({
    alertsClient,
    filter: FILTER_NON_PREPACKED_RULES
  });
};

exports.getNonPackagedRules = getNonPackagedRules;

const getExistingPrepackagedRules = async ({
  alertsClient
}) => {
  return getRules({
    alertsClient,
    filter: FILTER_PREPACKED_RULES
  });
};

exports.getExistingPrepackagedRules = getExistingPrepackagedRules;