"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRulesRoute = void 0;

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _read_rules = require("../../rules/read_rules");

var _get_index_exists = require("../../index/get_index_exists");

var _utils = require("../utils");

var _update_rules_notifications = require("../../rules/update_rules_notifications");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");

var _request = require("../../../../../common/detection_engine/schemas/request");

var _validate = require("./validate");

var _create_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/create_rules_type_dependents");

var _rule_converters = require("../../schemas/rule_converters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createRulesRoute = (router, ml) => {
  router.post({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_request.createRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _create_rules_type_dependents.createRuleValidateTypeDependents)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    try {
      var _context$alerting, _context$securitySolu, _context$lists, _request$body$throttl;

      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const clusterClient = context.core.elasticsearch.legacy.client;
      const savedObjectsClient = context.core.savedObjects.client;
      const siemClient = (_context$securitySolu = context.securitySolution) === null || _context$securitySolu === void 0 ? void 0 : _context$securitySolu.getAppClient();

      if (!siemClient || !alertsClient) {
        return siemResponse.error({
          statusCode: 404
        });
      }

      if (request.body.rule_id != null) {
        const rule = await (0, _read_rules.readRules)({
          alertsClient,
          ruleId: request.body.rule_id,
          id: undefined
        });

        if (rule != null) {
          return siemResponse.error({
            statusCode: 409,
            body: `rule_id: "${request.body.rule_id}" already exists`
          });
        }
      }

      const internalRule = (0, _rule_converters.convertCreateAPIToInternalSchema)(request.body, siemClient);
      const mlAuthz = (0, _authz.buildMlAuthz)({
        license: context.licensing.license,
        ml,
        request,
        savedObjectsClient
      });
      (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(internalRule.params.type));
      const indexExists = await (0, _get_index_exists.getIndexExists)(clusterClient.callAsCurrentUser, internalRule.params.outputIndex);

      if (!indexExists) {
        return siemResponse.error({
          statusCode: 400,
          body: `To create a rule, the index must exist first. Index ${internalRule.params.outputIndex} does not exist`
        });
      } // This will create the endpoint list if it does not exist yet


      await ((_context$lists = context.lists) === null || _context$lists === void 0 ? void 0 : _context$lists.getExceptionListClient().createEndpointList());
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
        actions: request.body.actions,
        throttle: (_request$body$throttl = request.body.throttle) !== null && _request$body$throttl !== void 0 ? _request$body$throttl : null,
        name: createdRule.name
      });
      const ruleStatuses = await (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient).find({
        perPage: 1,
        sortField: 'statusDate',
        sortOrder: 'desc',
        search: `${createdRule.id}`,
        searchFields: ['alertId']
      });
      const [validated, errors] = (0, _validate.newTransformValidate)(createdRule, ruleActions, ruleStatuses.saved_objects[0]);

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

exports.createRulesRoute = createRulesRoute;