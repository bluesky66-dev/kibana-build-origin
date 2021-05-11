"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fileDataVisualizerRoutes = fileDataVisualizerRoutes;

var _configSchema = require("@kbn/config-schema");

var _common = require("../../../file_upload/common");

var _error_wrapper = require("../client/error_wrapper");

var _file_data_visualizer = require("../models/file_data_visualizer");

var _file_data_visualizer_schema = require("./schemas/file_data_visualizer_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function analyzeFiles(mlClient, data, overrides) {
  const {
    analyzeFile
  } = (0, _file_data_visualizer.fileDataVisualizerProvider)(mlClient);
  return analyzeFile(data, overrides);
}
/**
 * Routes for the file data visualizer.
 */


function fileDataVisualizerRoutes({
  router,
  routeGuard
}) {
  /**
   * @apiGroup FileDataVisualizer
   *
   * @api {post} /api/ml/file_data_visualizer/analyze_file Analyze file data
   * @apiName AnalyzeFile
   * @apiDescription Performs analysis of the file data.
   *
   * @apiSchema (query) analyzeFileQuerySchema
   */
  router.post({
    path: '/api/ml/file_data_visualizer/analyze_file',
    validate: {
      body: _configSchema.schema.any(),
      query: _file_data_visualizer_schema.analyzeFileQuerySchema
    },
    options: {
      body: {
        accepts: ['text/*', 'application/json'],
        maxBytes: _common.MAX_FILE_SIZE_BYTES
      },
      tags: ['access:ml:canFindFileStructure']
    }
  }, routeGuard.basicLicenseAPIGuard(async ({
    mlClient,
    request,
    response
  }) => {
    try {
      const result = await analyzeFiles(mlClient, request.body, request.query);
      return response.ok({
        body: result
      });
    } catch (e) {
      return response.customError((0, _error_wrapper.wrapError)(e));
    }
  }));
}