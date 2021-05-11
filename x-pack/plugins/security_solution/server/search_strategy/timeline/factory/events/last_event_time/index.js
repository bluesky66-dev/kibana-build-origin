"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsLastEventTime = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryEvents_last_event_time = require("./query.events_last_event_time.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineEventsLastEventTime = {
  buildDsl: options => (0, _queryEvents_last_event_time.buildLastEventTimeQuery)(options),
  parse: async (options, response) => {
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryEvents_last_event_time.buildLastEventTimeQuery)(options))]
    }; // First try to get the formatted field if it exists or not.

    const formattedField = (0, _fp.getOr)(null, 'hits.hits[0].fields.@timestamp[0]', response.rawResponse); // If it doesn't exist, fall back on _source as a last try.

    const lastSeen = formattedField || (0, _fp.getOr)(null, 'hits.hits[0]._source.@timestamp', response.rawResponse);
    return { ...response,
      lastSeen,
      inspect
    };
  }
};
exports.timelineEventsLastEventTime = timelineEventsLastEventTime;