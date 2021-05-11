"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPrepackagedRules = exports.validateAllPrepackagedRules = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _format_errors = require("../../../../common/format_errors");

var _exact_check = require("../../../../common/exact_check");

var _add_prepackaged_rules_schema = require("../../../../common/detection_engine/schemas/request/add_prepackaged_rules_schema");

var _bad_request_error = require("../errors/bad_request_error");

var _prepackaged_rules = require("./prepackaged_rules");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// TODO: convert rules files to TS and add explicit type definitions

/**
 * Validate the rules from the file system and throw any errors indicating to the developer
 * that they are adding incorrect schema rules. Also this will auto-flush in all the default
 * aspects such as default interval of 5 minutes, default arrays, etc...
 */


const validateAllPrepackagedRules = rules => {
  return rules.map(rule => {
    const decoded = _add_prepackaged_rules_schema.addPrepackagedRulesSchema.decode(rule);

    const checked = (0, _exact_check.exactCheck)(rule, decoded);

    const onLeft = errors => {
      const ruleName = rule.name ? rule.name : '(rule name unknown)';
      const ruleId = rule.rule_id ? rule.rule_id : '(rule rule_id unknown)';
      throw new _bad_request_error.BadRequestError(`name: "${ruleName}", rule_id: "${ruleId}" within the folder rules/prepackaged_rules ` + `is not a valid detection engine rule. Expect the system ` + `to not work with pre-packaged rules until this rule is fixed ` + `or the file is removed. Error is: ${(0, _format_errors.formatErrors)(errors).join()}, Full rule contents are:\n${JSON.stringify(rule, null, 2)}`);
    };

    const onRight = schema => {
      return schema;
    };

    return (0, _pipeable.pipe)(checked, (0, _Either.fold)(onLeft, onRight));
  });
};

exports.validateAllPrepackagedRules = validateAllPrepackagedRules;

const getPrepackagedRules = ( // @ts-expect-error mock data is too loosely typed
rules = _prepackaged_rules.rawRules) => validateAllPrepackagedRules(rules);

exports.getPrepackagedRules = getPrepackagedRules;