"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateKibanaFeature = validateKibanaFeature;
exports.validateElasticsearchFeature = validateElasticsearchFeature;
exports.uiCapabilitiesRegex = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _lodash = require("lodash");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// Each feature gets its own property on the UICapabilities object,
// but that object has a few built-in properties which should not be overwritten.


const prohibitedFeatureIds = ['catalogue', 'management', 'navLinks'];
const featurePrivilegePartRegex = /^[a-zA-Z0-9_-]+$/;
const subFeaturePrivilegePartRegex = /^[a-zA-Z0-9_-]+$/;
const managementSectionIdRegex = /^[a-zA-Z0-9_-]+$/;
const reservedFeaturePrrivilegePartRegex = /^(?!reserved_)[a-zA-Z0-9_-]+$/;
const uiCapabilitiesRegex = /^[a-zA-Z0-9:_-]+$/;
exports.uiCapabilitiesRegex = uiCapabilitiesRegex;
const validLicenses = ['basic', 'standard', 'gold', 'platinum', 'enterprise', 'trial']; // sub-feature privileges are only available with a `gold` license or better, so restricting sub-feature privileges
// for `gold` or below doesn't make a whole lot of sense.

const validSubFeaturePrivilegeLicenses = ['platinum', 'enterprise', 'trial'];

const managementSchema = _joi.default.object().pattern(managementSectionIdRegex, _joi.default.array().items(_joi.default.string().regex(uiCapabilitiesRegex)));

const catalogueSchema = _joi.default.array().items(_joi.default.string().regex(uiCapabilitiesRegex));

const alertingSchema = _joi.default.array().items(_joi.default.string());

const appCategorySchema = _joi.default.object({
  id: _joi.default.string().required(),
  label: _joi.default.string().required(),
  ariaLabel: _joi.default.string(),
  euiIconType: _joi.default.string(),
  order: _joi.default.number()
}).required();

const kibanaPrivilegeSchema = _joi.default.object({
  excludeFromBasePrivileges: _joi.default.boolean(),
  management: managementSchema,
  catalogue: catalogueSchema,
  api: _joi.default.array().items(_joi.default.string()),
  app: _joi.default.array().items(_joi.default.string()),
  alerting: _joi.default.object({
    all: alertingSchema,
    read: alertingSchema
  }),
  savedObject: _joi.default.object({
    all: _joi.default.array().items(_joi.default.string()).required(),
    read: _joi.default.array().items(_joi.default.string()).required()
  }).required(),
  ui: _joi.default.array().items(_joi.default.string().regex(uiCapabilitiesRegex)).required()
});

const kibanaIndependentSubFeaturePrivilegeSchema = _joi.default.object({
  id: _joi.default.string().regex(subFeaturePrivilegePartRegex).required(),
  name: _joi.default.string().required(),
  includeIn: _joi.default.string().allow('all', 'read', 'none').required(),
  minimumLicense: _joi.default.string().valid(...validSubFeaturePrivilegeLicenses),
  management: managementSchema,
  catalogue: catalogueSchema,
  alerting: _joi.default.object({
    all: alertingSchema,
    read: alertingSchema
  }),
  api: _joi.default.array().items(_joi.default.string()),
  app: _joi.default.array().items(_joi.default.string()),
  savedObject: _joi.default.object({
    all: _joi.default.array().items(_joi.default.string()).required(),
    read: _joi.default.array().items(_joi.default.string()).required()
  }).required(),
  ui: _joi.default.array().items(_joi.default.string().regex(uiCapabilitiesRegex)).required()
});

const kibanaMutuallyExclusiveSubFeaturePrivilegeSchema = kibanaIndependentSubFeaturePrivilegeSchema.keys({
  minimumLicense: _joi.default.forbidden()
});

const kibanaSubFeatureSchema = _joi.default.object({
  name: _joi.default.string().required(),
  privilegeGroups: _joi.default.array().items(_joi.default.object({
    groupType: _joi.default.string().valid('mutually_exclusive', 'independent').required(),
    privileges: _joi.default.when('groupType', {
      is: 'mutually_exclusive',
      then: _joi.default.array().items(kibanaMutuallyExclusiveSubFeaturePrivilegeSchema).min(1),
      otherwise: _joi.default.array().items(kibanaIndependentSubFeaturePrivilegeSchema).min(1)
    })
  }))
});

