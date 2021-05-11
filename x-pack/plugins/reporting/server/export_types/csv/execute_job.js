"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runTaskFnFactory = void 0;

var _constants = require("../../../common/constants");

var _common = require("../common");

var _generate_csv = require("./generate_csv");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const runTaskFnFactory = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();
  return async function runTask(jobId, job, cancellationToken) {
    const elasticsearch = reporting.getElasticsearchService();
    const logger = parentLogger.clone([_constants.CSV_JOB_TYPE_DEPRECATED, 'execute-job', jobId]);
    const generateCsv = (0, _generate_csv.createGenerateCsv)(logger);
    const encryptionKey = config.get('encryptionKey');
    const headers = await (0, _common.decryptJobHeaders)(encryptionKey, job.headers, logger);
    const fakeRequest = reporting.getFakeRequest({
      headers
    }, job.spaceId, logger);
    const uiSettingsClient = await reporting.getUiSettingsClient(fakeRequest, logger);
    const {
      callAsCurrentUser
    } = elasticsearch.legacy.client.asScoped(fakeRequest);

    const callEndpoint = (endpoint, clientParams = {}, options = {}) => callAsCurrentUser(endpoint, clientParams, options);

    const {
      content,
      maxSizeReached,
      size,
      csvContainsFormulas,
      warnings
    } = await generateCsv(job, config, uiSettingsClient, callEndpoint, cancellationToken); // @TODO: Consolidate these one-off warnings into the warnings array (max-size reached and csv contains formulas)

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