"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.formatTopCountriesEdges = exports.getTopCountriesEdges = void 0;

var _fp = require("lodash/fp");

var _helpers = require("../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTopCountriesEdges = (response, options) => formatTopCountriesEdges((0, _fp.getOr)([], `aggregations.${options.flowTarget}.buckets`, response.rawResponse), options.flowTarget);

exports.getTopCountriesEdges = getTopCountriesEdges;

const formatTopCountriesEdges = (buckets, flowTarget) => buckets.map(bucket => ({
  node: {
    _id: bucket.key,
    [flowTarget]: {
      country: bucket.key,
      flows: (0, _fp.getOr)(0, 'flows.value', bucket),
      [`${(0, _helpers.getOppositeField)(flowTarget)}_ips`]: (0, _fp.getOr)(0, `${(0, _helpers.getOppositeField)(flowTarget)}_ips.value`, bucket),
      [`${flowTarget}_ips`]: (0, _fp.getOr)(0, `${flowTarget}_ips.value`, bucket)
    },
    network: {
      bytes_in: (0, _fp.getOr)(0, 'bytes_in.value', bucket),
      bytes_out: (0, _fp.getOr)(0, 'bytes_out.value', bucket)
    }
  },
  cursor: {
    value: bucket.key,
    tiebreaker: null
  }
}));

exports.formatTopCountriesEdges = formatTopCountriesEdges;