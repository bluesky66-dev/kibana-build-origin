"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRulesRoute = void 0;

var _query_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/query_rules_type_dependents");

var _query_rules_schema = require("../../../../../common/detection_engine/schemas/request/query_rules_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _delete_rules = require("../../rules/delete_rules");

var _utils = require("./utils");

var _validate = require("./validate");

var _utils2 = require("../utils");

var _delete_notifications = require("../../notifications/delete_notifications");

var _delete_rule_actions_saved_object = require("../../rule_actions/delete_rule_actions_saved_object");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteRulesRoute = router => {
  router.delete({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      query: (0, _route_validation.buildRouteValidation)(_query_rules_schema.queryRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const validationErrors = (0, _query_rules_type_dependents.queryRuleValidateTypeDependents)(request.query);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    try {
      var _context$alerting;

      const {
        id,
        rule_id: ruleId
      } = request.query;
      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const savedObjectsClient = context.core.savedObjects.client;

      if (!alertsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
      const rule = await (0, _delete_rules.deleteRules)({
        alertsClient,
        id,
        ruleId
      });

      if (rule != null) {
        await (0, _delete_notifications.deleteNotifications)({
          alertsClient,
          ruleAlertId: rule.id
        });
        await (0, _delete_rule_actions_saved_object.deleteRuleActionsSavedObject)({
          ruleAlertId: rule.id,
          savedObjectsClient
        });
        const ruleStatuses = await ruleStatusClient.find({
          perPage: 6,
          search: rule.id,
          searchFields: ['alertId']
        });
        ruleStatuses.saved_objects.forEach(async obj => ruleStatusClient.delete(obj.id));
        const [validated, errors] = (0, _validate.transformValidate)(rule, undefined, ruleStatuses.saved_objects[0]);

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

exports.deleteRulesRoute = deleteRulesRoute;