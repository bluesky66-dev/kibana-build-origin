"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformElasticsearchRoleToRole = transformElasticsearchRoleToRole;

var _constants = require("../../../../../common/constants");

var _privilege_serializer = require("../../../../authorization/privilege_serializer");

var _resource_serializer = require("../../../../authorization/resource_serializer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function transformElasticsearchRoleToRole(elasticsearchRole, name, application) {
  const kibanaTransformResult = transformRoleApplicationsToKibanaPrivileges(elasticsearchRole.applications, application);
  return {
    name,
    metadata: elasticsearchRole.metadata,
    transient_metadata: elasticsearchRole.transient_metadata,
    elasticsearch: {
      cluster: elasticsearchRole.cluster,
      indices: elasticsearchRole.indices,
      run_as: elasticsearchRole.run_as
    },
    kibana: kibanaTransformResult.success ? kibanaTransformResult.value : [],
    _transform_error: [...(kibanaTransformResult.success ? [] : ['kibana'])],
    _unrecognized_applications: extractUnrecognizedApplicationNames(elasticsearchRole.applications, application)
  };
}

function transformRoleApplicationsToKibanaPrivileges(roleApplications, application) {
  const roleKibanaApplications = roleApplications.filter(roleApplication => roleApplication.application === application || roleApplication.application === _constants.RESERVED_PRIVILEGES_APPLICATION_WILDCARD); // if any application entry contains an empty resource, we throw an error

  if (roleKibanaApplications.some(entry => entry.resources.length === 0)) {
    throw new Error(`ES returned an application entry without resources, can't process this`);
  } // if there is an entry with the reserved privileges application wildcard
  // and there are privileges which aren't reserved, we won't transform these


  if (roleKibanaApplications.some(entry => entry.application === _constants.RESERVED_PRIVILEGES_APPLICATION_WILDCARD && !entry.privileges.every(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedReservedPrivilege(privilege)))) {
    return {
      success: false
    };
  } // if space privilege assigned globally, we can't transform these


  if (roleKibanaApplications.some(entry => entry.resources.includes(_constants.GLOBAL_RESOURCE) && entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedSpaceBasePrivilege(privilege)))) {
    return {
      success: false
    };
  } // if global base or reserved privilege assigned at a space, we can't transform these


  if (roleKibanaApplications.some(entry => !entry.resources.includes(_constants.GLOBAL_RESOURCE) && entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedGlobalBasePrivilege(privilege) || _privilege_serializer.PrivilegeSerializer.isSerializedReservedPrivilege(privilege)))) {
    return {
      success: false
    };
  } // if reserved privilege assigned with feature or base privileges, we won't transform these


  if (roleKibanaApplications.some(entry => entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedReservedPrivilege(privilege)) && entry.privileges.some(privilege => !_privilege_serializer.PrivilegeSerializer.isSerializedReservedPrivilege(privilege)))) {
    return {
      success: false
    };
  } // if base privilege assigned with feature privileges, we won't transform these


  if (roleKibanaApplications.some(entry => entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedFeaturePrivilege(privilege)) && (entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedGlobalBasePrivilege(privilege)) || entry.privileges.some(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedSpaceBasePrivilege(privilege))))) {
    return {
      success: false
    };
  } // if any application entry contains the '*' resource in addition to another resource, we can't transform these


  if (roleKibanaApplications.some(entry => entry.resources.includes(_constants.GLOBAL_RESOURCE) && entry.resources.length > 1)) {
    return {
      success: false
    };
  }

  const allResources = roleKibanaApplications.map(entry => entry.resources).flat(); // if we have improperly formatted resource entries, we can't transform these

  if (allResources.some(resource => resource !== _constants.GLOBAL_RESOURCE && !_resource_serializer.ResourceSerializer.isSerializedSpaceResource(resource))) {
    return {
      success: false
    };
  } // if we have resources duplicated in entries, we won't transform these


  if (allResources.length !== getUniqueList(allResources).length) {
    return {
      success: false
    };
  }

  return {
    success: true,
    value: roleKibanaApplications.map(({
      resources,
      privileges
    }) => {
      // if we're dealing with a global entry, which we've ensured above is only possible if it's the only item in the array
      if (resources.length === 1 && resources[0] === _constants.GLOBAL_RESOURCE) {
        const reservedPrivileges = privileges.filter(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedReservedPrivilege(privilege));
        const basePrivileges = privileges.filter(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedGlobalBasePrivilege(privilege));
        const featurePrivileges = privileges.filter(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedFeaturePrivilege(privilege));
        return { ...(reservedPrivileges.length ? {
            _reserved: reservedPrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.deserializeReservedPrivilege(privilege))
          } : {}),
          base: basePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.serializeGlobalBasePrivilege(privilege)),
          feature: featurePrivileges.reduce((acc, privilege) => {
            const featurePrivilege = _privilege_serializer.PrivilegeSerializer.deserializeFeaturePrivilege(privilege);

            return { ...acc,
              [featurePrivilege.featureId]: getUniqueList([...(acc[featurePrivilege.featureId] || []), featurePrivilege.privilege])
            };
          }, {}),
          spaces: ['*']
        };
      }

      const basePrivileges = privileges.filter(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedSpaceBasePrivilege(privilege));
      const featurePrivileges = privileges.filter(privilege => _privilege_serializer.PrivilegeSerializer.isSerializedFeaturePrivilege(privilege));
      return {
        base: basePrivileges.map(privilege => _privilege_serializer.PrivilegeSerializer.deserializeSpaceBasePrivilege(privilege)),
        feature: featurePrivileges.reduce((acc, privilege) => {
          const featurePrivilege = _privilege_serializer.PrivilegeSerializer.deserializeFeaturePrivilege(privilege);

          return { ...acc,
            [featurePrivilege.featureId]: getUniqueList([...(acc[featurePrivilege.featureId] || []), featurePrivilege.privilege])
          };
        }, {}),
        spaces: resources.map(resource => _resource_serializer.ResourceSerializer.deserializeSpaceResource(resource))
      };
    })
  };
}

const extractUnrecognizedApplicationNames = (roleApplications, application) => {
  return getUniqueList(roleApplications.filter(roleApplication => roleApplication.application !== application && roleApplication.application !== _constants.RESERVED_PRIVILEGES_APPLICATION_WILDCARD).map(roleApplication => roleApplication.application));
};

function getUniqueList(list) {
  return Array.from(new Set(list));
}