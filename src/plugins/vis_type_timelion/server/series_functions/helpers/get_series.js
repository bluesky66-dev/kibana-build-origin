"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getSeries;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function getSeries(name, buckets, points) {
  const fill = _lodash.default.partial(_lodash.default.zip, _lodash.default.map(buckets, function (bucket) {
    return bucket.valueOf();
  }));

  return {
    data: fill(points),
    type: 'series',
    label: name
  };
}

module.exports = exports.default;