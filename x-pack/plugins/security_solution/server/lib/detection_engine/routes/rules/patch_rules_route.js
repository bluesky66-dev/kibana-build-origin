"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRulesRoute = void 0;

var _patch_rules_type_dependents = require("../../../../../common/detection_engine/schemas/request/patch_rules_type_dependents");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _patch_rules_schema = require("../../../../../common/detection_engine/schemas/request/patch_rules_schema");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _patch_rules = require("../../rules/patch_rules");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _validate = require("./validate");

var _update_rules_notifications = require("../../rules/update_rules_notifications");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");

var _read_rules = require("../../rules/read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const patchRulesRoute = (router, ml) => {
  router.patch({
    path: _constants.DETECTION_ENGINE_RULES_URL,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_patch_rules_schema.patchRulesSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _utils.buildSiemResponse)(response);
    const validationErrors = (0, _patch_rules_type_dependents.patchRuleValidateTypeDependents)(request.body);

    if (validationErrors.length) {
      return siemResponse.error({
        statusCode: 400,
        body: validationErrors
      });
    }

    const {
      actions: actionsRest,
      author,
      building_block_type: buildingBlockType,
      description,
      enabled,
      event_category_override: eventCategoryOverride,
      false_positives: falsePositives,
      from,
      query,
      language,
      license,
      output_index: outputIndex,
      saved_id: savedId,
      timeline_id: timelineId,
      timeline_title: timelineTitle,
      meta,
      filters: filtersRest,
      rule_id: ruleId,
      id,
      index,
      interval,
      max_signals: maxSignals,
      risk_score: riskScore,
      risk_score_mapping: riskScoreMapping,
      rule_name_override: ruleNameOverride,
      name,
      severity,
      severity_mapping: severityMapping,
      tags,
      to,
      type,
      threat,
      threshold,
      threat_filters: threatFilters,
      threat_index: threatIndex,
      threat_query: threatQuery,
      threat_mapping: threatMapping,
      threat_language: threatLanguage,
      concurrent_searches: concurrentSearches,
      items_per_search: itemsPerSearch,
      timestamp_override: timestampOverride,
      throttle,
      references,
      note,
      version,
      anomaly_threshold: anomalyThreshold,
      machine_learning_job_id: machineLearningJobId,
      exceptions_list: exceptionsList
    } = request.body;

    try {
      var _context$alerting; // TODO: Fix these either with an is conversion or by better typing them within io-ts


      const actions = actionsRest;
      const filters = filtersRest;
      const alertsClient = (_context$alerting = context.alerting) === null || _context$alerting === void 0 ? void 0 : _context$alerting.getAlertsClient();
      const savedObjectsClient = context.core.savedObjects.client;

      if (!alertsClient) {
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

      if (type) {
        // reject an unauthorized "promotion" to ML
        (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(type));
      }

      const existingRule = await (0, _read_rules.readRules)({
        alertsClient,
        ruleId,
        id
      });

      if (existingRule !== null && existingRule !== void 0 && existingRule.params.type) {
        // reject an unauthorized modification of an ML rule
        (0, _validation.throwHttpError)(await mlAuthz.validateRuleType(existingRule === null || existingRule === void 0 ? void 0 : existingRule.params.type));
      }

      const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
      const rule = await (0, _patch_rules.patchRules)({
        alertsClient,
        author,
        buildingBlockType,
        description,
        enabled,
        eventCategoryOverride,
        falsePositives,
        from,
        query,
        language,
        license,
        outputIndex,
        savedId,
        savedObjectsClient,
        timelineId,
        timelineTitle,
        meta,
        filters,
        rule: existingRule,
        index,
        interval,
        maxSignals,
        riskScore,
        riskScoreMapping,
        ruleNameOverride,
        name,
        severity,
        severityMapping,
        tags,
        to,
        type,
        threat,
        threshold,
        threatFilters,
        threatIndex,
        threatQuery,
        threatMapping,
        threatLanguage,
        concurrentSearches,
        itemsPerSearch,
        timestampOverride,
        references,
        note,
        version,
        anomalyThreshold,
        machineLearningJobId,
        actions,
        exceptionsList
      });

      if (rule != null && rule.enabled != null && rule.name != null) {
        const ruleActions = await (0, _update_rules_notifications.updateRulesNotifications)({
          ruleAlertId: rule.id,
          alertsClient,
          savedObjectsClient,
          enabled: rule.enabled,
          actions,
          throttle,
          name: rule.name
        });
        const ruleStatuses = await ruleStatusClient.find({
          perPage: 1,
          sortField: 'statusDate',
          sortOrder: 'desc',
          search: rule.id,
          searchFields: ['alertId']
        });
        const [validated, errors] = (0, _validate.transformValidate)(rule, ruleActions, ruleStatuses.saved_objects[0]);

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
        const error = (0, _utils2.getIdError)({
          id,
          ruleId
        });
        return siemResponse.error({
          body: error.message,
          statusCode: error.statusCode
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

exports.patchRulesRoute = patchRulesRoute;