"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineAccountManagementRoutes = defineAccountManagementRoutes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for the Account Management view.
 */

function defineAccountManagementRoutes({
  httpResources
}) {
  httpResources.register({
    path: '/security/account',
    validate: false
  }, (context, req, res) => res.renderCoreApp());
}