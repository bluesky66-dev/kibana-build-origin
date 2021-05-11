"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _alter = _interopRequireDefault(require("../../lib/alter.js"));

var _chainable = _interopRequireDefault(require("../../lib/classes/chainable"));

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const functions = {
  avg: require('./avg'),
  cardinality: require('./cardinality'),
  min: require('./min'),
  max: require('./max'),
  last: require('./last'),
  first: require('./first'),
  sum: require('./sum')
};

var _default = new _chainable.default('aggregate', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'function',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.aggregate.args.functionHelpText', {
      defaultMessage: 'One of {functions}',
      values: {
        functions: _lodash.default.keys(functions).join(', ')
      }
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.aggregateHelpText', {
    defaultMessage: 'Creates a static line based on result of processing all points in the series. Available functions: {functions}',
    values: {
      functions: _lodash.default.keys(functions).join(', ')
    }
  }),
  fn: function aggregateFn(args) {
    const fn = functions[args.byName.function];
    if (!fn) throw new Error('.aggregate() function must be one of: ' + _lodash.default.keys(functions).join(', '));
    return (0, _alter.default)(args, function (eachSeries) {
      const times = _lodash.default.map(eachSeries.data, 0);

      const values = _lodash.default.map(eachSeries.data, 1);

      eachSeries.data = _lodash.default.zip(times, _lodash.default.fill(values, fn(values)));
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;