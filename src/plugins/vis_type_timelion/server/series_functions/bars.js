"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

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
var _default = new _chainable.default('bars', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'width',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.bars.args.widthHelpText', {
      defaultMessage: 'Width of bars in pixels'
    })
  }, {
    name: 'stack',
    types: ['boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.bars.args.stackHelpText', {
      defaultMessage: 'Should bars be stacked, true by default'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.barsHelpText', {
    defaultMessage: 'Show the seriesList as bars'
  }),
  fn: function barsFn(args) {
    return (0, _alter.default)(args, function (eachSeries, width, stack) {
      eachSeries.bars = eachSeries.bars || {};
      eachSeries.bars.show = width == null ? 1 : width;
      eachSeries.bars.lineWidth = width == null ? 6 : width;
      eachSeries.stack = stack == null ? true : stack;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;