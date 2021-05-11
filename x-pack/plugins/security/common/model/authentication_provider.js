"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shouldProviderUseLoginForm = shouldProviderUseLoginForm;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Type and name tuple to identify provider used to authenticate user.
 */

/**
 * Checks whether authentication provider with the specified type uses Kibana's native login form.
 * @param providerType Type of the authentication provider.
 */

function shouldProviderUseLoginForm(providerType) {
  return providerType === 'basic' || providerType === 'token';
}