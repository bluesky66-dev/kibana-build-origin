"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sampleDataSchema = void 0;

var _joi = _interopRequireDefault(require("joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const dataIndexSchema = _joi.default.object({
  id: _joi.default.string().regex(/^[a-zA-Z0-9-]+$/).required(),
  // path to newline delimented JSON file containing data relative to KIBANA_HOME
  dataPath: _joi.default.string().required(),
  // Object defining Elasticsearch field mappings (contents of index.mappings.type.properties)
  fields: _joi.default.object().required(),
  // times fields that will be updated relative to now when data is installed
  timeFields: _joi.default.array().items(_joi.default.string()).required(),
  // Reference to now in your test data set.
  // When data is installed, timestamps are converted to the present time.
  // The distance between a timestamp and currentTimeMarker is preserved but the date and time will change.
  // For example:
  //   sample data set:    timestamp: 2018-01-01T00:00:00Z, currentTimeMarker: 2018-01-01T12:00:00Z
  //   installed data set: timestamp: 2018-04-18T20:33:14Z, currentTimeMarker: 2018-04-19T08:33:14Z
  currentTimeMarker: _joi.default.string().isoDate().required(),
  // Set to true to move timestamp to current week, preserving day of week and time of day
  // Relative distance from timestamp to currentTimeMarker will not remain the same
  preserveDayOfWeekTimeOfDay: _joi.default.boolean().default(false)
});

const appLinkSchema = _joi.default.object({
  path: _joi.default.string().required(),
  label: _joi.default.string().required(),
  icon: _joi.default.string().required()
});

const sampleDataSchema = {
  id: _joi.default.string().regex(/^[a-zA-Z0-9-]+$/).required(),
  name: _joi.default.string().required(),
  description: _joi.default.string().required(),
  previewImagePath: _joi.default.string().required(),
  darkPreviewImagePath: _joi.default.string(),
  // saved object id of main dashboard for sample data set
  overviewDashboard: _joi.default.string().required(),
  appLinks: _joi.default.array().items(appLinkSchema).default([]),
  // saved object id of default index-pattern for sample data set
  defaultIndex: _joi.default.string().required(),
  // Kibana saved objects (index patter, visualizations, dashboard, ...)
  // Should provide a nice demo of Kibana's functionality with the sample data set
  savedObjects: _joi.default.array().items(_joi.default.object()).required(),
  dataIndices: _joi.default.array().items(dataIndexSchema).required()
};
exports.sampleDataSchema = sampleDataSchema;