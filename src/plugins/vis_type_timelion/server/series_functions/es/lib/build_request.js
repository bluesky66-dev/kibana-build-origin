"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = buildRequest;

var _lodash = _interopRequireDefault(require("lodash"));

var _moment = _interopRequireDefault(require("moment"));

var _agg_body = require("./agg_body");

var _create_date_agg = _interopRequireDefault(require("./create_date_agg"));

var _server = require("../../../../../data/server");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function buildRequest(config, tlConfig, scriptedFields, timeout) {
  const bool = {
    must: []
  };
  const timeFilter = {
    range: {
      [config.timefield]: {
        gte: (0, _moment.default)(tlConfig.time.from).toISOString(),
        lte: (0, _moment.default)(tlConfig.time.to).toISOString(),
        format: 'strict_date_optional_time'
      }
    }
  };
  bool.must.push(timeFilter); // Use the kibana filter bar filters

  if (config.kibana) {
    bool.filter = _lodash.default.get(tlConfig, 'request.body.extended.es.filter');
  }

  const aggs = {
    q: {
      meta: {
        type: 'split'
      },
      filters: {
        filters: _lodash.default.chain(config.q).map(function (q) {
          return [q, {
            query_string: {
              query: q
            }
          }];
        }).fromPairs().value()
      },
      aggs: {}
    }
  };
  let aggCursor = aggs.q.aggs;

  _lodash.default.each(config.split, function (clause) {
    clause = clause.split(':');

    if (clause[0] && clause[1]) {
      const termsAgg = (0, _agg_body.buildAggBody)(clause[0], scriptedFields);
      termsAgg.size = parseInt(clause[1], 10);
      aggCursor[clause[0]] = {
        meta: {
          type: 'split'
        },
        terms: termsAgg,
        aggs: {}
      };
      aggCursor = aggCursor[clause[0]].aggs;
    } else {
      throw new Error('`split` requires field:limit');
    }
  });

  _lodash.default.assign(aggCursor, (0, _create_date_agg.default)(config, tlConfig, scriptedFields));

  const request = {
    index: config.index,
    ignore_throttled: !tlConfig.settings[_server.UI_SETTINGS.SEARCH_INCLUDE_FROZEN],
    body: {
      query: {
        bool: bool
      },
      aggs: aggs,
      size: 0
    }
  };

  if (timeout) {
    request.timeout = `${timeout}ms`;
  }

  return {
    params: request
  };
}

module.exports = exports.default;