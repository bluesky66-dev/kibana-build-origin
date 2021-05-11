"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cpu = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const cpu = {
  cpu_avg: {
    avg: {
      field: 'aws.rds.cpu.total.pct'
    }
  },
  cpu: {
    bucket_script: {
      buckets_path: {
        cpu: 'cpu_avg'
      },
      script: {
        source: 'params.cpu / 100',
        lang: 'painless'
      },
      gap_policy: 'skip'
    }
  }
};
exports.cpu = cpu;