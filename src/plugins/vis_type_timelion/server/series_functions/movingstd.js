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
const positions = ['left', 'right', 'center'];
const defaultPosition = positions[0];

var _default = new _chainable.default('movingstd', {
  args: [{
    name: 'inputSeries',
    types: ['seriesList']
  }, {
    name: 'window',
    types: ['number'],
    help: _i18n.i18n.translate('timelion.help.functions.movingstd.args.windowHelpText', {
      defaultMessage: 'Number of points to compute the standard deviation over.'
    })
  }, {
    name: 'position',
    types: ['string', 'null'],
    help: _i18n.i18n.translate('timelion.help.functions.movingstd.args.positionHelpText', {
      defaultMessage: 'Position of the window slice relative to the result time. Options are {positions}. Default: {defaultPosition}',
      values: {
        positions: positions.join(', '),
        defaultPosition
      }
    })
  }],
  aliases: ['mvstd'],
  help: _i18n.i18n.translate('timelion.help.functions.movingstdHelpText', {
    defaultMessage: 'Calculate the moving standard deviation over a given window. Uses naive two-pass algorithm. ' + 'Rounding errors may become more noticeable with very long series, or series with very large numbers.'
  }),
  fn: function movingstdFn(args) {
    return (0, _alter.default)(args, function (eachSeries, _window, _position) {
      _position = _position || defaultPosition;

      if (!_lodash.default.includes(positions, _position)) {
        throw new Error(_i18n.i18n.translate('timelion.serverSideErrors.movingstdFunction.notValidPositionErrorMessage', {
          defaultMessage: 'Valid positions are: {validPositions}',
          values: {
            validPositions: positions.join(', ')
          }
        }));
      }

      const pairs = eachSeries.data;
      const pairsLen = pairs.length;
      eachSeries.label = eachSeries.label + ' mvstd=' + _window;

      function toPoint(point, pairSlice) {
        const average = _lodash.default.chain(pairSlice).map(1).reduce(function (memo, num) {
          return memo + num;
        }).value() / _window;

        const variance = _lodash.default.chain(pairSlice).map(function (point) {
          return Math.pow(point[1] - average, 2);
        }).reduce(function (memo, num) {
          return memo + num;
        }).value() / (_window - 1);

        return [point[0], Math.sqrt(variance)];
      }

      if (_position === 'center') {
        const windowLeft = Math.floor(_window / 2);
        const windowRight = _window - windowLeft;
        eachSeries.data = _lodash.default.map(pairs, function (point, i) {
          if (i < windowLeft || i >= pairsLen - windowRight) return [point[0], null];
          return toPoint(point, pairs.slice(i - windowLeft, i + windowRight));
        });
      } else if (_position === 'left') {
        eachSeries.data = _lodash.default.map(pairs, function (point, i) {
          if (i < _window) return [point[0], null];
          return toPoint(point, pairs.slice(i - _window, i));
        });
      } else if (_position === 'right') {
        eachSeries.data = _lodash.default.map(pairs, function (point, i) {
          if (i >= pairsLen - _window) return [point[0], null];
          return toPoint(point, pairs.slice(i, i + _window));
        });
      }

      return eachSeries;
    });
  }
});

exports.default = _default;
module.exports = exports.default;