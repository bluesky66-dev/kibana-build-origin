"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRulesBulkRoute = void 0;

var _validate = require("../../../../../common/validate");

var _create_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/create_rules_type_dependents");

var _create_rules_bulk_schema = require("../../../../../common/detection_engine/schemas/request/create_rules_bulk_schema");

var _rules_bulk_schema = require("../../../../../common/detection_engine/schemas/response/rules_bulk_schema");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _read_rules = require("../../rules/read_rules");

var _utils = require("./utils");

var _validate2 = require("./validate");

var _get_index_exists = require("../../index/get_index_exists");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _utils2 = require("../utils");

var _update_rules_notifications = require("../../rules/update_rules_notifications");

var _rule_converters = require("../../schemas/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRulesBulkRoute = (router, ml) => {
  router.post({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_bulk_create`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_create_rules_bulk_schema.createRulesBulkSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting, _context$securitySolu;

    const siemResponse = (0, _utils2.buildSiemResponse)(response);
    const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
    const clusterClient = context.core.elasticsearch.legacy.client;
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
    const ruleDefinitions = request.body;
    const dupes = (0, _utils.getDuplicates)(ruleDefinitions, 'rule_id');
    const rules = await Promise.all(ruleDefinitions.filter(rule => rule.rule_id == null || !dupes.includes(rule.rule_id)).map(async payloadRule => {
      if (payloadRule.rule_id != null) {
        const rule = await (0, _read_rules.readRules)({
          alertsClient,
          ruleId: payloadRule.rule_id,
          id: undefined
        });

        if (rule != null) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: payloadRule.rule_id,
            statusCode: 409,
            message: `rule_id: "${payloadRule.rule_id}" already exists`
          });
        }
      }

      const internalRule = (0, _rule_converters.convertCreateAPIToInternalSchema)(payloadRule, siemClient);

      try {
        var _payloadRule$throttle;

        const validationErrors = (0, _create_rules_type_dependents.createRuleValidateTypeDependents)(payloadRule);

        if (validationErrors.length) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: internalRule.params.ruleId,
            statusCode: 400,
            message: validationErrors.join()
          });
        }

        (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(internalRule.params.type));
        const finalIndex = internalRule.params.outputIndex;
        const indexExists = await (0, _get_index_exists.getIndexExists)(clusterClient.callAsCurrentUser, finalIndex);

        if (!indexExists) {
          return (0, _utils2.createBulkErrorObject)({
            ruleId: internalRule.params.ruleId,
            statusCode: 400,
            message: `To create a rule, the index must exist first. Index ${finalIndex} does not exist`
          });
        }
        /**
         * TODO: Remove this use of `as` by utilizing the proper type
         */


        const createdRule = await alertsClient.create({
          data: internalRule
        });
        const ruleActions = await (0, _update_rules_notifications.updateRulesNotifications)({
          ruleAlertId: createdRule.id,
          alertsClient,
          savedObjectsClient,
          enabled: createdRule.enabled,
          actions: payloadRule.actions,
          throttle: (_payloadRule$throttle = payloadRule.throttle) !== null && _payloadRule$throttle !== void 0 ? _payloadRule$throttle : null,
          name: createdRule.name
        });
        return (0, _validate2.transformValidateBulkError)(internalRule.params.ruleId, createdRule, ruleActions);
      } catch (err) {
        return (0, _utils2.transformBulkError)(internalRule.params.ruleId, err);
      }
    }));
    const rulesBulk = [...rules, ...dupes.map(ruleId => (0, _utils2.createBulkErrorObject)({
      ruleId,
      statusCode: 409,
      message: `rule_id: "${ruleId}" already exists`
    }))];
    const [validated, errors] = (0, _validate.validate)(rulesBulk, _rules_bulk_schema.rulesBulkSchema);

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

exports.createRulesBulkRoute = createRulesBulkRoute;