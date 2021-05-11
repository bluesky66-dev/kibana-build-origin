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
var _default = new _chainable.default('hide', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'hide',
    types: ['boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.hide.args.hideHelpText', {
      defaultMessage: 'Hide or unhide the series'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.hideHelpText', {
    defaultMessage: 'Hide the series by default'
  }),
  fn: function hideFn(args) {
    return (0, _alter.default)(args, function (eachSeries, hide) {
      eachSeries._hide = hide == null ? true : hide;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;