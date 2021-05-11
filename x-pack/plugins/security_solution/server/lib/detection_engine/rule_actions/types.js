"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "RuleAlertAction", {
  enumerable: true,
  get: function () {
    return _types.RuleAlertAction;
  }
});
exports.isRuleActionsFindTypes = exports.isRuleActionsFindType = exports.isRuleActionsSavedObjectType = void 0;

var _fp = require("lodash/fp");

var _types = require("../../../../common/detection_engine/types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isRuleActionsSavedObjectType = obj => {
  return (0, _fp.get)('attributes', obj) != null;
};

exports.isRuleActionsSavedObjectType = isRuleActionsSavedObjectType;

const isRuleActionsFindType = obj => {
  return (0, _fp.get)('saved_objects', obj) != null;
};

exports.isRuleActionsFindType = isRuleActionsFindType;

const isRuleActionsFindTypes = obj => {
  return obj ? obj.every(ruleStatus => isRuleActionsFindType(ruleStatus)) : false;
};

exports.isRuleActionsFindTypes = isRuleActionsFindTypes;