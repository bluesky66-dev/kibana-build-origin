"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateTimelinesRoute = void 0;

var _constants = require("../../../../common/constants");

var _route_validation = require("../../../utils/build_validation/route_validation");

var _utils = require("../../detection_engine/routes/utils");

var _update_timelines_schema = require("./schemas/update_timelines_schema");

var _common = require("./utils/common");

var _create_timelines = require("./utils/create_timelines");

var _compare_timelines_status = require("./utils/compare_timelines_status");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateTimelinesRoute = (router, config, security) => {
  router.patch({
    path: _constants.TIMELINE_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidationWithExcess)(_update_timelines_schema.updateTimelineSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);

    try {
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const {
        timelineId,
        timeline,
        version
      } = request.body;
      const {
        templateTimelineId,
        templateTimelineVersion,
        timelineType,
        title,
        status
      } = timeline;
      const compareTimelinesStatus = new _compare_timelines_status.CompareTimelinesStatus({
        status,
        title,
        timelineType,
        timelineInput: {
          id: timelineId,
          version
        },
        templateTimelineInput: {
          id: templateTimelineId,
          version: templateTimelineVersion
        },
        frameworkRequest
      });
      await compareTimelinesStatus.init();

      if (compareTimelinesStatus.isUpdatable) {
        const updatedTimeline = await (0, _create_timelines.createTimelines)({
          frameworkRequest,
          timeline,
          timelineSavedObjectId: timelineId,
          timelineVersion: version
        });
        return response.ok({
          body: {
            data: {
              persistTimeline: updatedTimeline
            }
          }
        });
      } else {
        const error = compareTimelinesStatus.checkIsFailureCases(_common.TimelineStatusActions.update);
        return siemResponse.error(error || {
          statusCode: 405,
          body: 'update timeline error'
        });
      }
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.updateTimelinesRoute = updateTimelinesRoute;