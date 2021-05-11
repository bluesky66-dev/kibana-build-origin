"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrivilegesWithRequestFactory = checkPrivilegesWithRequestFactory;

var _lodash = require("lodash");

var _constants = require("../../common/constants");

var _resource_serializer = require("./resource_serializer");

var _validate_es_response = require("./validate_es_response");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function checkPrivilegesWithRequestFactory(actions, getClusterClient, applicationName) {
  const hasIncompatibleVersion = applicationPrivilegesResponse => {
    return Object.values(applicationPrivilegesResponse).some(resource => !resource[actions.version] && resource[actions.login]);
  };

  return function checkPrivilegesWithRequest(request) {
    const checkPrivilegesAtResources = async (resources, privileges) => {
      var _privileges$elasticse, _privileges$elasticse2, _privileges$elasticse3, _hasPrivilegesRespons, _hasPrivilegesRespons2;

      const kibanaPrivileges = Array.isArray(privileges.kibana) ? privileges.kibana : privileges.kibana ? [privileges.kibana] : [];
      const allApplicationPrivileges = (0, _lodash.uniq)([actions.version, actions.login, ...kibanaPrivileges]);
      const clusterClient = await getClusterClient();
      const {
        body: hasPrivilegesResponse
      } = await clusterClient.asScoped(request).asCurrentUser.security.hasPrivileges({
        body: {
          cluster: (_privileges$elasticse = privileges.elasticsearch) === null || _privileges$elasticse === void 0 ? void 0 : _privileges$elasticse.cluster,
          index: Object.entries((_privileges$elasticse2 = (_privileges$elasticse3 = privileges.elasticsearch) === null || _privileges$elasticse3 === void 0 ? void 0 : _privileges$elasticse3.index) !== null && _privileges$elasticse2 !== void 0 ? _privileges$elasticse2 : {}).map(([names, indexPrivileges]) => ({
            names,
            privileges: indexPrivileges
          })),
          applications: [{
            application: applicationName,
            resources,
            privileges: allApplicationPrivileges
          }]
        }
      });
      (0, _validate_es_response.validateEsPrivilegeResponse)(hasPrivilegesResponse, applicationName, allApplicationPrivileges, resources);
      const applicationPrivilegesResponse = hasPrivilegesResponse.application[applicationName];
      const clusterPrivilegesResponse = (_hasPrivilegesRespons = hasPrivilegesResponse.cluster) !== null && _hasPrivilegesRespons !== void 0 ? _hasPrivilegesRespons : {};
      const clusterPrivileges = Object.entries(clusterPrivilegesResponse).map(([privilege, authorized]) => ({
        privilege,
        authorized
      }));
      const indexPrivileges = Object.entries((_hasPrivilegesRespons2 = hasPrivilegesResponse.index) !== null && _hasPrivilegesRespons2 !== void 0 ? _hasPrivilegesRespons2 : {}).reduce((acc, [index, indexResponse]) => {
        return { ...acc,
          [index]: Object.entries(indexResponse).map(([privilege, authorized]) => ({
            privilege,
            authorized
          }))
        };
      }, {});

      if (hasIncompatibleVersion(applicationPrivilegesResponse)) {
        throw new Error('Multiple versions of Kibana are running against the same Elasticsearch cluster, unable to authorize user.');
      } // we need to filter out the non requested privileges from the response


      const resourcePrivileges = (0, _lodash.transform)(applicationPrivilegesResponse, (result, value, key) => {
        var _privileges$kibana;

        result[key] = (0, _lodash.pick)(value, (_privileges$kibana = privileges.kibana) !== null && _privileges$kibana !== void 0 ? _privileges$kibana : []);
      });
      const privilegeArray = Object.entries(resourcePrivileges).map(([key, val]) => {
        // we need to turn the resource responses back into the space ids
        const resource = key !== _constants.GLOBAL_RESOURCE ? _resource_serializer.ResourceSerializer.deserializeSpaceResource(key) : undefined;
        return Object.entries(val).map(([privilege, authorized]) => ({
          resource,
          privilege,
          authorized
        }));
      }).flat();
      return {
        hasAllRequested: hasPrivilegesResponse.has_all_requested,
        username: hasPrivilegesResponse.username,
        privileges: {
          kibana: privilegeArray,
          elasticsearch: {
            cluster: clusterPrivileges,
            index: indexPrivileges
          }
        }
      };
    };

    return {
      async atSpace(spaceId, privileges) {
        const spaceResource = _resource_serializer.ResourceSerializer.serializeSpaceResource(spaceId);

        return await checkPrivilegesAtResources([spaceResource], privileges);
      },

      async atSpaces(spaceIds, privileges) {
        const spaceResources = spaceIds.map(spaceId => _resource_serializer.ResourceSerializer.serializeSpaceResource(spaceId));
        return await checkPrivilegesAtResources(spaceResources, privileges);
      },

      async globally(privileges) {
        return await checkPrivilegesAtResources([_constants.GLOBAL_RESOURCE], privileges);
      }

    };
  };
}