"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defineLogoutRoutes = defineLogoutRoutes;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Defines routes required for the Logout out view.
 */

function defineLogoutRoutes({
  httpResources
}) {
  httpResources.register({
    path: '/logout',
    validate: false,
    options: {
      authRequired: false
    }
  }, (context, request, response) => response.renderAnonymousCoreApp());
}