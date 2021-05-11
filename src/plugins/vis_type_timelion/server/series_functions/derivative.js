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
var _default = new _chainable.default('derivative', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }],
  help: _i18n.i18n.translate('timelion.help.functions.derivativeHelpText', {
    defaultMessage: 'Plot the change in values over time.'
  }),
  fn: function derivativeFn(args) {
    return (0, _alter.default)(args, function (eachSeries) {
      const pairs = eachSeries.data;
      eachSeries.data = _lodash.default.map(pairs, function (point, i) {
        if (i === 0 || pairs[i - 1][1] == null || point[1] == null) {
          return [point[0], null];
        }

        return [point[0], point[1] - pairs[i - 1][1]];
      });
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;