"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.analyticsMapQuerySchema = exports.jobsExistSchema = exports.stopsDataFrameAnalyticsJobQuerySchema = exports.dataAnalyticsJobUpdateSchema = exports.deleteDataFrameAnalyticsJobSchema = exports.analyticsQuerySchema = exports.analyticsIdSchema = exports.dataAnalyticsExplainSchema = exports.dataAnalyticsEvaluateSchema = exports.dataAnalyticsJobConfigSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const dataAnalyticsJobConfigSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  dest: _configSchema.schema.object({
    index: _configSchema.schema.string(),
    results_field: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  source: _configSchema.schema.object({
    index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
    query: _configSchema.schema.maybe(_configSchema.schema.any()),
    _source: _configSchema.schema.maybe(_configSchema.schema.object({
      /** Fields to include in results */
      includes: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string()))),

      /** Fields to exclude from results */
      excludes: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string())))
    }))
  }),
  allow_lazy_start: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  analysis: _configSchema.schema.any(),
  analyzed_fields: _configSchema.schema.any(),
  model_memory_limit: _configSchema.schema.string(),
  max_num_threads: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.dataAnalyticsJobConfigSchema = dataAnalyticsJobConfigSchema;

const dataAnalyticsEvaluateSchema = _configSchema.schema.object({
  index: _configSchema.schema.string(),
  query: _configSchema.schema.maybe(_configSchema.schema.any()),
  evaluation: _configSchema.schema.maybe(_configSchema.schema.object({
    regression: _configSchema.schema.maybe(_configSchema.schema.any()),
    classification: _configSchema.schema.maybe(_configSchema.schema.any()),
    outlier_detection: _configSchema.schema.maybe(_configSchema.schema.any())
  }))
});

exports.dataAnalyticsEvaluateSchema = dataAnalyticsEvaluateSchema;

const dataAnalyticsExplainSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  dest: _configSchema.schema.maybe(_configSchema.schema.any()),

  /** Source */
  source: _configSchema.schema.object({
    index: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())]),
    query: _configSchema.schema.maybe(_configSchema.schema.any())
  }),
  analysis: _configSchema.schema.any(),
  analyzed_fields: _configSchema.schema.maybe(_configSchema.schema.any()),
  model_memory_limit: _configSchema.schema.maybe(_configSchema.schema.string()),
  max_num_threads: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.dataAnalyticsExplainSchema = dataAnalyticsExplainSchema;

const analyticsIdSchema = _configSchema.schema.object({
  /**
   * Analytics ID
   */
  analyticsId: _configSchema.schema.string()
});

exports.analyticsIdSchema = analyticsIdSchema;

const analyticsQuerySchema = _configSchema.schema.object({
  /**
   * Analytics Query
   */
  excludeGenerated: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.analyticsQuerySchema = analyticsQuerySchema;

const deleteDataFrameAnalyticsJobSchema = _configSchema.schema.object({
  /**
   * Analytics Destination Index
   */
  deleteDestIndex: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  deleteDestIndexPattern: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.deleteDataFrameAnalyticsJobSchema = deleteDataFrameAnalyticsJobSchema;

const dataAnalyticsJobUpdateSchema = _configSchema.schema.object({
  description: _configSchema.schema.maybe(_configSchema.schema.string()),
  model_memory_limit: _configSchema.schema.maybe(_configSchema.schema.string()),
  allow_lazy_start: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  max_num_threads: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.dataAnalyticsJobUpdateSchema = dataAnalyticsJobUpdateSchema;

const stopsDataFrameAnalyticsJobQuerySchema = _configSchema.schema.object({
  force: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.stopsDataFrameAnalyticsJobQuerySchema = stopsDataFrameAnalyticsJobQuerySchema;

const jobsExistSchema = _configSchema.schema.object({
  analyticsIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  allSpaces: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.jobsExistSchema = jobsExistSchema;

const analyticsMapQuerySchema = _configSchema.schema.maybe(_configSchema.schema.object({
  treatAsRoot: _configSchema.schema.maybe(_configSchema.schema.any()),
  type: _configSchema.schema.maybe(_configSchema.schema.string())
}));

exports.analyticsMapQuerySchema = analyticsMapQuerySchema;