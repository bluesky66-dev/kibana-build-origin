"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTimelineRoute = void 0;

var _constants = require("../../../../common/constants");

var _route_validation = require("../../../utils/build_validation/route_validation");

var _utils = require("../../detection_engine/routes/utils");

var _common = require("./utils/common");

var _get_timeline_by_id_schema = require("./schemas/get_timeline_by_id_schema");

var _create_timelines = require("./utils/create_timelines");

var _saved_object = require("../saved_object");

var _timeline = require("../../../../common/types/timeline");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getTimelineRoute = (router, config, security) => {
  router.get({
    path: `${_constants.TIMELINE_URL}`,
    validate: {
      query: (0, _route_validation.buildRouteValidationWithExcess)(_get_timeline_by_id_schema.getTimelineByIdSchemaQuery)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    try {
      var _request$query, _res;

      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const query = (_request$query = request.query) !== null && _request$query !== void 0 ? _request$query : {};
      const {
        template_timeline_id: templateTimelineId,
        id
      } = query;
      let res = null;

      if (templateTimelineId != null && id == null) {
        res = await (0, _create_timelines.getTemplateTimeline)(frameworkRequest, templateTimelineId);
      } else if (templateTimelineId == null && id != null) {
        res = await (0, _create_timelines.getTimeline)(frameworkRequest, id);
      } else if (templateTimelineId == null && id == null) {
        var _tempResult$totalCoun;

        const tempResult = await (0, _saved_object.getAllTimeline)(frameworkRequest, false, {
          pageSize: 1,
          pageIndex: 1
        }, null, null, _timeline.TimelineStatus.active, null);
        res = await (0, _saved_object.getAllTimeline)(frameworkRequest, false, {
          pageSize: (_tempResult$totalCoun = tempResult === null || tempResult === void 0 ? void 0 : tempResult.totalCount) !== null && _tempResult$totalCoun !== void 0 ? _tempResult$totalCoun : 0,
          pageIndex: 1
        }, null, null, _timeline.TimelineStatus.active, null);
      }

      return response.ok({
        body: (_res = res) !== null && _res !== void 0 ? _res : {}
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

exports.getTimelineRoute = getTimelineRoute;