"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsFactory = void 0;

var _timeline = require("../../../../../common/search_strategy/timeline");

var _all = require("./all");

var _details = require("./details");

var _kpi = require("./kpi");

var _last_event_time = require("./last_event_time");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineEventsFactory = {
  [_timeline.TimelineEventsQueries.all]: _all.timelineEventsAll,
  [_timeline.TimelineEventsQueries.details]: _details.timelineEventsDetails,
  [_timeline.TimelineEventsQueries.kpi]: _kpi.timelineKpi,
  [_timeline.TimelineEventsQueries.lastEventTime]: _last_event_time.timelineEventsLastEventTime
};
exports.timelineEventsFactory = timelineEventsFactory;