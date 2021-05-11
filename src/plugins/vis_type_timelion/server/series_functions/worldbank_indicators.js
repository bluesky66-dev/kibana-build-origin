"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _i18n = require("@kbn/i18n");

var _lodash = _interopRequireDefault(require("lodash"));

var _worldbank = _interopRequireDefault(require("./worldbank.js"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _datasource = _interopRequireDefault(require("../lib/classes/datasource"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
var _default = new _datasource.default('worldbank_indicators', {
  args: [{
    name: 'country',
    // countries/all/indicators/SP.POP.TOTL
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.worldbankIndicators.args.countryHelpText', {
      defaultMessage: `Worldbank country identifier. Usually the country's 2 letter code`
    })
  }, {
    name: 'indicator',
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.worldbankIndicators.args.indicatorHelpText', {
      defaultMessage: `The indicator code to use. You'll have to look this up on {worldbankUrl}. ` + 'Often pretty obtuse. E.g., {indicatorExample} is population',
      values: {
        worldbankUrl: 'data.worldbank.org',
        indicatorExample: 'SP.POP.TOTL'
      }
    })
  }],
  aliases: ['wbi'],
  help: _i18n.i18n.translate('timelion.help.functions.worldbankIndicatorsHelpText', {
    defaultMessage: `
    [experimental]
    Pull data from {worldbankUrl} using the country name and indicator. The worldbank provides
    mostly yearly data, and often has no data for the current year. Try {offsetQuery} if you get no data for recent
    time ranges.`,
    values: {
      worldbankUrl: 'https://api.worldbank.org/v2/',
      offsetQuery: 'offset=-1y'
    }
  }),
  fn: function worldbankIndicators(args, tlConfig) {
    const config = _lodash.default.defaults(args.byName, {
      country: 'wld',
      indicator: 'SP.POP.TOTL'
    });

    const countries = config.country.split(':');

    const seriesLists = _lodash.default.map(countries, function (country) {
      const code = 'country/' + country + '/indicator/' + config.indicator;
      const wbArgs = [code];
      wbArgs.byName = {
        code: code
      };
      return _worldbank.default.timelionFn(wbArgs, tlConfig);
    });

    return _bluebird.default.map(seriesLists, function (seriesList) {
      return seriesList.list[0];
    }).then(function (list) {
      return {
        type: 'seriesList',
        list: list
      };
    });
  }
});

exports.default = _default;
module.exports = exports.default;