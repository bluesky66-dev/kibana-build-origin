"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityFeatureUsageService = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

class SecurityFeatureUsageService {
  setup({
    featureUsage
  }) {
    featureUsage.register('Subfeature privileges', 'gold');
    featureUsage.register('Pre-access agreement', 'gold');
    featureUsage.register('Audit logging', 'gold');
  }

  start({
    featureUsage
  }) {
    return {
      recordPreAccessAgreementUsage() {
        featureUsage.notifyUsage('Pre-access agreement');
      },

      recordSubFeaturePrivilegeUsage() {
        featureUsage.notifyUsage('Subfeature privileges');
      },

      recordAuditLoggingUsage() {
        featureUsage.notifyUsage('Audit logging');
      }

    };
  }

}

exports.SecurityFeatureUsageService = SecurityFeatureUsageService;