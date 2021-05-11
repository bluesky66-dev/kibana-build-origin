"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _alter = _interopRequireDefault(require("../lib/alter.js"));

var _lodash = _interopRequireDefault(require("lodash"));

var _chainable = _interopRequireDefault(require("../lib/classes/chainable"));

var _load_functions = _interopRequireDefault(require("../lib/load_functions.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fitFunctions = (0, _load_functions.default)('fit_functions');

var _default = new _chainable.default('fit', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'mode',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.fit.args.modeHelpText', {
      defaultMessage: 'The algorithm to use for fitting the series to the target. One of: {fitFunctions}',
      values: {
        fitFunctions: _lodash.default.keys(fitFunctions).join(', ')
      }
    }),
    suggestions: _lodash.default.keys(fitFunctions).map(key => {
      return {
        name: key
      };
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.fitHelpText', {
    defaultMessage: 'Fills null values using a defined fit function'
  }),
  fn: function absFn(args) {
    return (0, _alter.default)(args, function (eachSeries, mode) {
      const noNulls = eachSeries.data.filter(item => item[1] === 0 || item[1]);

      if (noNulls.length === 0) {
        return eachSeries;
      }

      eachSeries.data = fitFunctions[mode](noNulls, eachSeries.data);
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;