const kibanaFeatureSchema = _joi.default.object({
  id: _joi.default.string().regex(featurePrivilegePartRegex).invalid(...prohibitedFeatureIds).required(),
  name: _joi.default.string().required(),
  category: appCategorySchema,
  order: _joi.default.number(),
  excludeFromBasePrivileges: _joi.default.boolean(),
  minimumLicense: _joi.default.string().valid(...validLicenses),
  app: _joi.default.array().items(_joi.default.string()).required(),
  management: managementSchema,
  catalogue: catalogueSchema,
  alerting: alertingSchema,
  privileges: _joi.default.object({
    all: kibanaPrivilegeSchema,
    read: kibanaPrivilegeSchema
  }).allow(null).required(),
  subFeatures: _joi.default.when('privileges', {
    is: null,
    then: _joi.default.array().items(kibanaSubFeatureSchema).max(0),
    otherwise: _joi.default.array().items(kibanaSubFeatureSchema)
  }),
  privilegesTooltip: _joi.default.string(),
  reserved: _joi.default.object({
    description: _joi.default.string().required(),
    privileges: _joi.default.array().items(_joi.default.object({
      id: _joi.default.string().regex(reservedFeaturePrrivilegePartRegex).required(),
      privilege: kibanaPrivilegeSchema.required()
    })).required()
  })
});

const elasticsearchPrivilegeSchema = _joi.default.object({
  ui: _joi.default.array().items(_joi.default.string()).required(),
  requiredClusterPrivileges: _joi.default.array().items(_joi.default.string()),
  requiredIndexPrivileges: _joi.default.object().pattern(_joi.default.string(), _joi.default.array().items(_joi.default.string())),
  requiredRoles: _joi.default.array().items(_joi.default.string())
});

const elasticsearchFeatureSchema = _joi.default.object({
  id: _joi.default.string().regex(featurePrivilegePartRegex).invalid(...prohibitedFeatureIds).required(),
  management: managementSchema,
  catalogue: catalogueSchema,
  privileges: _joi.default.array().items(elasticsearchPrivilegeSchema).required()
});

