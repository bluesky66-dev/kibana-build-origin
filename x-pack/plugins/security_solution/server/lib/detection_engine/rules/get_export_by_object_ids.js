"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRulesFromObjects = exports.getExportByObjectIds = void 0;

var _get_export_details_ndjson = require("./get_export_details_ndjson");

var _types = require("../rules/types");

var _read_rules = require("./read_rules");

var _utils = require("../routes/rules/utils");

var _create_stream_from_ndjson = require("../../../utils/read_stream/create_stream_from_ndjson");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExportByObjectIds = async (alertsClient, objects) => {
  const rulesAndErrors = await getRulesFromObjects(alertsClient, objects);
  const rulesNdjson = (0, _create_stream_from_ndjson.transformDataToNdjson)(rulesAndErrors.rules);
  const exportDetails = (0, _get_export_details_ndjson.getExportDetailsNdjson)(rulesAndErrors.rules, rulesAndErrors.missingRules);
  return {
    rulesNdjson,
    exportDetails
  };
};

exports.getExportByObjectIds = getExportByObjectIds;

const getRulesFromObjects = async (alertsClient, objects) => {
  const alertsAndErrors = await Promise.all(objects.reduce((accumPromise, object) => {
    const exportWorkerPromise = new Promise(async resolve => {
      try {
        const rule = await (0, _read_rules.readRules)({
          alertsClient,
          ruleId: object.rule_id,
          id: undefined
        });

        if (rule != null && (0, _types.isAlertType)(rule) && rule.params.immutable !== true) {
          const transformedRule = (0, _utils.transformAlertToRule)(rule);
          resolve({
            statusCode: 200,
            rule: transformedRule
          });
        } else {
          resolve({
            statusCode: 404,
            missingRuleId: {
              rule_id: object.rule_id
            }
          });
        }
      } catch {
        resolve({
          statusCode: 404,
          missingRuleId: {
            rule_id: object.rule_id
          }
        });
      }
    });
    return [...accumPromise, exportWorkerPromise];
  }, []));
  const missingRules = alertsAndErrors.filter(resp => resp.statusCode === 404);
  const exportedRules = alertsAndErrors.filter(resp => resp.statusCode === 200);
  return {
    exportedCount: exportedRules.length,
    missingRules: missingRules.map(mr => mr.missingRuleId),
    rules: exportedRules.map(er => er.rule)
  };
};

exports.getRulesFromObjects = getRulesFromObjects;