"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findRulesRoute = void 0;

var _find_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/find_rules_type_dependents");

var _find_rules_schema = require("../../../../../common/detection_engine/schemas/request/find_rules_schema");

var _constants = require("../../../../../common/constants");

var _find_rules = require("../../rules/find_rules");

var _utils = require("../utils");

var _get_rule_actions_saved_object = require("../../rule_actions/get_rule_actions_saved_object");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findRulesRoute = router => {
  router.get({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_find`,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_find_rules_schema.findRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _find_rules_type_dependents.findRuleValidateTypeDependents)(request.query);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    try {
      var _context$alerting;

      const {
        query
      } = request;
      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const savedObjectsClient = context.core.savedObjects.client;

      if (!alertsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
      const rules = await (0, _find_rules.findRules)({
        alertsClient,
        perPage: query.per_page,
        page: query.page,
        sortField: query.sort_field,
        sortOrder: query.sort_order,
        filter: query.filter,
        fields: query.fields
      }); // if any rules attempted to execute but failed before the rule executor is called,
      // an execution status will be written directly onto the rule via the kibana alerting framework,
      // which we are filtering on and will write a failure status
      // for any rules found to be in a failing state into our rule status saved objects

      const failingRules = rules.data.filter(rule => rule.executionStatus != null && rule.executionStatus.status === 'error');
      const ruleStatuses = await Promise.all(rules.data.map(async rule => {
        const results = await ruleStatusClient.find({
          perPage: 1,
          sortField: 'statusDate',
          sortOrder: 'desc',
          search: rule.id,
          searchFields: ['alertId']
        });
        const failingRule = failingRules.find(badRule => badRule.id === rule.id);

        if (failingRule != null) {
          if (results.saved_objects.length > 0) {
            results.saved_objects[0].attributes.status = 'failed';
            results.saved_objects[0].attributes.lastFailureAt = failingRule.executionStatus.lastExecutionDate.toISOString();
          }
        }

        return results;
      }));
      const ruleActions = await Promise.all(rules.data.map(async rule => {
        const results = await (0, _get_rule_actions_saved_object.getRuleActionsSavedObject)({
          savedObjectsClient,
          ruleAlertId: rule.id
        });
        return results;
      }));
      const transformed = (0, _utils2.transformFindAlerts)(rules, ruleActions, ruleStatuses);

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
    } catch (err) {
      const error = (0, _utils.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.findRulesRoute = findRulesRoute;