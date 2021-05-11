"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _common = require("../../../common");

var _constants = require("../../../common/constants");

var _generate_csv = require("../csv/generate_csv");

var _get_csv_job = require("./lib/get_csv_job");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  const logger = parentLogger.clone([_constants.CSV_FROM_SAVEDOBJECT_JOB_TYPE, 'execute-job']);
  return async function runTask(jobId, jobPayload, context, req) {
    const generateCsv = (0, _generate_csv.createGenerateCsv)(logger);
    const {
      panel
    } = jobPayload;
    logger.debug(`Execute job generating saved search CSV`);
    const savedObjectsClient = context.core.savedObjects.client;
    const uiSettingsClient = await reporting.getUiSettingsServiceFactory(savedObjectsClient);
    const job = await (0, _get_csv_job.getGenerateCsvParams)(jobPayload, panel, savedObjectsClient, uiSettingsClient, logger);
    const elasticsearch = reporting.getElasticsearchService();
    const {
      callAsCurrentUser
    } = elasticsearch.legacy.client.asScoped(req);
    const {
      content,
      maxSizeReached,
      size,
      csvContainsFormulas,
      warnings
    } = await generateCsv(job, config, uiSettingsClient, callAsCurrentUser, new _common.CancellationToken() // can not be cancelled
    );

    if (csvContainsFormulas) {
      logger.warn(`CSV may contain formulas whose values have been escaped`);
    }

    if (maxSizeReached) {
      logger.warn(`Max size reached: CSV output truncated to ${size} bytes`);
    }

    return {
      content_type: _constants.CONTENT_TYPE_CSV,
      content,
      max_size_reached: maxSizeReached,
      size,
      csv_contains_formulas: csvContainsFormulas,
      warnings
    };
  };
};

exports.runTaskFnFactory = runTaskFnFactory;