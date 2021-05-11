"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initCardinalityFieldsCache = void 0;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Caches cardinality fields values to avoid
 * unnecessary aggregations on elasticsearch
 */


const initCardinalityFieldsCache = () => {
  const cardinalityCache = new Map();
  return {
    /**
     * Gets requested values from cache
     */
    getValues(indexPatternName, timeField, earliestMs, latestMs, aggType, fieldNames) {
      const cacheKey = indexPatternName + timeField + earliestMs + latestMs;
      const cached = cardinalityCache.get(cacheKey);

      if (!cached) {
        return null;
      }

      return (0, _lodash.pick)(cached[aggType], fieldNames);
    },

    /**
     * Extends cache with provided values
     */
    updateValues(indexPatternName, timeField, earliestMs, latestMs, update) {
      const cacheKey = indexPatternName + timeField + earliestMs + latestMs;
      const cachedValues = cardinalityCache.get(cacheKey);

      if (cachedValues === undefined) {
        var _update$overallCardin, _update$maxBucketCard;

        cardinalityCache.set(cacheKey, {
          overallCardinality: (_update$overallCardin = update.overallCardinality) !== null && _update$overallCardin !== void 0 ? _update$overallCardin : {},
          maxBucketCardinality: (_update$maxBucketCard = update.maxBucketCardinality) !== null && _update$maxBucketCard !== void 0 ? _update$maxBucketCard : {}
        });
        return;
      }

      Object.assign(cachedValues.overallCardinality, update.overallCardinality);
      Object.assign(cachedValues.maxBucketCardinality, update.maxBucketCardinality);
    }

  };
};

exports.initCardinalityFieldsCache = initCardinalityFieldsCache;