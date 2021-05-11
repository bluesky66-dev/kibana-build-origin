"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExportDetailsNdjson = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getExportDetailsNdjson = (rules, missingRules = []) => {
  const stringified = JSON.stringify({
    exported_count: rules.length,
    missing_rules: missingRules,
    missing_rules_count: missingRules.length
  });
  return `${stringified}\n`;
};

exports.getExportDetailsNdjson = getExportDetailsNdjson;