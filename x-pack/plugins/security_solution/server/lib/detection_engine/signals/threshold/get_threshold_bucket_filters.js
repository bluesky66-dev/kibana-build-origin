"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThresholdBucketFilters = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getThresholdBucketFilters = async ({
  thresholdSignalHistory,
  timestampOverride
}) => {
  const filters = Object.values(thresholdSignalHistory).reduce((acc, bucket) => {
    const filter = {
      bool: {
        filter: [{
          range: {
            [timestampOverride !== null && timestampOverride !== void 0 ? timestampOverride : '@timestamp']: {
              lte: new Date(bucket.lastSignalTimestamp).toISOString()
            }
          }
        }]
      }
    };
    bucket.terms.forEach(term => {
      if (term.field != null) {
        filter.bool.filter.push({
          term: {
            [term.field]: `${term.value}`
          }
        });
      }
    });
    return [...acc, filter];
  }, []);
  return [{
    bool: {
      must_not: filters
    }
  }];
};

exports.getThresholdBucketFilters = getThresholdBucketFilters;