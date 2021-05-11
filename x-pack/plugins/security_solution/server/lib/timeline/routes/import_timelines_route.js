"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importTimelinesRoute = void 0;

var _path = require("path");

var _constants = require("../../../../common/constants");

var _route_validation = require("../../../utils/build_validation/route_validation");

var _utils = require("../../detection_engine/routes/utils");

var _import_timelines = require("./utils/import_timelines");

var _import_timelines_schema = require("./schemas/import_timelines_schema");

var _common = require("./utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const importTimelinesRoute = (router, config, security) => {
  router.post({
    path: `${_constants.TIMELINE_IMPORT_URL}`,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_import_timelines_schema.ImportTimelinesPayloadSchemaRt)
    },
    options: {
      tags: ['access:securitySolution'],
      body: {
        maxBytes: config.maxTimelineImportPayloadBytes,
        output: 'stream'
      }
    }
  }, async (context, request, response) => {
    try {
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      const savedObjectsClient = context.core.savedObjects.client;

      if (!savedObjectsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const {
        file,
        isImmutable
      } = request.body;
      const {
        filename
      } = file.hapi;
      const fileExtension = (0, _path.extname)(filename).toLowerCase();

      if (fileExtension !== '.ndjson') {
        return siemResponse.error({
          statusCode: 400,
          body: `Invalid file extension ${fileExtension}`
        });
      }

      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const res = await (0, _import_timelines.importTimelines)(file, config.maxTimelineImportExportSize, frameworkRequest, isImmutable === 'true');
      if (typeof res !== 'string') return response.ok({
        body: res !== null && res !== void 0 ? res : {}
      });else throw res;
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      const siemResponse = (0, _utils.buildSiemResponse)(response);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.importTimelinesRoute = importTimelinesRoute;