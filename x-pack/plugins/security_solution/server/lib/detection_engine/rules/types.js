"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isRuleStatusFindTypes = exports.isRuleStatusFindType = exports.isRuleStatusSavedObjectType = exports.isAlertType = exports.isAlertTypes = void 0;

var _fp = require("lodash/fp");

var _constants = require("../../../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isAlertTypes = partialAlert => {
  return partialAlert.every(rule => isAlertType(rule));
};

exports.isAlertTypes = isAlertTypes;

const isAlertType = partialAlert => {
  return partialAlert.alertTypeId === _constants.SIGNALS_ID;
};

exports.isAlertType = isAlertType;

const isRuleStatusSavedObjectType = obj => {
  return (0, _fp.get)('attributes', obj) != null;
};

exports.isRuleStatusSavedObjectType = isRuleStatusSavedObjectType;

const isRuleStatusFindType = obj => {
  return (0, _fp.get)('saved_objects', obj) != null;
};

exports.isRuleStatusFindType = isRuleStatusFindType;

const isRuleStatusFindTypes = obj => {
  return obj ? obj.every(ruleStatus => isRuleStatusFindType(ruleStatus)) : false;
};

exports.isRuleStatusFindTypes = isRuleStatusFindTypes;