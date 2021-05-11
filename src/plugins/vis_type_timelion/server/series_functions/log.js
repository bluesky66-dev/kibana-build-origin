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
var _default = new _chainable.default('log', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'base',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.log.args.baseHelpText', {
      defaultMessage: 'Set logarithmic base, 10 by default'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.logHelpText', {
    defaultMessage: 'Return the logarithm value of each value in the series list (default base: 10)'
  }),
  fn: function logFn(args) {
    const config = args.byName;
    return (0, _alter.default)(args, function (eachSeries) {
      const data = _lodash.default.map(eachSeries.data, function (point) {
        return [point[0], Math.log(point[1]) / Math.log(config.base || 10)];
      });

      eachSeries.data = data;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;