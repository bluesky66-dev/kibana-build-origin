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
var _default = new _chainable.default('trim', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'start',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.trim.args.startHelpText', {
      defaultMessage: 'Buckets to trim from the beginning of the series. Default: 1'
    })
  }, {
    name: 'end',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.trim.args.endHelpText', {
      defaultMessage: 'Buckets to trim from the end of the series. Default: 1'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.trimHelpText', {
    defaultMessage: 'Set N buckets at the start or end of a series to null to fit the "partial bucket issue"'
  }),
  fn: function conditionFn(args) {
    const config = args.byName;
    if (config.start == null) config.start = 1;
    if (config.end == null) config.end = 1;
    return (0, _alter.default)(args, function (eachSeries) {
      _lodash.default.times(config.start, function (i) {
        eachSeries.data[i][1] = null;
      });

      _lodash.default.times(config.end, function (i) {
        eachSeries.data[eachSeries.data.length - 1 - i][1] = null;
      });

      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;