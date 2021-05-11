"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategorizerStoppedPartitionsSchema = exports.getCategorizerStatsSchema = exports.partitionFieldValuesSchema = exports.anomalySearchSchema = exports.categoryExamplesSchema = exports.maxAnomalyScoreSchema = exports.categoryDefinitionSchema = exports.anomaliesTableDataSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const criteriaFieldSchema = _configSchema.schema.object({
  fieldType: _configSchema.schema.maybe(_configSchema.schema.string()),
  fieldName: _configSchema.schema.string(),
  fieldValue: _configSchema.schema.any()
});

const anomaliesTableDataSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  criteriaFields: _configSchema.schema.arrayOf(criteriaFieldSchema),
  influencers: _configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.object({
    fieldName: _configSchema.schema.string(),
    fieldValue: _configSchema.schema.any()
  }))),
  aggregationInterval: _configSchema.schema.string(),
  threshold: _configSchema.schema.number(),
  earliestMs: _configSchema.schema.number(),
  latestMs: _configSchema.schema.number(),
  dateFormatTz: _configSchema.schema.string(),
  maxRecords: _configSchema.schema.number(),
  maxExamples: _configSchema.schema.maybe(_configSchema.schema.number()),
  influencersFilterQuery: _configSchema.schema.maybe(_configSchema.schema.any()),
  functionDescription: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string()))
});

exports.anomaliesTableDataSchema = anomaliesTableDataSchema;

const categoryDefinitionSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.maybe(_configSchema.schema.string()),
  categoryId: _configSchema.schema.string()
});

exports.categoryDefinitionSchema = categoryDefinitionSchema;

const maxAnomalyScoreSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  earliestMs: _configSchema.schema.maybe(_configSchema.schema.number()),
  latestMs: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.maxAnomalyScoreSchema = maxAnomalyScoreSchema;

const categoryExamplesSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.string(),
  categoryIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  maxExamples: _configSchema.schema.number()
});

exports.categoryExamplesSchema = categoryExamplesSchema;

const anomalySearchSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  query: _configSchema.schema.any()
});

exports.anomalySearchSchema = anomalySearchSchema;

const fieldConfig = _configSchema.schema.maybe(_configSchema.schema.object({
  applyTimeRange: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  anomalousOnly: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  sort: _configSchema.schema.object({
    by: _configSchema.schema.string(),
    order: _configSchema.schema.maybe(_configSchema.schema.string())
  })
}));

const partitionFieldValuesSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.string(),
  searchTerm: _configSchema.schema.maybe(_configSchema.schema.any()),
  criteriaFields: _configSchema.schema.arrayOf(criteriaFieldSchema),
  earliestMs: _configSchema.schema.number(),
  latestMs: _configSchema.schema.number(),
  fieldsConfig: _configSchema.schema.maybe(_configSchema.schema.object({
    partition_field: fieldConfig,
    over_field: fieldConfig,
    by_field: fieldConfig
  }))
});

exports.partitionFieldValuesSchema = partitionFieldValuesSchema;

const getCategorizerStatsSchema = _configSchema.schema.nullable(_configSchema.schema.object({
  /**
   * Optional value to fetch the categorizer stats
   * where results are filtered by partition_by_value = value
   */
  partitionByValue: _configSchema.schema.maybe(_configSchema.schema.string())
}));

exports.getCategorizerStatsSchema = getCategorizerStatsSchema;

const getCategorizerStoppedPartitionsSchema = _configSchema.schema.object({
  /**
   * List of jobIds to fetch the categorizer partitions for
   */
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),

  /**
   * Field to aggregate results by: 'job_id' or 'partition_field_value'
   * If by job_id, will return list of jobIds with at least one partition that have stopped
   * If by partition_field_value, it will return a list of categorizer stopped partitions for each job_id
   */
  fieldToBucket: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.getCategorizerStoppedPartitionsSchema = getCategorizerStoppedPartitionsSchema;