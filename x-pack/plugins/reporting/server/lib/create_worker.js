"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createWorkerFactory = createWorkerFactory;

var _constants = require("../../common/constants");

var _schema_utils = require("../../common/schema_utils");

var _esqueue = require("./esqueue");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore untyped dependency


function createWorkerFactory(reporting, logger) {
  const config = reporting.getConfig();
  const queueConfig = config.get('queue');
  const kibanaName = config.kbnConfig.get('server', 'name');
  const kibanaId = config.kbnConfig.get('server', 'uuid'); // Once more document types are added, this will need to be passed in

  return async function createWorker(queue) {
    // export type / execute job map
    const jobExecutors = new Map();

    for (const exportType of reporting.getExportTypesRegistry().getAll()) {
      const jobExecutor = exportType.runTaskFnFactory(reporting, logger);
      jobExecutors.set(exportType.jobType, jobExecutor);
    }

    const workerFn = (jobSource, payload, cancellationToken) => {
      const {
        _id: jobId,
        _source: {
          jobtype: jobType
        }
      } = jobSource;

      if (!jobId) {
        throw new Error(`Claimed job is missing an ID!: ${JSON.stringify(jobSource)}`);
      }

      const jobTypeExecutor = jobExecutors.get(jobType);

      if (!jobTypeExecutor) {
        throw new Error(`Unable to find a job executor for the claimed job: [${jobId}]`);
      } // pass the work to the jobExecutor


      return jobTypeExecutor(jobId, payload, cancellationToken);
    };

    const workerOptions = {
      kibanaName,
      kibanaId,
      interval: (0, _schema_utils.durationToNumber)(queueConfig.pollInterval),
      intervalErrorMultiplier: queueConfig.pollIntervalErrorMultiplier
    };
    const worker = queue.registerWorker(_constants.PLUGIN_ID, workerFn, workerOptions);
    worker.on(_esqueue.events.EVENT_WORKER_COMPLETE, res => {
      logger.debug(`Worker completed: (${res.job.id})`);
    });
    worker.on(_esqueue.events.EVENT_WORKER_JOB_EXECUTION_ERROR, res => {
      logger.debug(`Worker error: (${res.job.id})`);
    });
    worker.on(_esqueue.events.EVENT_WORKER_JOB_TIMEOUT, res => {
      logger.debug(`Job timeout exceeded: (${res.job.id})`);
    });
  };
}