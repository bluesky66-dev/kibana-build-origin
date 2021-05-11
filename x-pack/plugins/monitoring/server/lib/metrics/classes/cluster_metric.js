"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ClusterMetric = void 0;

var _metric = require("./metric");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class ClusterMetric extends _metric.Metric {
  constructor(opts) {
    super({ ...opts,
      uuidField: 'cluster_uuid'
    });
  }

}

exports.ClusterMetric = ClusterMetric;