"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readRulesRoute = void 0;

var _query_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/query_rules_type_dependents");

var _query_rules_schema = require("../../../../../common/detection_engine/schemas/request/query_rules_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _utils = require("./utils");

var _utils2 = require("../utils");

var _read_rules = require("../../rules/read_rules");

var _get_rule_actions_saved_object = require("../../rule_actions/get_rule_actions_saved_object");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readRulesRoute = router => {
  router.get({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_query_rules_schema.queryRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const validationErrors = (0, _query_rules_type_dependents.queryRuleValidateTypeDependents)(request.query);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    const {
      id,
      rule_id: ruleId
    } = request.query;
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
    const savedObjectsClient = context.core.savedObjects.client;

    try {
      if (!alertsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
      const rule = await (0, _read_rules.readRules)({
        alertsClient,
        id,
        ruleId
      });

      if (rule != null) {
        const ruleActions = await (0, _get_rule_actions_saved_object.getRuleActionsSavedObject)({
          savedObjectsClient,
          ruleAlertId: rule.id
        });
        const ruleStatuses = await ruleStatusClient.find({
          perPage: 1,
          sortField: 'statusDate',
          sortOrder: 'desc',
          search: rule.id,
          searchFields: ['alertId']
        });
        const [currentStatus] = ruleStatuses.saved_objects;

        if (currentStatus != null && rule.executionStatus.status === 'error') {
          var _rule$executionStatus, _rule$executionStatus2;

          currentStatus.attributes.lastFailureMessage = `Reason: ${(_rule$executionStatus = rule.executionStatus.error) === null || _rule$executionStatus === void 0 ? void 0 : _rule$executionStatus.reason} Message: ${(_rule$executionStatus2 = rule.executionStatus.error) === null || _rule$executionStatus2 === void 0 ? void 0 : _rule$executionStatus2.message}`;
          currentStatus.attributes.lastFailureAt = rule.executionStatus.lastExecutionDate.toISOString();
          currentStatus.attributes.statusDate = rule.executionStatus.lastExecutionDate.toISOString();
          currentStatus.attributes.status = 'failed';
        }

        const transformed = (0, _utils.transform)(rule, ruleActions, currentStatus);

        if (transformed == null) {
          return siemResponse.error({
            statusCode: 500,
            body: 'Internal error transforming'
          });
        } else {
          return response.ok({
            body: transformed !== null && transformed !== void 0 ? transformed : {}
          });
        }
      } else {
        const error = (0, _utils.getIdError)({
          id,
          ruleId
        });
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
        });
      }
    } catch (err) {
      const error = (0, _utils2.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.readRulesRoute = readRulesRoute;