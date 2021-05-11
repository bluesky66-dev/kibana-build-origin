"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.disableUICapabilitiesFactory = disableUICapabilitiesFactory;

var _lodash = require("lodash");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function disableUICapabilitiesFactory(request, features, elasticsearchFeatures, logger, authz, user) {
  // nav links are sourced from the apps property.
  // The Kibana Platform associates nav links to the app which registers it, in a 1:1 relationship.
  const featureNavLinkIds = features.flatMap(feature => feature.app).filter(navLinkId => navLinkId != null);
  const elasticsearchFeatureMap = elasticsearchFeatures.reduce((acc, esFeature) => {
    return { ...acc,
      [esFeature.id]: esFeature.privileges
    };
  }, {});
  const allRequiredClusterPrivileges = Array.from(new Set(Object.values(elasticsearchFeatureMap).flat().map(p => p.requiredClusterPrivileges).flat()));
  const allRequiredIndexPrivileges = Object.values(elasticsearchFeatureMap).flat().filter(p => !!p.requiredIndexPrivileges).reduce((acc, p) => {
    return { ...acc,
      ...Object.entries(p.requiredIndexPrivileges).reduce((acc2, [indexName, privileges]) => {
        var _acc$indexName;

        return { ...acc2,
          [indexName]: [...((_acc$indexName = acc[indexName]) !== null && _acc$indexName !== void 0 ? _acc$indexName : []), ...privileges]
        };
      }, {})
    };
  }, {});

  const shouldDisableFeatureUICapability = (featureId, uiCapability) => {
    // if the navLink isn't for a feature that we have registered, we don't wish to
    // disable it based on privileges
    return featureId !== 'navLinks' || featureNavLinkIds.includes(uiCapability);
  };

  const disableAll = uiCapabilities => {
    return (0, _lodash.mapValues)(uiCapabilities, (featureUICapabilities, featureId) => (0, _lodash.mapValues)(featureUICapabilities, (value, uiCapability) => {
      if (typeof value === 'boolean') {
        if (shouldDisableFeatureUICapability(featureId, uiCapability)) {
          return false;
        }

        return value;
      }

      if ((0, _lodash.isObject)(value)) {
        return (0, _lodash.mapValues)(value, () => false);
      }

      throw new Error(`Expected value type of boolean or object, but found ${value}`);
    }));
  };

  const usingPrivileges = async uiCapabilities => {
    function getActionsForFeatureCapability(featureId, uiCapability, value) {
      // Capabilities derived from Elasticsearch features should not be
      // included here, as the result is used to check authorization against
      // Kibana Privileges, rather than Elasticsearch Privileges.
      if (elasticsearchFeatureMap.hasOwnProperty(featureId)) {
        return [];
      }

      if (typeof value === 'boolean') {
        return [authz.actions.ui.get(featureId, uiCapability)];
      }

      if ((0, _lodash.isObject)(value)) {
        return Object.keys(value).map(item => authz.actions.ui.get(featureId, uiCapability, item));
      }

      throw new Error(`Expected value type of boolean or object, but found ${value}`);
    }

    const uiActions = Object.entries(uiCapabilities).reduce((acc, [featureId, featureUICapabilities]) => [...acc, ...(0, _lodash.flatten)(Object.entries(featureUICapabilities).map(([uiCapability, value]) => {
      return getActionsForFeatureCapability(featureId, uiCapability, value);
    }))], []);
    let checkPrivilegesResponse;

    try {
      const checkPrivilegesDynamically = authz.checkPrivilegesDynamicallyWithRequest(request);
      checkPrivilegesResponse = await checkPrivilegesDynamically({
        kibana: uiActions,
        elasticsearch: {
          cluster: allRequiredClusterPrivileges,
          index: allRequiredIndexPrivileges
        }
      });
    } catch (err) {
      // if we get a 401/403, then we want to disable all uiCapabilities, as this
      // is generally when the user hasn't authenticated yet and we're displaying the
      // login screen, which isn't driven any uiCapabilities
      if (err.statusCode === 401 || err.statusCode === 403) {
        logger.debug(`Disabling all uiCapabilities because we received a ${err.statusCode}: ${err.message}`);
        return disableAll(uiCapabilities);
      }

      throw err;
    }

    const checkPrivilegesForCapability = (enabled, featureId, ...uiCapabilityParts) => {
      // if the uiCapability has already been disabled, we don't want to re-enable it
      if (!enabled) {
        return false;
      }

      const action = authz.actions.ui.get(featureId, ...uiCapabilityParts);
      const isElasticsearchFeature = elasticsearchFeatureMap.hasOwnProperty(featureId);
      const isCatalogueFeature = featureId === 'catalogue';
      const isManagementFeature = featureId === 'management';

      if (!isElasticsearchFeature) {
        const hasRequiredKibanaPrivileges = checkPrivilegesResponse.privileges.kibana.some(x => x.privilege === action && x.authorized === true); // Catalogue and management capbility buckets can also be influenced by ES privileges,
        // so the early return is not possible for these.

        if (!isCatalogueFeature && !isManagementFeature || hasRequiredKibanaPrivileges) {
          return hasRequiredKibanaPrivileges;
        }
      }

      return elasticsearchFeatures.some(esFeature => {
        if (isCatalogueFeature) {
          var _esFeature$catalogue;

          const [catalogueEntry] = uiCapabilityParts;
          const featureGrantsCatalogueEntry = ((_esFeature$catalogue = esFeature.catalogue) !== null && _esFeature$catalogue !== void 0 ? _esFeature$catalogue : []).includes(catalogueEntry);
          return featureGrantsCatalogueEntry && hasAnyRequiredElasticsearchPrivilegesForFeature(esFeature, checkPrivilegesResponse, user);
        } else if (isManagementFeature) {
          var _esFeature$management;

          const [managementSectionId, managementEntryId] = uiCapabilityParts;
          const featureGrantsManagementEntry = ((_esFeature$management = esFeature.management) !== null && _esFeature$management !== void 0 ? _esFeature$management : {}).hasOwnProperty(managementSectionId) && esFeature.management[managementSectionId].includes(managementEntryId);
          return featureGrantsManagementEntry && hasAnyRequiredElasticsearchPrivilegesForFeature(esFeature, checkPrivilegesResponse, user);
        } else if (esFeature.id === featureId) {
          if (uiCapabilityParts.length !== 1) {
            // The current privilege system does not allow for this to happen.
            // This is a safeguard against future changes.
            throw new Error(`Elasticsearch feature ${esFeature.id} expected a single capability, but found ${uiCapabilityParts.length}`);
          }

          return hasRequiredElasticsearchPrivilegesForCapability(esFeature, uiCapabilityParts[0], checkPrivilegesResponse, user);
        }
      });
    };

    return (0, _lodash.mapValues)(uiCapabilities, (featureUICapabilities, featureId) => {
      return (0, _lodash.mapValues)(featureUICapabilities, (value, uiCapability) => {
        if (typeof value === 'boolean') {
          if (!shouldDisableFeatureUICapability(featureId, uiCapability)) {
            return value;
          }

          return checkPrivilegesForCapability(value, featureId, uiCapability);
        }

        if ((0, _lodash.isObject)(value)) {
          const res = (0, _lodash.mapValues)(value, (enabled, subUiCapability) => {
            return checkPrivilegesForCapability(enabled, featureId, uiCapability, subUiCapability);
          });
          return res;
        }

        throw new Error(`Unexpected UI Capability value. Expected boolean or object, but found ${value}`);
      });
    });
  };

  return {
    all: disableAll,
    usingPrivileges
  };
}

