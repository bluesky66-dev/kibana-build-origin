"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isClusterOptedIn = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const isClusterOptedIn = clusterUsage => {
  var _clusterUsage$stack_s, _clusterUsage$stack_s2, _clusterUsage$stack_s3, _clusterUsage$stack_s4, _clusterUsage$stack_s5, _clusterUsage$stack_s6, _clusterUsage$stack_s7;

  return (clusterUsage === null || clusterUsage === void 0 ? void 0 : (_clusterUsage$stack_s = clusterUsage.stack_stats) === null || _clusterUsage$stack_s === void 0 ? void 0 : (_clusterUsage$stack_s2 = _clusterUsage$stack_s.kibana) === null || _clusterUsage$stack_s2 === void 0 ? void 0 : (_clusterUsage$stack_s3 = _clusterUsage$stack_s2.plugins) === null || _clusterUsage$stack_s3 === void 0 ? void 0 : (_clusterUsage$stack_s4 = _clusterUsage$stack_s3.telemetry) === null || _clusterUsage$stack_s4 === void 0 ? void 0 : _clusterUsage$stack_s4.opt_in_status) === true || // If stack_stats.kibana.plugins.telemetry does not exist, assume opted-in for BWC
  !(clusterUsage !== null && clusterUsage !== void 0 && (_clusterUsage$stack_s5 = clusterUsage.stack_stats) !== null && _clusterUsage$stack_s5 !== void 0 && (_clusterUsage$stack_s6 = _clusterUsage$stack_s5.kibana) !== null && _clusterUsage$stack_s6 !== void 0 && (_clusterUsage$stack_s7 = _clusterUsage$stack_s6.plugins) !== null && _clusterUsage$stack_s7 !== void 0 && _clusterUsage$stack_s7.telemetry);
};

exports.isClusterOptedIn = isClusterOptedIn;