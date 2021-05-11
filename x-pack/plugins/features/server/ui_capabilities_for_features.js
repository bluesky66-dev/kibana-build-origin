"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uiCapabilitiesForFeatures = uiCapabilitiesForFeatures;

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


const ELIGIBLE_FLAT_MERGE_KEYS = ['catalogue'];
const ELIGIBLE_DEEP_MERGE_KEYS = ['management'];

function uiCapabilitiesForFeatures(kibanaFeatures, elasticsearchFeatures) {
  const kibanaFeatureCapabilities = kibanaFeatures.map(getCapabilitiesFromFeature);
  const elasticsearchFeatureCapabilities = elasticsearchFeatures.map(getCapabilitiesFromFeature);
  return buildCapabilities(...kibanaFeatureCapabilities, ...elasticsearchFeatureCapabilities);
}

function getCapabilitiesFromFeature(feature) {
  var _feature$privileges;

  const UIFeatureCapabilities = {
    catalogue: {},
    [feature.id]: {}
  };

  if (feature.catalogue) {
    UIFeatureCapabilities.catalogue = { ...UIFeatureCapabilities.catalogue,
      ...feature.catalogue.reduce((acc, capability) => ({ ...acc,
        [capability]: true
      }), {})
    };
  }

  if (feature.management) {
    const sectionEntries = Object.entries(feature.management);
    UIFeatureCapabilities.management = sectionEntries.reduce((acc, [sectionId, sectionItems]) => {
      return { ...acc,
        [sectionId]: sectionItems.reduce((acc2, item) => {
          return { ...acc2,
            [item]: true
          };
        }, {})
      };
    }, {});
  }

  const featurePrivileges = Object.values((_feature$privileges = feature.privileges) !== null && _feature$privileges !== void 0 ? _feature$privileges : {});

  if (isKibanaFeature(feature)) {
    var _feature$reserved;

    if (feature.subFeatures) {
      featurePrivileges.push(...feature.subFeatures.map(sf => sf.privilegeGroups.map(pg => pg.privileges)).flat(2));
    }

    if ((_feature$reserved = feature.reserved) !== null && _feature$reserved !== void 0 && _feature$reserved.privileges) {
      featurePrivileges.push(...feature.reserved.privileges.map(rp => rp.privilege));
    }
  }

  featurePrivileges.forEach(privilege => {
    UIFeatureCapabilities[feature.id] = { ...UIFeatureCapabilities[feature.id],
      ...privilege.ui.reduce((privilegeAcc, capability) => ({ ...privilegeAcc,
        [capability]: true
      }), {})
    };
  });
  return UIFeatureCapabilities;
}

function isKibanaFeature(feature) {
  // Elasticsearch features define privileges as an array,
  // whereas Kibana features define privileges as an object,
  // or they define reserved privileges, or they don't define either.
  // Elasticsearch features are required to defined privileges.
  return feature.reserved != null || feature.privileges && !Array.isArray(feature.privileges) || feature.privileges === null;
}

function buildCapabilities(...allFeatureCapabilities) {
  return allFeatureCapabilities.reduce((acc, capabilities) => {
    const mergableCapabilities = _lodash.default.omit(capabilities, ...ELIGIBLE_FLAT_MERGE_KEYS);

    const mergedFeatureCapabilities = { ...mergableCapabilities,
      ...acc
    };
    ELIGIBLE_FLAT_MERGE_KEYS.forEach(key => {
      mergedFeatureCapabilities[key] = { ...mergedFeatureCapabilities[key],
        ...capabilities[key]
      };
    });
    ELIGIBLE_DEEP_MERGE_KEYS.forEach(key => {
      mergedFeatureCapabilities[key] = _lodash.default.merge({}, mergedFeatureCapabilities[key], capabilities[key]);
    });
    return mergedFeatureCapabilities;
  }, {});
}