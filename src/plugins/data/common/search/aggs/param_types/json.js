"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonParamType = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _base = require("./base");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
class JsonParamType extends _base.BaseParamType {
  constructor(config) {
    super(config);
    this.name = config.name || 'json';

    if (!config.write) {
      this.write = (aggConfig, output) => {
        let paramJson;
        const param = aggConfig.params[this.name];

        if (!param) {
          return;
        } // handle invalid Json input


        try {
          paramJson = JSON.parse(param);
        } catch (err) {
          return;
        }

        function filteredCombine(srcA, srcB) {
          function mergeObjs(a, b) {
            return (0, _lodash.default)(a).keys().union(_lodash.default.keys(b)).transform(function (dest, key) {
              const val = compare(a[key], b[key]);
              if (val !== undefined) dest[key] = val;
            }, {}).value();
          }

          function mergeArrays(a, b) {
            // attempt to merge each value
            return _lodash.default.times(Math.max(a.length, b.length), function (i) {
              return compare(a[i], b[i]);
            });
          }

          function compare(a, b) {
            if (_lodash.default.isPlainObject(a) && _lodash.default.isPlainObject(b)) return mergeObjs(a, b);
            if (Array.isArray(a) && Array.isArray(b)) return mergeArrays(a, b);
            if (b === null) return undefined;
            if (b !== undefined) return b;
            return a;
          }

          return compare(srcA, srcB);
        }

        output.params = filteredCombine(output.params, paramJson);
        return;
      };
    }
  }

}

exports.JsonParamType = JsonParamType;