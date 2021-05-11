"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.securitySolutionFactory = void 0;

var _hosts = require("./hosts");

var _matrix_histogram = require("./matrix_histogram");

var _network = require("./network");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const securitySolutionFactory = { ..._hosts.hostsFactory,
  ..._matrix_histogram.matrixHistogramFactory,
  ..._network.networkFactory
};
exports.securitySolutionFactory = securitySolutionFactory;