"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.firstOrLastSeenHost = void 0;

var _fp = require("lodash/fp");

var _build_query = require("../../../../../utils/build_query");

var _queryFirst_or_last_seen_host = require("./query.first_or_last_seen_host.dsl");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const firstOrLastSeenHost = {
  buildDsl: options => (0, _queryFirst_or_last_seen_host.buildFirstOrLastSeenHostQuery)(options),
  parse: async (options, response) => {
    // First try to get the formatted field if it exists or not.
    const formattedField = (0, _fp.getOr)(null, 'hits.hits[0].fields.@timestamp[0]', response.rawResponse); // If it doesn't exist, fall back on _source as a last try.

    const seen = formattedField || (0, _fp.getOr)(null, 'hits.hits[0]._source.@timestamp', response.rawResponse);
    const inspect = {
      dsl: [(0, _build_query.inspectStringifyObject)((0, _queryFirst_or_last_seen_host.buildFirstOrLastSeenHostQuery)(options))]
    };

    if (options.order === 'asc') {
      return { ...response,
        inspect,
        firstSeen: seen
      };
    } else {
      return { ...response,
        inspect,
        lastSeen: seen
      };
    }
  }
};
exports.firstOrLastSeenHost = firstOrLastSeenHost;