"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineEventsDetails = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryEvents_details = require("./query.events_details.dsl");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const timelineEventsDetails = {
  buildDsl: options => {
    const {
      indexName,
      eventId,
      docValueFields = []
    } = options;
    return (0, _queryEvents_details.buildTimelineDetailsQuery)(indexName, eventId, docValueFields);
  },
  parse: async (options, response) => {
    var _response$rawResponse;

    const {
      indexName,
      eventId,
      docValueFields = []
    } = options;
    const {
      _source,
      fields,
      ...hitsData
    } = (0, _fp.cloneDeep)((_response$rawResponse = response.rawResponse.hits.hits[0]) !== null && _response$rawResponse !== void 0 ? _response$rawResponse : {});
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryEvents_details.buildTimelineDetailsQuery)(indexName, eventId, docValueFields))]
    };

    if (response.isRunning) {
      return { ...response,
        data: [],
        inspect
      };
    }

    const sourceData = await (0, _helpers.getDataSafety)(_helpers.getDataFromSourceHits, _source);
    const fieldsData = await (0, _helpers.getDataSafety)(_helpers.getDataFromFieldsHits, (0, _fp.merge)(fields, hitsData));
    const data = (0, _fp.unionBy)('field', fieldsData, sourceData);
    return { ...response,
      data,
      inspect
    };
  }
};
exports.timelineEventsDetails = timelineEventsDetails;