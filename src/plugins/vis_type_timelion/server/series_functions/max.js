"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _reduce = _interopRequireDefault(require("../lib/reduce.js"));

var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _chainable.default('max', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'value',
    types: ['seriesList', 'number'],
    help: _i18n.i18n.translate('timelion.help.functions.max.args.valueHelpText', {
      defaultMessage: 'Sets the point to whichever is higher, the existing value, or the one passed. ' + 'If passing a seriesList it must contain exactly 1 series.'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.maxHelpText', {
    defaultMessage: 'Maximum values of one or more series in a seriesList to each position, in each series, of the input seriesList'
  }),
  fn: function maxFn(args) {
    return (0, _reduce.default)(args, function (a, b) {
      return Math.max(a, b);
    });
  }
});

exports.default = _default;
module.exports = exports.default;