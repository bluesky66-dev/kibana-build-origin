"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tlConfigFn;

var _lodash = _interopRequireDefault(require("lodash"));

var _build_target = _interopRequireDefault(require("../../lib/build_target.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function tlConfigFn(setup) {
  let targetSeries;
  let tlConfig = {
    getTargetSeries: function () {
      return _lodash.default.map(targetSeries, function (bucket) {
        // eslint-disable-line no-use-before-define
        return [bucket, null];
      });
    },
    setTargetSeries: function () {
      targetSeries = (0, _build_target.default)(this);
    },
    writeTargetSeries: function (series) {
      targetSeries = _lodash.default.map(series, function (p) {
        return p[0];
      });
    }
  };
  tlConfig = _lodash.default.extend(tlConfig, setup);
  return tlConfig;
}

module.exports = exports.default;