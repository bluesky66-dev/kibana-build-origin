"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _alter = _interopRequireDefault(require("../lib/alter.js"));

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
var _default = new _chainable.default('cusum', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'base',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.cusum.args.baseHelpText', {
      defaultMessage: 'Number to start at. Basically just adds this to the beginning of the series'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.cusumHelpText', {
    defaultMessage: 'Return the cumulative sum of a series, starting at a base.'
  }),
  fn: function cusumFn(args) {
    return (0, _alter.default)(args, function (eachSeries, base) {
      const pairs = eachSeries.data;
      let total = base || 0;
      eachSeries.data = _lodash.default.map(pairs, function (point) {
        total += point[1];
        return [point[0], total];
      });
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;