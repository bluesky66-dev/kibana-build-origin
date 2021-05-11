"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _load_functions = _interopRequireDefault(require("../load_functions.js"));

var _timelion_function = _interopRequireDefault(require("./timelion_function"));

var _offset_time = require("../offset_time");

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fitFunctions = (0, _load_functions.default)('fit_functions');

function offsetSeries(response, offset) {
  if (offset) {
    response = _lodash.default.map(response, function (point) {
      return [(0, _offset_time.offsetTime)(point[0], offset, true), point[1]];
    });
  }

  return response;
}

class Datasource extends _timelion_function.default {
  constructor(name, config) {
    // Additional arguments that every dataSource take
    config.args.push({
      name: 'offset',
      types: ['string', 'null'],
      help: _i18n.i18n.translate('timelion.help.functions.common.args.offsetHelpText', {
        defaultMessage: 'Offset the series retrieval by a date expression, e.g., -1M to make events from ' + 'one month ago appear as if they are happening now. Offset the series relative to the charts ' + 'overall time range, by using the value "timerange", e.g. "timerange:-2" will specify an offset ' + 'that is twice the overall chart time range to the past.'
      })
    });
    config.args.push({
      name: 'fit',
      types: ['string', 'null'],
      help: _i18n.i18n.translate('timelion.help.functions.common.args.fitHelpText', {
        defaultMessage: 'Algorithm to use for fitting series to the target time span and interval. Available: {fitFunctions}',
        values: {
          fitFunctions: _lodash.default.keys(fitFunctions).join(', ')
        }
      })
    }); // Wrap the original function so we can modify inputs/outputs with offset & fit

    const originalFunction = config.fn;

    config.fn = function (args, tlConfig) {
      const config = _lodash.default.clone(tlConfig);

      let offset = args.byName.offset;

      if (offset) {
        offset = (0, _offset_time.preprocessOffset)(offset, tlConfig.time.from, tlConfig.time.to);
        config.time = _lodash.default.cloneDeep(tlConfig.time);
        config.time.from = (0, _offset_time.offsetTime)(config.time.from, offset);
        config.time.to = (0, _offset_time.offsetTime)(config.time.to, offset);
      }

      return Promise.resolve(originalFunction(args, config)).then(function (seriesList) {
        seriesList.list = _lodash.default.map(seriesList.list, function (series) {
          if (series.data.length === 0) throw new Error(name + '() returned no results');
          series.data = offsetSeries(series.data, offset);
          series.fit = args.byName.fit || series.fit || 'nearest';
          return series;
        });
        return seriesList;
      });
    };

    super(name, config); // You  need to call timelionFn if calling up a datasource from another datasource,
    // otherwise teh series will end up being offset twice.

    this.timelionFn = originalFunction;
    this.datasource = true;

    this.cacheKey = function (item) {
      return item.text;
    };

    Object.freeze(this);
  }

}

exports.default = Datasource;
module.exports = exports.default;