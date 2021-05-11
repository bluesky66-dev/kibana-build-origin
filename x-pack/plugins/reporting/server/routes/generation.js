"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerJobGenerationRoutes = registerJobGenerationRoutes;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _elasticsearch = require("elasticsearch");

var _constants = require("../../common/constants");

var _enqueue_job = require("../lib/enqueue_job");

var _generate_from_jobparams = require("./generate_from_jobparams");

var _generate_from_savedobject_immediate = require("./generate_from_savedobject_immediate");

var _legacy = require("./legacy");

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


const esErrors = _elasticsearch.errors;

const getDownloadBaseUrl = reporting => {
  const config = reporting.getConfig();
  return config.kbnConfig.get('server', 'basePath') + `${_constants.API_BASE_URL}/jobs/download`;
};

function registerJobGenerationRoutes(reporting, logger) {
  /*
   * Generates enqueued job details to use in responses
   */
  const handler = async (user, exportTypeId, jobParams, context, req, res) => {
    // ensure the async dependencies are loaded
    if (!context.reporting) {
      return res.custom({
        statusCode: 503,
        body: 'Not Available'
      });
    }

    const licenseInfo = await reporting.getLicenseInfo();
    const licenseResults = licenseInfo[exportTypeId];

    if (!licenseResults) {
      return res.badRequest({
        body: `Invalid export-type of ${exportTypeId}`
      });
    }

    if (!licenseResults.enableLinks) {
      return res.forbidden({
        body: licenseResults.message
      });
    }

    try {
      const enqueueJob = (0, _enqueue_job.enqueueJobFactory)(reporting, logger);
      const report = await enqueueJob(exportTypeId, jobParams, user, context, req); // return the queue's job information

      const downloadBaseUrl = getDownloadBaseUrl(reporting);
      return res.ok({
        headers: {
          'content-type': 'application/json'
        },
        body: {
          path: `${downloadBaseUrl}/${report._id}`,
          job: report.toApiJSON()
        }
      });
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };
  /*
   * Error should already have been logged by the time we get here
   */


  function handleError(res, err) {
    if (err instanceof _boom.default.Boom) {
      return res.customError({
        statusCode: err.output.statusCode,
        body: err.output.payload.message
      });
    }

    if (err instanceof esErrors['401']) {
      return res.unauthorized({
        body: `Sorry, you aren't authenticated`
      });
    }

    if (err instanceof esErrors['403']) {
      return res.forbidden({
        body: `Sorry, you are not authorized`
      });
    }

    if (err instanceof esErrors['404']) {
      return res.notFound({
        body: err.message
      });
    } // unknown error, can't convert to 4xx


    throw err;
  }

  (0, _generate_from_jobparams.registerGenerateFromJobParams)(reporting, handler, handleError);
  (0, _legacy.registerLegacy)(reporting, handler, handleError, logger); // 7.x only

  (0, _generate_from_savedobject_immediate.registerGenerateCsvFromSavedObjectImmediate)(reporting, handleError, logger);
}