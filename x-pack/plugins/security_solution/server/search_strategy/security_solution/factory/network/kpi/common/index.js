"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatHistogramData = exports.getIpFilter = void 0;

var _fp = require("lodash/fp");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getIpFilter = () => [{
  bool: {
    should: [{
      exists: {
        field: 'source.ip'
      }
    }, {
      exists: {
        field: 'destination.ip'
      }
    }],
    minimum_should_match: 1
  }
}];

exports.getIpFilter = getIpFilter;

const formatHistogramData = data => data && data.length > 0 ? data.map(({
  key,
  count
}) => ({
  x: key,
  y: (0, _fp.getOr)(null, 'value', count)
})) : null;

exports.formatHistogramData = formatHistogramData;