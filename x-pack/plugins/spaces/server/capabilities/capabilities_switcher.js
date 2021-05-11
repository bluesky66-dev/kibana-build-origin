"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCapabilitiesSwitcher = setupCapabilitiesSwitcher;

var _lodash = _interopRequireDefault(require("lodash"));

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


function setupCapabilitiesSwitcher(core, getSpacesService, logger) {
  return async (request, capabilities, useDefaultCapabilities) => {
    const isAuthRequiredOrOptional = !request.route.options.authRequired;
    const shouldNotToggleCapabilities = isAuthRequiredOrOptional || useDefaultCapabilities;

    if (shouldNotToggleCapabilities) {
      return capabilities;
    }

    try {
      const [activeSpace, [, {
        features
      }]] = await Promise.all([getSpacesService().getActiveSpace(request), core.getStartServices()]);
      const registeredFeatures = features.getKibanaFeatures(); // try to retrieve capabilities for authenticated or "maybe authenticated" users

      return toggleCapabilities(registeredFeatures, capabilities, activeSpace);
    } catch (e) {
      logger.debug(`Error toggling capabilities for request to ${request.url.pathname}: ${e}`);
      return capabilities;
    }
  };
}

function toggleCapabilities(features, capabilities, activeSpace) {
  const clonedCapabilities = _lodash.default.cloneDeep(capabilities);

  toggleDisabledFeatures(features, clonedCapabilities, activeSpace);
  return clonedCapabilities;
}

function toggleDisabledFeatures(features, capabilities, activeSpace) {
  const disabledFeatureKeys = activeSpace.disabledFeatures;
  const [enabledFeatures, disabledFeatures] = features.reduce((acc, feature) => {
    if (disabledFeatureKeys.includes(feature.id)) {
      return [acc[0], [...acc[1], feature]];
    }

    return [[...acc[0], feature], acc[1]];
  }, [[], []]);
  const navLinks = capabilities.navLinks;
  const catalogueEntries = capabilities.catalogue;
  const managementItems = capabilities.management;
  const enabledAppEntries = new Set(enabledFeatures.flatMap(ef => {
    var _ef$app;

    return (_ef$app = ef.app) !== null && _ef$app !== void 0 ? _ef$app : [];
  }));
  const enabledCatalogueEntries = new Set(enabledFeatures.flatMap(ef => {
    var _ef$catalogue;

    return (_ef$catalogue = ef.catalogue) !== null && _ef$catalogue !== void 0 ? _ef$catalogue : [];
  }));
  const enabledManagementEntries = enabledFeatures.reduce((acc, feature) => {
    var _feature$management;

    const sections = Object.entries((_feature$management = feature.management) !== null && _feature$management !== void 0 ? _feature$management : {});
    sections.forEach(section => {
      if (!acc.has(section[0])) {
        acc.set(section[0], []);
      }

      acc.get(section[0]).push(...section[1]);
    });
    return acc;
  }, new Map());

  for (const feature of disabledFeatures) {
    // Disable associated navLink, if one exists
    feature.app.forEach(app => {
      if (navLinks.hasOwnProperty(app) && !enabledAppEntries.has(app)) {
        navLinks[app] = false;
      }
    }); // Disable associated catalogue entries

    const privilegeCatalogueEntries = feature.catalogue || [];
    privilegeCatalogueEntries.forEach(catalogueEntryId => {
      if (!enabledCatalogueEntries.has(catalogueEntryId)) {
        catalogueEntries[catalogueEntryId] = false;
      }
    }); // Disable associated management items

    const privilegeManagementSections = feature.management || {};
    Object.entries(privilegeManagementSections).forEach(([sectionId, sectionItems]) => {
      sectionItems.forEach(item => {
        const enabledManagementEntriesSection = enabledManagementEntries.get(sectionId);

        if (managementItems.hasOwnProperty(sectionId) && managementItems[sectionId].hasOwnProperty(item)) {
          const isEnabledElsewhere = (enabledManagementEntriesSection !== null && enabledManagementEntriesSection !== void 0 ? enabledManagementEntriesSection : []).includes(item);

          if (!isEnabledElsewhere) {
            managementItems[sectionId][item] = false;
          }
        }
      });
    }); // Disable "sub features" that match the disabled feature

    if (capabilities.hasOwnProperty(feature.id)) {
      const capability = capabilities[feature.id];
      Object.keys(capability).forEach(featureKey => {
        capability[featureKey] = false;
      });
    }
  }
}