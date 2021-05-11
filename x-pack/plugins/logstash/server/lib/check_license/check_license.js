"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkLicense = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const checkLicense = license => {
  if (!license.isAvailable) {
    return {
      valid: false,
      message: _i18n.i18n.translate('xpack.logstash.managementSection.notPossibleToManagePipelinesMessage', {
        defaultMessage: 'You cannot manage Logstash pipelines because license information is not available at this time.'
      })
    };
  }

  if (!license.hasAtLeast('standard')) {
    return {
      valid: false,
      message: _i18n.i18n.translate('xpack.logstash.managementSection.licenseDoesNotSupportDescription', {
        defaultMessage: 'Your {licenseType} license does not support Logstash pipeline management features. Please upgrade your license.',
        values: {
          licenseType: license.type
        }
      })
    };
  }

  if (!license.isActive) {
    return {
      valid: false,
      message: _i18n.i18n.translate('xpack.logstash.managementSection.pipelineCrudOperationsNotAllowedDescription', {
        defaultMessage: 'You cannot edit, create, or delete your Logstash pipelines because your {licenseType} license has expired.',
        values: {
          licenseType: license.type
        }
      })
    };
  }

  if (!license.getFeature('security').isEnabled) {
    return {
      valid: false,
      message: _i18n.i18n.translate('xpack.logstash.managementSection.enableSecurityDescription', {
        defaultMessage: 'Security must be enabled in order to use Logstash pipeline management features.' + ' Please set xpack.security.enabled: true in your elasticsearch.yml.'
      })
    };
  }

  return {
    valid: true,
    message: null
  };
};

exports.checkLicense = checkLicense;