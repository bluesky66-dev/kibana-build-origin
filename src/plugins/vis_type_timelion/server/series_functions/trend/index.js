"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = _interopRequireDefault(require("lodash"));

var _chainable = _interopRequireDefault(require("../../lib/classes/chainable"));

var _regress = require("./lib/regress");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const validRegressions = {
  linear: 'linear',
  log: 'logarithmic'
};

var _default = new _chainable.default('trend', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'mode',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.trend.args.modeHelpText', {
      defaultMessage: 'The algorithm to use for generating the trend line. One of: {validRegressions}',
      values: {
        validRegressions: _lodash.default.keys(validRegressions).join(', ')
      }
    }),
    suggestions: _lodash.default.keys(validRegressions).map(key => {
      return {
        name: key,
        help: validRegressions[key]
      };
    })
  }, {
    name: 'start',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.trend.args.startHelpText', {
      defaultMessage: 'Where to start calculating from the beginning or end. For example -10 would start ' + 'calculating 10 points from the end, +15 would start 15 points from the beginning. Default: 0'
    })
  }, {
    name: 'end',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.trend.args.endHelpText', {
      defaultMessage: 'Where to stop calculating from the beginning or end. For example -10 would stop ' + 'calculating 10 points from the end, +15 would stop 15 points from the beginning. Default: 0'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.trendHelpText', {
    defaultMessage: 'Draws a trend line using a specified regression algorithm'
  }),
  fn: function absFn(args) {
    const newSeries = _lodash.default.cloneDeep(args.byName.inputSeries);

    _lodash.default.each(newSeries.list, function (series) {
      const length = series.data.length;
      let start = args.byName.start == null ? 0 : args.byName.start;
      let end = args.byName.end == null ? length : args.byName.end;
      start = start >= 0 ? start : length + start;
      end = end > 0 ? end : length + end;
      const subset = series.data.slice(start, end);
      const result = args.byName.mode === 'log' ? (0, _regress.log)(subset) : (0, _regress.linear)(subset);

      _lodash.default.each(series.data, function (point) {
        point[1] = null;
      });

      _lodash.default.each(result, function (point, i) {
        series.data[start + i] = point;
      });
    });

    return newSeries;
  }
});

exports.default = _default;
module.exports = exports.default;