function hasRequiredElasticsearchPrivilegesForCapability(esFeature, uiCapability, checkPrivilegesResponse, user) {
  return esFeature.privileges.some(privilege => {
    const privilegeGrantsCapability = privilege.ui.includes(uiCapability);

    if (!privilegeGrantsCapability) {
      return false;
    }

    return isGrantedElasticsearchPrivilege(privilege, checkPrivilegesResponse, user);
  });
}

function hasAnyRequiredElasticsearchPrivilegesForFeature(esFeature, checkPrivilegesResponse, user) {
  return esFeature.privileges.some(privilege => {
    return isGrantedElasticsearchPrivilege(privilege, checkPrivilegesResponse, user);
  });
}

function isGrantedElasticsearchPrivilege(privilege, checkPrivilegesResponse, user) {
  var _privilege$requiredIn, _privilege$requiredRo;

  const hasRequiredClusterPrivileges = privilege.requiredClusterPrivileges.every(expectedClusterPriv => checkPrivilegesResponse.privileges.elasticsearch.cluster.some(x => x.privilege === expectedClusterPriv && x.authorized === true));
  const hasRequiredIndexPrivileges = Object.entries((_privilege$requiredIn = privilege.requiredIndexPrivileges) !== null && _privilege$requiredIn !== void 0 ? _privilege$requiredIn : {}).every(([indexName, requiredIndexPrivileges]) => {
    return checkPrivilegesResponse.privileges.elasticsearch.index[indexName].filter(indexResponse => requiredIndexPrivileges.includes(indexResponse.privilege)).every(indexResponse => indexResponse.authorized);
  });
  const hasRequiredRoles = ((_privilege$requiredRo = privilege.requiredRoles) !== null && _privilege$requiredRo !== void 0 ? _privilege$requiredRo : []).every(requiredRole => {
    var _user$roles$includes;

    return (_user$roles$includes = user === null || user === void 0 ? void 0 : user.roles.includes(requiredRole)) !== null && _user$roles$includes !== void 0 ? _user$roles$includes : false;
  });
  return hasRequiredClusterPrivileges && hasRequiredIndexPrivileges && hasRequiredRoles;
}