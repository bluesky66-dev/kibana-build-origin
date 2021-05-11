"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _moment = _interopRequireDefault(require("moment"));

var _rxjs = require("rxjs");

var _get_namespaced_settings = _interopRequireDefault(require("../../lib/get_namespaced_settings"));

var _es_response = _interopRequireDefault(require("./es_response"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function _default() {
  const functions = require('../../lib/load_functions')('series_functions');

  const tlConfig = require('../../handlers/lib/tl_config.js')({
    getFunction: name => {
      if (!functions[name]) throw new Error('No such function: ' + name);
      return functions[name];
    },
    esShardTimeout: _moment.default.duration(30000),
    allowedGraphiteUrls: ['https://www.hostedgraphite.com/UID/ACCESS_KEY/graphite']
  });

  tlConfig.time = {
    interval: '1y',
    from: (0, _moment.default)('1980-01-01T00:00:00Z').valueOf(),
    to: (0, _moment.default)('1983-01-01T00:00:00Z').valueOf(),
    timezone: 'Etc/UTC'
  };
  tlConfig.settings = (0, _get_namespaced_settings.default)();
  tlConfig.setTargetSeries();
  tlConfig.context = {
    search: {
      search: () => (0, _rxjs.of)({
        rawResponse: _es_response.default
      })
    }
  };
  return tlConfig;
}

module.exports = exports.default;