"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draftTimelineDefaults = void 0;

var _types = require("../../graphql/types");

var _default_timeline_headers = require("./default_timeline_headers");

var _timeline = require("../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const draftTimelineDefaults = {
  columns: _default_timeline_headers.defaultHeaders,
  dataProviders: [],
  description: '',
  eventType: 'all',
  filters: [],
  kqlMode: 'filter',
  timelineType: _timeline.TimelineType.default,
  kqlQuery: {
    filterQuery: null
  },
  title: '',
  sort: {
    columnId: '@timestamp',
    sortDirection: _types.Direction.desc
  },
  status: _timeline.TimelineStatus.draft
};
exports.draftTimelineDefaults = draftTimelineDefaults;