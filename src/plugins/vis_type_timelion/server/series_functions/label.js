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
var _default = new _chainable.default('label', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'label',
    types: ['string'],
    help: _i18n.i18n.translate('timelion.help.functions.label.args.labelHelpText', {
      defaultMessage: 'Legend value for series. You can use $1, $2, etc, in the string to match up with the regex capture groups',
      description: '"$1" and "$2" are part of the expression and must not be translated.'
    })
  }, {
    name: 'regex',
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.label.args.regexHelpText', {
      defaultMessage: 'A regex with capture group support'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.labelHelpText', {
    defaultMessage: 'Change the label of the series. Use %s to reference the existing label'
  }),
  fn: function labelFn(args) {
    const config = args.byName;
    return (0, _alter.default)(args, function (eachSeries) {
      if (config.regex) {
        // not using a standard `import` so that if there's an issue with the re2 native module
        // that it doesn't prevent Kibana from starting up and we only have an issue using Timelion labels
        const RE2 = require('re2');

        eachSeries.label = eachSeries.label.replace(new RE2(config.regex), config.label);
      } else {
        eachSeries.label = config.label;
      }

      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;