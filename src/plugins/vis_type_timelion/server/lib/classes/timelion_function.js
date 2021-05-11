"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _load_functions = _interopRequireDefault(require("../load_functions.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const fitFunctions = (0, _load_functions.default)('fit_functions');

class TimelionFunction {
  constructor(name, config) {
    this.name = name;
    this.args = config.args || [];
    this.argsByName = _lodash.default.keyBy(this.args, 'name');
    this.help = config.help || '';
    this.aliases = config.aliases || [];
    this.extended = config.extended || false; // WTF is this? How could you not have a fn? Wtf would the thing be used for?

    const originalFunction = config.fn || function (input) {
      return input;
    }; // Currently only re-fits the series.


    this.originalFn = originalFunction;

    this.fn = function (args, tlConfig) {
      const config = _lodash.default.clone(tlConfig);

      return Promise.resolve(originalFunction(args, config)).then(function (seriesList) {
        seriesList.list = _lodash.default.map(seriesList.list, function (series) {
          const target = tlConfig.getTargetSeries(); // Don't fit if the series are already the same

          if (_lodash.default.isEqual(_lodash.default.map(series.data, 0), _lodash.default.map(target, 0))) return series;
          let fit;

          if (args.byName.fit) {
            fit = args.byName.fit;
          } else if (series.fit) {
            fit = series.fit;
          } else {
            fit = 'nearest';
          }

          series.data = fitFunctions[fit](series.data, tlConfig.getTargetSeries());
          return series;
        });
        return seriesList;
      });
    };
  }

}

exports.default = TimelionFunction;
module.exports = exports.default;