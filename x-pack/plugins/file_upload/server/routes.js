"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileUploadRoutes = fileUploadRoutes;

var _common = require("../common");

var _error_wrapper = require("./error_wrapper");

var _import_data = require("./import_data");

var _telemetry = require("./telemetry");

var _schemas = require("./schemas");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function importData(client, id, index, settings, mappings, ingestPipeline, data) {
  const {
    importData: importDataFunc
  } = (0, _import_data.importDataProvider)(client);
  return importDataFunc(id, index, settings, mappings, ingestPipeline, data);
}
/**
 * Routes for the file upload.
 */


function fileUploadRoutes(router) {
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /api/file_upload/import Import file data
   * @apiName ImportFile
   * @apiDescription Imports file data into elasticsearch index.
   *
   * @apiSchema (query) importFileQuerySchema
   * @apiSchema (body) importFileBodySchema
   */
  router.post({
    path: '/api/file_upload/import',
    validate: {
      query: _schemas.importFileQuerySchema,
      body: _schemas.importFileBodySchema
    },
    options: {
      body: {
        accepts: ['application/json'],
        maxBytes: _common.MAX_FILE_SIZE_BYTES
      },
      tags: ['access:fileUpload:import']
    }
  }, async (context, request, response) => {
    try {
      const {
        id
      } = request.query;
      const {
        index,
        data,
        settings,
        mappings,
        ingestPipeline
      } = request.body; // `id` being `undefined` tells us that this is a new import due to create a new index.
      // follow-up import calls to just add additional data will include the `id` of the created
      // index, we'll ignore those and don't increment the counter.

      if (id === undefined) {
        await (0, _telemetry.updateTelemetry)();
      }

      const result = await importData(context.core.elasticsearch.client, id, index, settings, mappings, // @ts-expect-error
      ingestPipeline, data);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  });
}