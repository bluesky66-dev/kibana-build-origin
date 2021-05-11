"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUserChangePassword = canUserChangePassword;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const REALMS_ELIGIBLE_FOR_PASSWORD_CHANGE = ['reserved', 'native'];

function canUserChangePassword(user) {
  return REALMS_ELIGIBLE_FOR_PASSWORD_CHANGE.includes(user.authentication_realm.type) && user.authentication_provider.type !== 'anonymous';
}