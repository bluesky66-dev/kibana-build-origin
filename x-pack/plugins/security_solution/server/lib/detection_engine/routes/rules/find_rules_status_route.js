"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRulesStatusesRoute = void 0;

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _utils = require("../utils");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");

var _find_rule_statuses_schema = require("../../../../../common/detection_engine/schemas/request/find_rule_statuses_schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Given a list of rule ids, return the current status and
 * last five errors for each associated rule.
 *
 * @param router
 * @returns RuleStatusResponse
 */


const findRulesStatusesRoute = router => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_find_statuses`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_find_rule_statuses_schema.findRulesStatusesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const {
      body
    } = request;
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
    const savedObjectsClient = context.core.savedObjects.client;

    if (!alertsClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    const ids = body.ids;

    try {
      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
      const failingRules = await (0, _utils.getFailingRules)(ids, alertsClient);
      const statuses = await ids.reduce(async (acc, id) => {
        const accumulated = await acc;
        const lastFiveErrorsForId = await ruleStatusClient.find({
          perPage: 6,
          sortField: 'statusDate',
          sortOrder: 'desc',
          search: id,
          searchFields: ['alertId']
        });

        if (lastFiveErrorsForId.saved_objects.length === 0) {
          return accumulated;
        }

        const failingRule = failingRules[id];
        const lastFailureAt = lastFiveErrorsForId.saved_objects[0].attributes.lastFailureAt;

        if (failingRule != null && (lastFailureAt == null || new Date(failingRule.executionStatus.lastExecutionDate) > new Date(lastFailureAt))) {
          var _failingRule$executio, _failingRule$executio2;

          const currentStatus = lastFiveErrorsForId.saved_objects[0];
          currentStatus.attributes.lastFailureMessage = `Reason: ${(_failingRule$executio = failingRule.executionStatus.error) === null || _failingRule$executio === void 0 ? void 0 : _failingRule$executio.reason} Message: ${(_failingRule$executio2 = failingRule.executionStatus.error) === null || _failingRule$executio2 === void 0 ? void 0 : _failingRule$executio2.message}`;
          currentStatus.attributes.lastFailureAt = failingRule.executionStatus.lastExecutionDate.toISOString();
          currentStatus.attributes.statusDate = failingRule.executionStatus.lastExecutionDate.toISOString();
          currentStatus.attributes.status = 'failed';
          const updatedLastFiveErrorsSO = [currentStatus, ...lastFiveErrorsForId.saved_objects.slice(1)];
          return (0, _utils.mergeStatuses)(id, updatedLastFiveErrorsSO, accumulated);
        }

        return (0, _utils.mergeStatuses)(id, [...lastFiveErrorsForId.saved_objects], accumulated);
      }, Promise.resolve({}));
      return response.ok({
        body: statuses
      });
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.findRulesStatusesRoute = findRulesStatusesRoute;