"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseEqlResponse = exports.buildEqlDsl = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../common/constants");

var _build_query = require("../../../utils/build_query");

var _constants2 = require("../factory/events/all/constants");

var _helpers = require("../factory/events/all/helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildEqlDsl = options => {
  var _options$timestampFie, _options$eventCategor, _options$size, _options$timestampFie2;

  if (options.pagination && options.pagination.querySize >= _constants.DEFAULT_MAX_TABLE_QUERY_SIZE) {
    throw new Error(`No query size above ${_constants.DEFAULT_MAX_TABLE_QUERY_SIZE}`);
  }

  const requestFilter = [{
    range: {
      [(_options$timestampFie = options.timestampField) !== null && _options$timestampFie !== void 0 ? _options$timestampFie : '@timestamp']: {
        gte: options.timerange.from,
        lte: options.timerange.to,
        format: 'strict_date_optional_time'
      }
    }
  }];
  return {
    allow_no_indices: true,
    index: options.defaultIndex,
    ignore_unavailable: true,
    body: {
      event_category_field: (_options$eventCategor = options.eventCategoryField) !== null && _options$eventCategor !== void 0 ? _options$eventCategor : 'event.category',
      filter: {
        bool: {
          filter: requestFilter
        }
      },
      query: options.filterQuery,
      ...(!(0, _fp.isEmpty)(options.tiebreakerField) ? {
        tiebreaker_field: options.tiebreakerField
      } : {}),
      size: (_options$size = options.size) !== null && _options$size !== void 0 ? _options$size : 100,
      timestamp_field: (_options$timestampFie2 = options.timestampField) !== null && _options$timestampFie2 !== void 0 ? _options$timestampFie2 : '@timestamp'
    }
  };
};

exports.buildEqlDsl = buildEqlDsl;

const parseSequences = async (sequences, fieldRequested) => sequences.reduce(async (acc, sequence, sequenceIndex) => {
  var _sequence$events$0$_i, _sequence$events$;

  const sequenceParentId = (_sequence$events$0$_i = (_sequence$events$ = sequence.events[0]) === null || _sequence$events$ === void 0 ? void 0 : _sequence$events$._id) !== null && _sequence$events$0$_i !== void 0 ? _sequence$events$0$_i : null;
  const data = await acc;
  const allData = await Promise.all(sequence.events.map(async (event, eventIndex) => {
    const item = await (0, _helpers.formatTimelineData)(fieldRequested, _constants2.TIMELINE_EVENTS_FIELDS, event);
    return Promise.resolve({ ...item,
      node: { ...item.node,
        ecs: { ...item.node.ecs,
          ...(sequenceParentId != null ? {
            eql: {
              parentId: sequenceParentId,
              sequenceNumber: `${sequenceIndex}-${eventIndex}`
            }
          } : {})
        }
      }
    });
  }));
  return Promise.resolve([...data, ...allData]);
}, Promise.resolve([]));

const parseEqlResponse = async (options, response) => {
  const {
    activePage,
    querySize
  } = options.pagination;
  let edges = [];

  if (response.rawResponse.body.hits.sequences !== undefined) {
    edges = await parseSequences(response.rawResponse.body.hits.sequences, options.fieldRequested);
  } else if (response.rawResponse.body.hits.events !== undefined) {
    edges = await Promise.all(response.rawResponse.body.hits.events.map(async event => (0, _helpers.formatTimelineData)(options.fieldRequested, _constants2.TIMELINE_EVENTS_FIELDS, event)));
  }

  const inspect = {
    dsl: [(0, _build_query.inspectStringifyObject)(buildEqlDsl(options))]
  };
  const startPage = activePage === 0 ? activePage : activePage * querySize;
  const endPage = startPage + querySize;
  return Promise.resolve({ ...response,
    inspect,
    edges: edges.slice(startPage, endPage),
    totalCount: edges.length,
    pageInfo: {
      activePage: activePage !== null && activePage !== void 0 ? activePage : 0,
      querySize
    }
  });
};

exports.parseEqlResponse = parseEqlResponse;