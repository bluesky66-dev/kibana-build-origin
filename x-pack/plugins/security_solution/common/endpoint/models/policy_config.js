"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DefaultMalwareMessage = exports.policyFactoryWithoutPaidFeatures = exports.policyFactory = void 0;

var _types = require("../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Return a new default `PolicyConfig` for platinum and above licenses
 */


const policyFactory = () => {
  return {
    windows: {
      events: {
        dll_and_driver_load: true,
        dns: true,
        file: true,
        network: true,
        process: true,
        registry: true,
        security: true
      },
      malware: {
        mode: _types.ProtectionModes.prevent
      },
      ransomware: {
        mode: _types.ProtectionModes.prevent
      },
      popup: {
        malware: {
          message: '',
          enabled: true
        },
        ransomware: {
          message: '',
          enabled: true
        }
      },
      logging: {
        file: 'info'
      },
      antivirus_registration: {
        enabled: false
      }
    },
    mac: {
      events: {
        process: true,
        file: true,
        network: true
      },
      malware: {
        mode: _types.ProtectionModes.prevent
      },
      popup: {
        malware: {
          message: '',
          enabled: true
        }
      },
      logging: {
        file: 'info'
      }
    },
    linux: {
      events: {
        process: true,
        file: true,
        network: true
      },
      logging: {
        file: 'info'
      }
    }
  };
};
/**
 * Strips paid features from an existing or new `PolicyConfig` for gold and below license
 */


exports.policyFactory = policyFactory;

const policyFactoryWithoutPaidFeatures = (policy = policyFactory()) => {
  return { ...policy,
    windows: { ...policy.windows,
      ransomware: {
        mode: _types.ProtectionModes.off
      },
      popup: { ...policy.windows.popup,
        malware: {
          message: '',
          enabled: true
        },
        ransomware: {
          message: '',
          enabled: false
        }
      }
    },
    mac: { ...policy.mac,
      popup: { ...policy.mac.popup,
        malware: {
          message: '',
          enabled: true
        }
      }
    }
  };
};
/**
 * Reflects what string the Endpoint will use when message field is default/empty
 */


exports.policyFactoryWithoutPaidFeatures = policyFactoryWithoutPaidFeatures;
const DefaultMalwareMessage = 'Elastic Security {action} {filename}';
exports.DefaultMalwareMessage = DefaultMalwareMessage;