"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRuleActionsFromSavedObject = exports.getThrottleOptions = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getThrottleOptions = (throttle = 'no_actions') => ({
  ruleThrottle: throttle !== null && throttle !== void 0 ? throttle : 'no_actions',
  alertThrottle: ['no_actions', 'rule'].includes(throttle !== null && throttle !== void 0 ? throttle : 'no_actions') ? null : throttle
});

exports.getThrottleOptions = getThrottleOptions;

const getRuleActionsFromSavedObject = savedObject => ({
  id: savedObject.id,
  actions: savedObject.attributes.actions || [],
  alertThrottle: savedObject.attributes.alertThrottle || null,
  ruleThrottle: savedObject.attributes.ruleThrottle || 'no_actions'
});

exports.getRuleActionsFromSavedObject = getRuleActionsFromSavedObject;