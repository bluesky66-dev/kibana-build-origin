"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGenerateCsvFromSavedObjectImmediate = registerGenerateCsvFromSavedObjectImmediate;

var _configSchema = require("@kbn/config-schema");

var _create_job = require("../export_types/csv_from_savedobject/create_job");

var _execute_job = require("../export_types/csv_from_savedobject/execute_job");

var _authorized_user_pre_routing = require("./lib/authorized_user_pre_routing");

var _get_job_params_from_request = require("./lib/get_job_params_from_request");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const API_BASE_URL_V1 = '/api/reporting/v1';
const API_BASE_GENERATE_V1 = `${API_BASE_URL_V1}/generate`;
/*
 * This function registers API Endpoints for immediate Reporting jobs. The API inputs are:
 * - saved object type and ID
 * - time range and time zone
 * - application state:
 *     - filters
 *     - query bar
 *     - local (transient) changes the user made to the saved object
 */

function registerGenerateCsvFromSavedObjectImmediate(reporting, handleError, parentLogger) {
  const setupDeps = reporting.getPluginSetupDeps();
  const userHandler = (0, _authorized_user_pre_routing.authorizedUserPreRoutingFactory)(reporting);
  const {
    router
  } = setupDeps;
  /*
   * CSV export with the `immediate` option does not queue a job with Reporting's ESQueue to run the job async. Instead, this does:
   *  - re-use the createJob function to build up es query config
   *  - re-use the runTask function to run the scan and scroll queries and capture the entire CSV in a result object.
   */

  router.post({
    path: `${API_BASE_GENERATE_V1}/immediate/csv/saved-object/{savedObjectType}:{savedObjectId}`,
    validate: {
      params: _configSchema.schema.object({
        savedObjectType: _configSchema.schema.string({
          minLength: 5
        }),
        savedObjectId: _configSchema.schema.string({
          minLength: 5
        })
      }),
      body: _configSchema.schema.object({
        state: _configSchema.schema.object({}, {
          unknowns: 'allow'
        }),
        timerange: _configSchema.schema.object({
          timezone: _configSchema.schema.string({
            defaultValue: 'UTC'
          }),
          min: _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string({
            minLength: 5
          })])),
          max: _configSchema.schema.nullable(_configSchema.schema.oneOf([_configSchema.schema.number(), _configSchema.schema.string({
            minLength: 5
          })]))
        })
      })
    }
  }, userHandler(async (user, context, req, res) => {
    const logger = parentLogger.clone(['savedobject-csv']);
    const jobParams = (0, _get_job_params_from_request.getJobParamsFromRequest)(req);
    const createJob = (0, _create_job.createJobFnFactory)(reporting, logger);
    const runTaskFn = (0, _execute_job.runTaskFnFactory)(reporting, logger);

    try {
      // FIXME: no create job for immediate download
      const payload = await createJob(jobParams, context, req);
      const {
        content_type: jobOutputContentType,
        content: jobOutputContent,
        size: jobOutputSize
      } = await runTaskFn(null, payload, context, req);
      logger.info(`Job output size: ${jobOutputSize} bytes`); // convert null to undefined so the value can be sent to h.response()

      if (jobOutputContent === null) {
        logger.warn('CSV Job Execution created empty content result');
      }

      return res.ok({
        body: jobOutputContent || '',
        headers: {
          'content-type': jobOutputContentType ? jobOutputContentType : [],
          'accept-ranges': 'none'
        }
      });
    } catch (err) {
      logger.error(err);
      return handleError(res, err);
    }
  }));
}