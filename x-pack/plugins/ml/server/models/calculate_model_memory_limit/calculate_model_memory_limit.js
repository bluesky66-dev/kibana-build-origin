"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateModelMemoryLimitProvider = calculateModelMemoryLimitProvider;

var _numeral = _interopRequireDefault(require("@elastic/numeral"));

var _field_types = require("../../../common/constants/field_types");

var _fields_service = require("../fields_service");

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

/**
 * Retrieves overall and max bucket cardinalities.
 */


const cardinalityCheckProvider = client => {
  const fieldsService = (0, _fields_service.fieldsServiceProvider)(client);
  return async (analysisConfig, indexPattern, query, timeFieldName, earliestMs, latestMs, datafeedConfig) => {
    /**
     * Fields not involved in cardinality check
     */
    const excludedKeywords = new Set(
    /**
     * The keyword which is used to mean the output of categorization,
     * so it will have cardinality zero in the actual input data.
     */
    _field_types.MLCATEGORY);
    const {
      detectors,
      influencers,
      bucket_span: bucketSpan
    } = analysisConfig;
    let overallCardinality = {};
    let maxBucketCardinality = {}; // Get fields required for the model memory estimation

    const overallCardinalityFields = detectors.reduce((acc, {
      by_field_name: byFieldName,
      partition_field_name: partitionFieldName,
      over_field_name: overFieldName
    }) => {
      [byFieldName, partitionFieldName, overFieldName].filter(field => field !== undefined && field !== '' && !excludedKeywords.has(field)).forEach(key => {
        acc.add(key);
      });
      return acc;
    }, new Set());
    const maxBucketFieldCardinalities = influencers.filter(influencerField => !!influencerField && !excludedKeywords.has(influencerField) && !overallCardinalityFields.has(influencerField));

    if (overallCardinalityFields.size > 0) {
      overallCardinality = await fieldsService.getCardinalityOfFields(indexPattern, [...overallCardinalityFields], query, timeFieldName, earliestMs, latestMs, datafeedConfig);
    }

    if (maxBucketFieldCardinalities.length > 0) {
      maxBucketCardinality = await fieldsService.getMaxBucketCardinalities(indexPattern, maxBucketFieldCardinalities, query, timeFieldName, earliestMs, latestMs, bucketSpan, datafeedConfig);
    }

    return {
      overallCardinality,
      maxBucketCardinality
    };
  };
};

function calculateModelMemoryLimitProvider(client, mlClient) {
  const getCardinalities = cardinalityCheckProvider(client);
  /**
   * Retrieves an estimated size of the model memory limit used in the job config
   * based on the cardinality of the fields being used to split the data
   * and influencers.
   */

  return async function calculateModelMemoryLimit(analysisConfig, indexPattern, query, timeFieldName, earliestMs, latestMs, allowMMLGreaterThanMax = false, datafeedConfig) {
    var _info$limits$max_mode, _info$limits$effectiv;

    const {
      body: info
    } = await mlClient.info();
    const maxModelMemoryLimit = (_info$limits$max_mode = info.limits.max_model_memory_limit) === null || _info$limits$max_mode === void 0 ? void 0 : _info$limits$max_mode.toUpperCase();
    const effectiveMaxModelMemoryLimit = (_info$limits$effectiv = info.limits.effective_max_model_memory_limit) === null || _info$limits$effectiv === void 0 ? void 0 : _info$limits$effectiv.toUpperCase();
    const {
      overallCardinality,
      maxBucketCardinality
    } = await getCardinalities(analysisConfig, indexPattern, query, timeFieldName, earliestMs, latestMs, datafeedConfig);
    const {
      body
    } = await mlClient.estimateModelMemory({
      body: {
        analysis_config: analysisConfig,
        overall_cardinality: overallCardinality,
        max_bucket_cardinality: maxBucketCardinality
      }
    });
    const estimatedModelMemoryLimit = body.model_memory_estimate.toUpperCase();
    let modelMemoryLimit = estimatedModelMemoryLimit;
    let mmlCappedAtMax = false; // if max_model_memory_limit has been set,
    // make sure the estimated value is not greater than it.

    if (allowMMLGreaterThanMax === false) {
      // @ts-expect-error
      const mmlBytes = (0, _numeral.default)(estimatedModelMemoryLimit).value();

      if (maxModelMemoryLimit !== undefined) {
        // @ts-expect-error
        const maxBytes = (0, _numeral.default)(maxModelMemoryLimit).value();

        if (mmlBytes > maxBytes) {
          // @ts-expect-error
          modelMemoryLimit = `${Math.floor(maxBytes / (0, _numeral.default)('1MB').value())}MB`;
          mmlCappedAtMax = true;
        }
      } // if we've not already capped the estimated mml at the hard max server setting
      // ensure that the estimated mml isn't greater than the effective max mml


      if (mmlCappedAtMax === false && effectiveMaxModelMemoryLimit !== undefined) {
        // @ts-expect-error
        const effectiveMaxMmlBytes = (0, _numeral.default)(effectiveMaxModelMemoryLimit).value();

        if (mmlBytes > effectiveMaxMmlBytes) {
          // @ts-expect-error
          modelMemoryLimit = `${Math.floor(effectiveMaxMmlBytes / (0, _numeral.default)('1MB').value())}MB`;
        }
      }
    }

    return {
      estimatedModelMemoryLimit,
      modelMemoryLimit,
      ...(maxModelMemoryLimit ? {
        maxModelMemoryLimit
      } : {}),
      ...(effectiveMaxModelMemoryLimit ? {
        effectiveMaxModelMemoryLimit
      } : {})
    };
  };
}