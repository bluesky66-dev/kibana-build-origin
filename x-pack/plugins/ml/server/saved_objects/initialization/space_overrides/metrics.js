"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricsJobsSpaces = metricsJobsSpaces;

var _re = _interopRequireDefault(require("re2"));

var _log = require("../../../lib/log");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GROUP = 'metrics';
const MODULE_PREFIX = 'kibana-metrics-ui';
const SOURCES = ['default', 'internal-stack-monitoring'];
const JOB_IDS = ['k8s_memory_usage', 'k8s_network_in', 'k8s_network_out', 'hosts_memory_usage', 'hosts_network_in', 'hosts_network_out']; // jobs created by the logs plugin will be in the metrics group
// they contain the a space name in the job id, and so the id can be parsed
// and the job assigned to the correct space.

async function metricsJobsSpaces({
  asInternalUser
}) {
  try {
    const {
      body
    } = await asInternalUser.ml.getJobs({
      job_id: GROUP
    });

    if (body.jobs.length === 0) {
      return [];
    }

    const findMetricJobSpace = findMetricsJobSpaceFactory();
    return body.jobs.map(j => ({
      id: j.job_id,
      space: findMetricJobSpace(j.job_id)
    })).filter(j => j.space !== null);
  } catch ({
    body
  }) {
    if (body.status !== 404) {
      // 404s are expected if there are no metrics jobs
      _log.mlLog.error(`Error Initializing Metrics job ${JSON.stringify(body)}`);
    }
  }

  return [];
}

function findMetricsJobSpaceFactory() {
  const reg = new _re.default(`${MODULE_PREFIX}-(.+)-(${SOURCES.join('|')})-(${JOB_IDS.join('|')})`);
  return jobId => {
    var _result$;

    const result = reg.exec(jobId);

    if (result === null) {
      return null;
    }

    return (_result$ = result[1]) !== null && _result$ !== void 0 ? _result$ : null;
  };
}