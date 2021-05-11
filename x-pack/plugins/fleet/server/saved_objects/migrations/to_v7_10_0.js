"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.migrateInstallationToV7100 = exports.migrateAgentActionToV7100 = exports.migrateSettingsToV7100 = exports.migratePackagePolicyToV7100 = exports.migrateEnrollmentApiKeysToV7100 = exports.migrateAgentPolicyToV7100 = exports.migrateAgentEventToV7100 = exports.migrateAgentToV7100 = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const migrateAgentToV7100 = agentDoc => {
  agentDoc.attributes.policy_id = agentDoc.attributes.config_id;
  delete agentDoc.attributes.config_id;
  agentDoc.attributes.policy_revision = agentDoc.attributes.config_revision;
  delete agentDoc.attributes.config_revision;
  return agentDoc;
};

exports.migrateAgentToV7100 = migrateAgentToV7100;

const migrateAgentEventToV7100 = agentEventDoc => {
  agentEventDoc.attributes.policy_id = agentEventDoc.attributes.config_id;
  delete agentEventDoc.attributes.config_id;
  return agentEventDoc;
};

exports.migrateAgentEventToV7100 = migrateAgentEventToV7100;

const migrateAgentPolicyToV7100 = agentPolicyDoc => {
  agentPolicyDoc.attributes.package_policies = agentPolicyDoc.attributes.package_configs; // @ts-expect-error

  delete agentPolicyDoc.attributes.package_configs;
  return agentPolicyDoc;
};

exports.migrateAgentPolicyToV7100 = migrateAgentPolicyToV7100;

const migrateEnrollmentApiKeysToV7100 = enrollmentApiKeyDoc => {
  enrollmentApiKeyDoc.attributes.policy_id = enrollmentApiKeyDoc.attributes.config_id;
  delete enrollmentApiKeyDoc.attributes.config_id;
  return enrollmentApiKeyDoc;
};

exports.migrateEnrollmentApiKeysToV7100 = migrateEnrollmentApiKeysToV7100;

const migratePackagePolicyToV7100 = packagePolicyDoc => {
  packagePolicyDoc.attributes.policy_id = packagePolicyDoc.attributes.config_id; // @ts-expect-error

  delete packagePolicyDoc.attributes.config_id;
  return packagePolicyDoc;
};

exports.migratePackagePolicyToV7100 = migratePackagePolicyToV7100;

const migrateSettingsToV7100 = settingsDoc => {
  settingsDoc.attributes.kibana_urls = [settingsDoc.attributes.kibana_url]; // @ts-expect-error

  delete settingsDoc.attributes.kibana_url;
  return settingsDoc;
};

exports.migrateSettingsToV7100 = migrateSettingsToV7100;

const migrateAgentActionToV7100 = encryptedSavedObjects => {
  return encryptedSavedObjects.createMigration(agentActionDoc => {
    // @ts-expect-error
    return agentActionDoc.attributes.type === 'CONFIG_CHANGE';
  }, agentActionDoc => {
    let agentActionData;

    try {
      agentActionData = agentActionDoc.attributes.data ? JSON.parse(agentActionDoc.attributes.data) : undefined;
    } catch (e) {// Silently swallow JSON parsing error
    }

    if (agentActionData && agentActionData.config) {
      const {
        attributes: {
          data,
          ...restOfAttributes
        }
      } = agentActionDoc;
      const {
        config,
        ...restOfData
      } = agentActionData;
      return { ...agentActionDoc,
        attributes: { ...restOfAttributes,
          type: 'POLICY_CHANGE',
          data: JSON.stringify({ ...restOfData,
            policy: config
          })
        }
      };
    } else {
      return agentActionDoc;
    }
  });
};

exports.migrateAgentActionToV7100 = migrateAgentActionToV7100;

const migrateInstallationToV7100 = installationDoc => {
  installationDoc.attributes.install_source = 'registry';
  return installationDoc;
};

exports.migrateInstallationToV7100 = migrateInstallationToV7100;