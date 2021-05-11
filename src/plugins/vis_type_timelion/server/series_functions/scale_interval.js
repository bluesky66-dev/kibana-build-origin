"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _alter = _interopRequireDefault(require("../lib/alter.js"));

var _to_milliseconds = require("../../common/lib/to_milliseconds");

var _lodash = _interopRequireDefault(require("lodash"));

var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _chainable.default('scale_interval', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'interval',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.scaleInterval.args.intervalHelpText', {
      defaultMessage: 'The new interval in date math notation, e.g., 1s for 1 second. 1m, 5m, 1M, 1w, 1y, etc.'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.scaleIntervalHelpText', {
    defaultMessage: 'Changes scales a value (usually a sum or a count) to a new interval. For example, as a per-second rate'
  }),
  fn: function scaleIntervalFn(args, tlConfig) {
    const currentInterval = (0, _to_milliseconds.toMS)(tlConfig.time.interval);
    const scaleInterval = (0, _to_milliseconds.toMS)(args.byName.interval);
    return (0, _alter.default)(args, function (eachSeries) {
      const data = _lodash.default.map(eachSeries.data, function (point) {
        return [point[0], point[1] / currentInterval * scaleInterval];
      });

      eachSeries.data = data;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;