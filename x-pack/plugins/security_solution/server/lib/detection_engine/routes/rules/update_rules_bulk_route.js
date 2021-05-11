"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateRulesBulkRoute = void 0;

var _validate = require("../../../../../common/validate");

var _update_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/update_rules_type_dependents");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _update_rules_bulk_schema = require("../../../../../common/detection_engine/schemas/request/update_rules_bulk_schema");

var _rules_bulk_schema = require("../../../../../common/detection_engine/schemas/response/rules_bulk_schema");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _utils = require("./utils");

var _validate2 = require("./validate");

var _utils2 = require("../utils");

var _update_rules = require("../../rules/update_rules");

var _update_rules_notifications = require("../../rules/update_rules_notifications");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateRulesBulkRoute = (router, ml) => {
  router.put({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_bulk_update`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_update_rules_bulk_schema.updateRulesBulkSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting, _context$securitySolu;

    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
    const savedObjectsClient = context.core.savedObjects.client;
    const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

    if (!siemClient || !alertsClient) {
      return siemResponse.error({
        statusCode: 404
      });
    }

    const mlAuthz = (0, _authz.buildMlAuthz)({
      license: context.licensing.license,
      ml,
      request,
      savedObjectsClient
    });
    const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
    const rules = await Promise.all(request.body.map(async payloadRule => {
      var _ref, _payloadRule$id;

      const idOrRuleIdOrUnknown = (_ref = (_payloadRule$id = payloadRule.id) !== null && _payloadRule$id !== void 0 ? _payloadRule$id : payloadRule.rule_id) !== null && _ref !== void 0 ? _ref : '(unknown id)';

      try {
        const validationErrors = (0, _update_rules_type_dependents.updateRuleValidateTypeDependents)(payloadRule);

        if (validationErrors.length) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 400,
            message: validationErrors.join()
          });
        }

        (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(payloadRule.type));
        const rule = await (0, _update_rules.updateRules)({
          alertsClient,
          savedObjectsClient,
          defaultOutputIndex: siemClient.getSignalsIndex(),
          ruleUpdate: payloadRule
        });

        if (rule != null) {
          var _payloadRule$enabled;

          const ruleActions = await (0, _update_rules_notifications.updateRulesNotifications)({
            ruleAlertId: rule.id,
            alertsClient,
            savedObjectsClient,
            enabled: (_payloadRule$enabled = payloadRule.enabled) !== null && _payloadRule$enabled !== void 0 ? _payloadRule$enabled : true,
            actions: payloadRule.actions,
            throttle: payloadRule.throttle,
            name: payloadRule.name
          });
          const ruleStatuses = await ruleStatusClient.find({
            perPage: 1,
            sortField: 'statusDate',
            sortOrder: 'desc',
            search: rule.id,
            searchFields: ['alertId']
          });
          return (0, _validate2.transformValidateBulkError)(rule.id, rule, ruleActions, ruleStatuses);
        } else {
          return (0, _utils.getIdBulkError)({
            id: payloadRule.id,
            ruleId: payloadRule.rule_id
          });
        }
      } catch (err) {
        return (0, _utils2.transformBulkError)(idOrRuleIdOrUnknown, err);
      }
    }));
    const [validated, errors] = (0, _validate.validate)(rules, _rules_bulk_schema.rulesBulkSchema);

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
  });
};

exports.updateRulesBulkRoute = updateRulesBulkRoute;