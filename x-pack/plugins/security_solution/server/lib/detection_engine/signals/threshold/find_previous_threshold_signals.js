"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPreviousThresholdSignals = void 0;

var _single_search_after = require("../single_search_after");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findPreviousThresholdSignals = async ({
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
  const filter = {
    bool: {
      must: [{
        term: {
          'signal.rule.rule_id': ruleId
        }
      }, // We might find a signal that was generated on the interval for old data... make sure to exclude those.
      {
        range: {
          'signal.original_time': {
            gte: from
          }
        }
      }, ...bucketByFields.map(field => {
        return {
          term: {
            'signal.rule.threshold.field': field
          }
        };
      })]
    }
  };
  return (0, _single_search_after.singleSearchAfter)({
    searchAfterSortId: undefined,
    timestampOverride,
    index: indexPattern,
    from,
    to,
    services,
    logger,
    filter,
    pageSize: 10000,
    // TODO: multiple pages?
    buildRuleMessage,
    excludeDocsWithTimestampOverride: false
  });
};

exports.findPreviousThresholdSignals = findPreviousThresholdSignals;