function validateKibanaFeature(feature) {
  var _feature$subFeatures;

  const validateResult = _joi.default.validate(feature, kibanaFeatureSchema);

  if (validateResult.error) {
    throw validateResult.error;
  } // the following validation can't be enforced by the Joi schema, since it'd require us looking "up" the object graph for the list of valid value, which they explicitly forbid.


  const {
    app = [],
    management = {},
    catalogue = [],
    alerting = []
  } = feature;
  const unseenApps = new Set(app);
  const managementSets = Object.entries(management).map(entry => [entry[0], new Set(entry[1])]);
  const unseenManagement = new Map(managementSets);
  const unseenCatalogue = new Set(catalogue);
  const unseenAlertTypes = new Set(alerting);

  function validateAppEntry(privilegeId, entry = []) {
    entry.forEach(privilegeApp => unseenApps.delete(privilegeApp));
    const unknownAppEntries = (0, _lodash.difference)(entry, app);

    if (unknownAppEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown app entries: ${unknownAppEntries.join(', ')}`);
    }
  }

  function validateCatalogueEntry(privilegeId, entry = []) {
    entry.forEach(privilegeCatalogue => unseenCatalogue.delete(privilegeCatalogue));
    const unknownCatalogueEntries = (0, _lodash.difference)(entry || [], catalogue);

    if (unknownCatalogueEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown catalogue entries: ${unknownCatalogueEntries.join(', ')}`);
    }
  }

  function validateAlertingEntry(privilegeId, entry) {
    var _entry$all, _entry$read;

    const all = (_entry$all = entry === null || entry === void 0 ? void 0 : entry.all) !== null && _entry$all !== void 0 ? _entry$all : [];
    const read = (_entry$read = entry === null || entry === void 0 ? void 0 : entry.read) !== null && _entry$read !== void 0 ? _entry$read : [];
    all.forEach(privilegeAlertTypes => unseenAlertTypes.delete(privilegeAlertTypes));
    read.forEach(privilegeAlertTypes => unseenAlertTypes.delete(privilegeAlertTypes));
    const unknownAlertingEntries = (0, _lodash.difference)([...all, ...read], alerting);

    if (unknownAlertingEntries.length > 0) {
      throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown alerting entries: ${unknownAlertingEntries.join(', ')}`);
    }
  }

  function validateManagementEntry(privilegeId, managementEntry = {}) {
    Object.entries(managementEntry).forEach(([managementSectionId, managementSectionEntry]) => {
      if (unseenManagement.has(managementSectionId)) {
        managementSectionEntry.forEach(entry => {
          var _unseenManagement$get;

          unseenManagement.get(managementSectionId).delete(entry);

          if (((_unseenManagement$get = unseenManagement.get(managementSectionId)) === null || _unseenManagement$get === void 0 ? void 0 : _unseenManagement$get.size) === 0) {
            unseenManagement.delete(managementSectionId);
          }
        });
      }

      if (!management[managementSectionId]) {
        throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown management section: ${managementSectionId}`);
      }

      const unknownSectionEntries = (0, _lodash.difference)(managementSectionEntry, management[managementSectionId]);

      if (unknownSectionEntries.length > 0) {
        throw new Error(`Feature privilege ${feature.id}.${privilegeId} has unknown management entries for section ${managementSectionId}: ${unknownSectionEntries.join(', ')}`);
      }
    });
  }

  const privilegeEntries = [];

  if (feature.privileges) {
    privilegeEntries.push(...Object.entries(feature.privileges));
  }

  if (feature.reserved) {
    feature.reserved.privileges.forEach(reservedPrivilege => {
      privilegeEntries.push([reservedPrivilege.id, reservedPrivilege.privilege]);
    });
  }

  if (privilegeEntries.length === 0) {
    return;
  }

  privilegeEntries.forEach(([privilegeId, privilegeDefinition]) => {
    if (!privilegeDefinition) {
      throw new Error('Privilege definition may not be null or undefined');
    }

    validateAppEntry(privilegeId, privilegeDefinition.app);
    validateCatalogueEntry(privilegeId, privilegeDefinition.catalogue);
    validateManagementEntry(privilegeId, privilegeDefinition.management);
    validateAlertingEntry(privilegeId, privilegeDefinition.alerting);
  });
  const subFeatureEntries = (_feature$subFeatures = feature.subFeatures) !== null && _feature$subFeatures !== void 0 ? _feature$subFeatures : [];
  subFeatureEntries.forEach(subFeature => {
    subFeature.privilegeGroups.forEach(subFeaturePrivilegeGroup => {
      subFeaturePrivilegeGroup.privileges.forEach(subFeaturePrivilege => {
        validateAppEntry(subFeaturePrivilege.id, subFeaturePrivilege.app);
        validateCatalogueEntry(subFeaturePrivilege.id, subFeaturePrivilege.catalogue);
        validateManagementEntry(subFeaturePrivilege.id, subFeaturePrivilege.management);
        validateAlertingEntry(subFeaturePrivilege.id, subFeaturePrivilege.alerting);
      });
    });
  });

  if (unseenApps.size > 0) {
    throw new Error(`Feature ${feature.id} specifies app entries which are not granted to any privileges: ${Array.from(unseenApps.values()).join(',')}`);
  }

  if (unseenCatalogue.size > 0) {
    throw new Error(`Feature ${feature.id} specifies catalogue entries which are not granted to any privileges: ${Array.from(unseenCatalogue.values()).join(',')}`);
  }

  if (unseenManagement.size > 0) {
    const ungrantedManagement = Array.from(unseenManagement.entries()).reduce((acc, entry) => {
      const values = Array.from(entry[1].values()).map(managementPage => `${entry[0]}.${managementPage}`);
      return [...acc, ...values];
    }, []);
    throw new Error(`Feature ${feature.id} specifies management entries which are not granted to any privileges: ${ungrantedManagement.join(',')}`);
  }

  if (unseenAlertTypes.size > 0) {
    throw new Error(`Feature ${feature.id} specifies alerting entries which are not granted to any privileges: ${Array.from(unseenAlertTypes.values()).join(',')}`);
  }
}

function validateElasticsearchFeature(feature) {
  const validateResult = _joi.default.validate(feature, elasticsearchFeatureSchema);

  if (validateResult.error) {
    throw validateResult.error;
  } // the following validation can't be enforced by the Joi schema without a very convoluted and verbose definition


  const {
    privileges
  } = feature;
  privileges.forEach((privilege, index) => {
    const {
      requiredClusterPrivileges = [],
      requiredIndexPrivileges = [],
      requiredRoles = []
    } = privilege;

    if (requiredClusterPrivileges.length === 0 && requiredIndexPrivileges.length === 0 && requiredRoles.length === 0) {
      throw new Error(`Feature ${feature.id} has a privilege definition at index ${index} without any privileges defined.`);
    }
  });
}