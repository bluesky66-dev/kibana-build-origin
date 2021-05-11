"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.exportTimelinesRoute = void 0;

var _constants = require("../../../../common/constants");

var _utils = require("../../detection_engine/routes/utils");

var _export_timelines = require("./utils/export_timelines");

var _export_timelines_schema = require("./schemas/export_timelines_schema");

var _route_validation = require("../../../utils/build_validation/route_validation");

var _common = require("./utils/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exportTimelinesRoute = (router, config, security) => {
  router.post({
    path: _constants.TIMELINE_EXPORT_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidationWithExcess)(_export_timelines_schema.exportTimelinesQuerySchema),
      body: (0, _route_validation.buildRouteValidationWithExcess)(_export_timelines_schema.exportTimelinesRequestBodySchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    try {
      var _request$body, _request$body2;

      const siemResponse = (0, _utils.buildSiemResponse)(response);
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const exportSizeLimit = config.maxTimelineImportExportSize;

      if (((_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.ids) != null && request.body.ids.length > exportSizeLimit) {
        return siemResponse.error({
          statusCode: 400,
          body: `Can't export more than ${exportSizeLimit} timelines`
        });
      }

      const responseBody = await (0, _export_timelines.getExportTimelineByObjectIds)({
        frameworkRequest,
        ids: (_request$body2 = request.body) === null || _request$body2 === void 0 ? void 0 : _request$body2.ids
      });
      return response.ok({
        headers: {
          'Content-Disposition': `attachment; filename="${request.query.file_name}"`,
          'Content-Type': 'application/ndjson'
        },
        body: responseBody
      });
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

exports.exportTimelinesRoute = exportTimelinesRoute;