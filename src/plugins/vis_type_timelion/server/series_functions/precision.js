"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _reduce = _interopRequireDefault(require("../lib/reduce.js"));

var _alter = _interopRequireDefault(require("../lib/alter.js"));

var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _chainable.default('precision', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'precision',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.precision.args.precisionHelpText', {
      defaultMessage: 'The number of digits to truncate each value to'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.precisionHelpText', {
    defaultMessage: 'The number of digits to truncate the decimal portion of the value to'
  }),
  fn: async function precisionFn(args) {
    await (0, _alter.default)(args, function (eachSeries, precision) {
      eachSeries._meta = eachSeries._meta || {};
      eachSeries._meta.precision = precision;
      return eachSeries;
    });
    return (0, _reduce.default)(args, function (a, b) {
      return parseInt(a * Math.pow(10, b), 10) / Math.pow(10, b);
    });
  }
});

exports.default = _default;
module.exports = exports.default;