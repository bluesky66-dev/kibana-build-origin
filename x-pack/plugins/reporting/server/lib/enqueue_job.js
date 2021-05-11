"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.enqueueJobFactory = enqueueJobFactory;

var _schema_utils = require("../../common/schema_utils");

var _store = require("./store");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function enqueueJobFactory(reporting, parentLogger) {
  const logger = parentLogger.clone(['queue-job']);
  const config = reporting.getConfig();
  const jobSettings = {
    timeout: (0, _schema_utils.durationToNumber)(config.get('queue', 'timeout')),
    browser_type: config.get('capture', 'browser', 'type'),
    max_attempts: config.get('capture', 'maxAttempts'),
    priority: 10 // unused

  };
  return async function enqueueJob(exportTypeId, jobParams, user, context, request) {
    var _jobParams$layout;

    const exportType = reporting.getExportTypesRegistry().getById(exportTypeId);

    if (exportType == null) {
      throw new Error(`Export type ${exportTypeId} does not exist in the registry!`);
    }

    const [createJob, {
      store
    }] = await Promise.all([exportType.createJobFnFactory(reporting, logger), reporting.getPluginStartDeps()]);
    const job = await createJob(jobParams, context, request);
    const pendingReport = new _store.Report({
      jobtype: exportType.jobType,
      created_by: user ? user.username : false,
      payload: job,
      meta: {
        objectType: jobParams.objectType,
        layout: (_jobParams$layout = jobParams.layout) === null || _jobParams$layout === void 0 ? void 0 : _jobParams$layout.id
      },
      ...jobSettings
    }); // store the pending report, puts it in the Reporting Management UI table

    const report = await store.addReport(pendingReport);
    logger.info(`Scheduled ${exportType.name} report: ${report._id}`);
    return report;
  };
}