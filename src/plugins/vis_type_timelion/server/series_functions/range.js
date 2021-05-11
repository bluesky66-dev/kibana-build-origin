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
var _default = new _chainable.default('range', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'min',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.range.args.minHelpText', {
      defaultMessage: 'New minimum value'
    })
  }, {
    name: 'max',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.range.args.maxHelpText', {
      defaultMessage: 'New maximum value'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.rangeHelpText', {
    defaultMessage: 'Changes the max and min of a series while keeping the same shape'
  }),
  fn: function range(args) {
    return (0, _alter.default)(args, function (eachSeries) {
      const values = _lodash.default.map(eachSeries.data, 1);

      const min = _lodash.default.min(values);

      const max = _lodash.default.max(values); // newvalue= (max'-min')/(max-min)*(value-min)+min'.


      const data = _lodash.default.map(eachSeries.data, function (point) {
        const val = (args.byName.max - args.byName.min) / (max - min) * (point[1] - min) + args.byName.min;
        return [point[0], val];
      });

      eachSeries.data = data;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;