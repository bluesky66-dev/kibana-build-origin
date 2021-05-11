"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrepackagedRulesStatusRoute = void 0;

var _validate = require("../../../../../common/validate");

var _prepackaged_rules_status_schema = require("../../../../../common/detection_engine/schemas/response/prepackaged_rules_status_schema");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _get_prepackaged_rules = require("../../rules/get_prepackaged_rules");

var _get_rules_to_install = require("../../rules/get_rules_to_install");

var _get_rules_to_update = require("../../rules/get_rules_to_update");

var _find_rules = require("../../rules/find_rules");

var _get_existing_prepackaged_rules = require("../../rules/get_existing_prepackaged_rules");

var _common = require("../../../timeline/routes/utils/common");

var _check_timelines_status = require("../../../timeline/routes/utils/check_timelines_status");

var _check_timelines_status_schema = require("../../../timeline/routes/schemas/check_timelines_status_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getPrepackagedRulesStatusRoute = (router, config, security) => {
  router.get({
    path: `${_constants.DETECTION_ENGINE_PREPACKAGED_URL}/_status`,
    validate: false,
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();

    if (!alertsClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    try {
      var _validatedprepackaged, _validatedprepackaged2, _validatedprepackaged3;

      const rulesFromFileSystem = (0, _get_prepackaged_rules.getPrepackagedRules)();
      const customRules = await (0, _find_rules.findRules)({
        alertsClient,
        perPage: 1,
        page: 1,
        sortField: 'enabled',
        sortOrder: 'desc',
        filter: 'alert.attributes.tags:"__internal_immutable:false"',
        fields: undefined
      });
      const frameworkRequest = await (0, _common.buildFrameworkRequest)(context, security, request);
      const prepackagedRules = await (0, _get_existing_prepackaged_rules.getExistingPrepackagedRules)({
        alertsClient
      });
      const rulesToInstall = (0, _get_rules_to_install.getRulesToInstall)(rulesFromFileSystem, prepackagedRules);
      const rulesToUpdate = (0, _get_rules_to_update.getRulesToUpdate)(rulesFromFileSystem, prepackagedRules);
      const prepackagedTimelineStatus = await (0, _check_timelines_status.checkTimelinesStatus)(frameworkRequest);
      const [validatedprepackagedTimelineStatus] = (0, _validate.validate)(prepackagedTimelineStatus, _check_timelines_status_schema.checkTimelineStatusRt);
      const prepackagedRulesStatus = {
        rules_custom_installed: customRules.total,
        rules_installed: prepackagedRules.length,
        rules_not_installed: rulesToInstall.length,
        rules_not_updated: rulesToUpdate.length,
        timelines_installed: (_validatedprepackaged = validatedprepackagedTimelineStatus === null || validatedprepackagedTimelineStatus === void 0 ? void 0 : validatedprepackagedTimelineStatus.prepackagedTimelines.length) !== null && _validatedprepackaged !== void 0 ? _validatedprepackaged : 0,
        timelines_not_installed: (_validatedprepackaged2 = validatedprepackagedTimelineStatus === null || validatedprepackagedTimelineStatus === void 0 ? void 0 : validatedprepackagedTimelineStatus.timelinesToInstall.length) !== null && _validatedprepackaged2 !== void 0 ? _validatedprepackaged2 : 0,
        timelines_not_updated: (_validatedprepackaged3 = validatedprepackagedTimelineStatus === null || validatedprepackagedTimelineStatus === void 0 ? void 0 : validatedprepackagedTimelineStatus.timelinesToUpdate.length) !== null && _validatedprepackaged3 !== void 0 ? _validatedprepackaged3 : 0
      };
      const [validated, errors] = (0, _validate.validate)(prepackagedRulesStatus, _prepackaged_rules_status_schema.prePackagedRulesAndTimelinesStatusSchema);

      if (errors != null) {
        return siemResponse.error({
          statusCode: 500,
          body: errors
        });
      } else {
        return response.ok({
          body: validated !== null && validated !== void 0 ? validated : {}
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

exports.getPrepackagedRulesStatusRoute = getPrepackagedRulesStatusRoute;