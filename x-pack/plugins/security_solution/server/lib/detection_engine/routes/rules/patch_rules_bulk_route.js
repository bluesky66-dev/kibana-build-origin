"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.patchRulesBulkRoute = void 0;

var _validate = require("../../../../../common/validate");

var _patch_rules_bulk_schema = require("../../../../../common/detection_engine/schemas/request/patch_rules_bulk_schema");

var _route_validation = require("../../../../utils/build_validation/route_validation");

var _rules_bulk_schema = require("../../../../../common/detection_engine/schemas/response/rules_bulk_schema");

var _constants = require("../../../../../common/constants");

var _authz = require("../../../machine_learning/authz");

var _validation = require("../../../machine_learning/validation");

var _utils = require("../utils");

var _utils2 = require("./utils");

var _validate2 = require("./validate");

var _patch_rules = require("../../rules/patch_rules");

var _update_rules_notifications = require("../../rules/update_rules_notifications");

var _rule_status_saved_objects_client = require("../../signals/rule_status_saved_objects_client");

var _read_rules = require("../../rules/read_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const patchRulesBulkRoute = (router, ml) => {
  router.patch({
    path: `${_constants.DETECTION_ENGINE_RULES_URL}/_bulk_update`,
    validate: {
      body: (0, _route_validation.buildRouteValidation)(_patch_rules_bulk_schema.patchRulesBulkSchema)
    },
    options: {
      tags: ['access:securitySolution']
    }
  }, async (context, request, response) => {
    var _context$alerting;

    const siemResponse = (0, _utils.buildSiemResponse)(response);
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
    const ruleStatusClient = (0, _rule_status_saved_objects_client.ruleStatusSavedObjectsClientFactory)(savedObjectsClient);
    const rules = await Promise.all(request.body.map(async payloadRule => {
      var _ref;

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
      } = payloadRule;
      const idOrRuleIdOrUnknown = (_ref = id !== null && id !== void 0 ? id : ruleId) !== null && _ref !== void 0 ? _ref : '(unknown id)'; // TODO: Fix these either with an is conversion or by better typing them within io-ts

      const actions = actionsRest;
      const filters = filtersRest;

      try {
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

        const rule = await (0, _patch_rules.patchRules)({
          rule: existingRule,
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
          return (0, _validate2.transformValidateBulkError)(rule.id, rule, ruleActions, ruleStatuses);
        } else {
          return (0, _utils2.getIdBulkError)({
            id,
            ruleId
          });
        }
      } catch (err) {
        return (0, _utils.transformBulkError)(idOrRuleIdOrUnknown, err);
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

exports.patchRulesBulkRoute = patchRulesBulkRoute;