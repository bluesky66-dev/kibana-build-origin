"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportAll = void 0;

var _get_existing_prepackaged_rules = require("./get_existing_prepackaged_rules");

var _get_export_details_ndjson = require("./get_export_details_ndjson");

var _utils = require("../routes/rules/utils");

var _create_stream_from_ndjson = require("../../../utils/read_stream/create_stream_from_ndjson");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExportAll = async alertsClient => {
  const ruleAlertTypes = await (0, _get_existing_prepackaged_rules.getNonPackagedRules)({
    alertsClient
  });
  const rules = (0, _utils.transformAlertsToRules)(ruleAlertTypes);
  const rulesNdjson = (0, _create_stream_from_ndjson.transformDataToNdjson)(rules);
  const exportDetails = (0, _get_export_details_ndjson.getExportDetailsNdjson)(rules);
  return {
    rulesNdjson,
    exportDetails
  };
};

exports.getExportAll = getExportAll;