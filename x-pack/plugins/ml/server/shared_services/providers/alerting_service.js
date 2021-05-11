"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAlertingServiceProvider = getAlertingServiceProvider;

var _alerting_service = require("../../lib/alerts/alerting_service");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getAlertingServiceProvider(getGuards) {
  return {
    alertingServiceProvider(savedObjectsClient, request) {
      return {
        preview: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            mlClient,
            scopedClient
          }) => (0, _alerting_service.alertingServiceProvider)(mlClient, scopedClient.asInternalUser).preview(...args));
        },
        execute: async (...args) => {
          return await getGuards(request, savedObjectsClient).isFullLicense().hasMlCapabilities(['canGetJobs']).ok(({
            mlClient,
            scopedClient
          }) => (0, _alerting_service.alertingServiceProvider)(mlClient, scopedClient.asInternalUser).execute(...args));
        }
      };
    }

  };
}