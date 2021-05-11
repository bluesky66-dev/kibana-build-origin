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
const validSymbols = ['triangle', 'cross', 'square', 'diamond', 'circle'];
const defaultSymbol = 'circle';

var _default = new _chainable.default('points', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'radius',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.points.args.radiusHelpText', {
      defaultMessage: 'Size of points'
    })
  }, {
    name: 'weight',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.points.args.weightHelpText', {
      defaultMessage: 'Thickness of line around point'
    })
  }, {
    name: 'fill',
    types: ['number', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.points.args.fillHelpText', {
      defaultMessage: 'Number between 0 and 10 representing opacity of fill'
    })
  }, {
    name: 'fillColor',
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.points.args.fillColorHelpText', {
      defaultMessage: 'Color with which to fill point'
    })
  }, {
    name: 'symbol',
    help: _i18n.i18n.translate('timelion.help.functions.points.args.symbolHelpText', {
      defaultMessage: 'point symbol. One of: {validSymbols}',
      values: {
        validSymbols: validSymbols.join(', ')
      }
    }),
    types: ['string', 'null'],
    suggestions: validSymbols.map(symbol => {
      const suggestion = {
        name: symbol
      };

      if (symbol === defaultSymbol) {
        suggestion.help = 'default';
      }

      return suggestion;
    })
  }, {
    name: 'show',
    types: ['boolean', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.points.args.showHelpText', {
      defaultMessage: 'Show points or not'
    })
  }],
  help: _i18n.i18n.translate('timelion.help.functions.pointsHelpText', {
    defaultMessage: 'Show the series as points'
  }),
  fn: function pointsFn(args) {
    return (0, _alter.default)(args, function (eachSeries, radius, weight, fill, fillColor, symbol, show) {
      eachSeries.points = eachSeries.points || {};
      eachSeries.points.radius = radius == null ? undefined : radius;

      if (fill) {
        eachSeries.points.fillColor = fillColor == null ? false : fillColor;
      }

      if (fill != null) {
        eachSeries.points.fill = fill / 10;
      }

      if (weight != null) {
        eachSeries.points.lineWidth = weight;
      }

      symbol = symbol || defaultSymbol;

      if (!_lodash.default.includes(validSymbols, symbol)) {
        throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.pointsFunction.notValidSymbolErrorMessage', {
          defaultMessage: 'Valid symbols are: {validSymbols}',
          values: {
            validSymbols: validSymbols.join(', ')
          }
        }));
      }

      eachSeries.points.symbol = symbol;
      eachSeries.points.show = show == null ? true : show;
      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;