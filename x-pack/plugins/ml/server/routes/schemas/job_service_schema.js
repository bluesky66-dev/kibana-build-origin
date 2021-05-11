"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jobsExistSchema = exports.revertModelSnapshotSchema = exports.updateGroupsSchema = exports.topCategoriesSchema = exports.lookBackProgressSchema = exports.jobsWithTimerangeSchema = exports.jobIdsSchema = exports.jobIdSchema = exports.forceStartDatafeedSchema = exports.datafeedIdsSchema = exports.chartSchema = exports.categorizationFieldExamplesSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const categorizationFieldExamplesSchema = {
  indexPatternTitle: _configSchema.schema.string(),
  query: _configSchema.schema.any(),
  size: _configSchema.schema.number(),
  field: _configSchema.schema.string(),
  timeField: _configSchema.schema.maybe(_configSchema.schema.string()),
  start: _configSchema.schema.number(),
  end: _configSchema.schema.number(),
  analyzer: _configSchema.schema.any(),
  runtimeMappings: _configSchema.schema.maybe(_configSchema.schema.any())
};
exports.categorizationFieldExamplesSchema = categorizationFieldExamplesSchema;
const chartSchema = {
  indexPatternTitle: _configSchema.schema.string(),
  timeField: _configSchema.schema.maybe(_configSchema.schema.string()),
  start: _configSchema.schema.maybe(_configSchema.schema.number()),
  end: _configSchema.schema.maybe(_configSchema.schema.number()),
  intervalMs: _configSchema.schema.number(),
  query: _configSchema.schema.any(),
  aggFieldNamePairs: _configSchema.schema.arrayOf(_configSchema.schema.any()),
  splitFieldName: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
  splitFieldValue: _configSchema.schema.maybe(_configSchema.schema.nullable(_configSchema.schema.string())),
  runtimeMappings: _configSchema.schema.maybe(_configSchema.schema.any())
};
exports.chartSchema = chartSchema;

const datafeedIdsSchema = _configSchema.schema.object({
  datafeedIds: _configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string()))
});

exports.datafeedIdsSchema = datafeedIdsSchema;

const forceStartDatafeedSchema = _configSchema.schema.object({
  datafeedIds: _configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string())),
  start: _configSchema.schema.maybe(_configSchema.schema.number()),
  end: _configSchema.schema.maybe(_configSchema.schema.number())
});

exports.forceStartDatafeedSchema = forceStartDatafeedSchema;

const jobIdSchema = _configSchema.schema.object({
  /** Optional list of job IDs. */
  jobIds: _configSchema.schema.maybe(_configSchema.schema.string())
});

exports.jobIdSchema = jobIdSchema;

const jobIdsSchema = _configSchema.schema.object({
  /** Optional list of job IDs. */
  jobIds: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string())))
});

exports.jobIdsSchema = jobIdsSchema;
const jobsWithTimerangeSchema = {
  dateFormatTz: _configSchema.schema.maybe(_configSchema.schema.string())
};
exports.jobsWithTimerangeSchema = jobsWithTimerangeSchema;
const lookBackProgressSchema = {
  jobId: _configSchema.schema.string(),
  start: _configSchema.schema.maybe(_configSchema.schema.number()),
  end: _configSchema.schema.maybe(_configSchema.schema.number())
};
exports.lookBackProgressSchema = lookBackProgressSchema;
const topCategoriesSchema = {
  jobId: _configSchema.schema.string(),
  count: _configSchema.schema.number()
};
exports.topCategoriesSchema = topCategoriesSchema;
const updateGroupsSchema = {
  jobs: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    job_id: _configSchema.schema.maybe(_configSchema.schema.string()),
    groups: _configSchema.schema.arrayOf(_configSchema.schema.maybe(_configSchema.schema.string()))
  })))
};
exports.updateGroupsSchema = updateGroupsSchema;

const revertModelSnapshotSchema = _configSchema.schema.object({
  jobId: _configSchema.schema.string(),
  snapshotId: _configSchema.schema.string(),
  replay: _configSchema.schema.boolean(),
  end: _configSchema.schema.maybe(_configSchema.schema.number()),
  deleteInterveningResults: _configSchema.schema.maybe(_configSchema.schema.boolean()),
  calendarEvents: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
    start: _configSchema.schema.number(),
    end: _configSchema.schema.number(),
    description: _configSchema.schema.string()
  })))
});

exports.revertModelSnapshotSchema = revertModelSnapshotSchema;

const jobsExistSchema = _configSchema.schema.object({
  jobIds: _configSchema.schema.arrayOf(_configSchema.schema.string()),
  allSpaces: _configSchema.schema.maybe(_configSchema.schema.boolean())
});

exports.jobsExistSchema = jobsExistSchema;