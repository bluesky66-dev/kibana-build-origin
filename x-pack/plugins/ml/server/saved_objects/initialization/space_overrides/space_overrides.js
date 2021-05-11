"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createJobSpaceOverrides = createJobSpaceOverrides;

var _logs = require("./logs");

var _metrics = require("./metrics");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// create a list of jobs and specific spaces to place them in
// when the are being initialized.


async function createJobSpaceOverrides(clusterClient) {
  const spaceOverrides = {
    overrides: {
      'anomaly-detector': {},
      'data-frame-analytics': {}
    }
  };
  (await (0, _logs.logJobsSpaces)(clusterClient)).forEach(o => spaceOverrides.overrides['anomaly-detector'][o.id] = [o.space]);
  (await (0, _metrics.metricsJobsSpaces)(clusterClient)).forEach(o => spaceOverrides.overrides['anomaly-detector'][o.id] = [o.space]);
  return spaceOverrides;
}