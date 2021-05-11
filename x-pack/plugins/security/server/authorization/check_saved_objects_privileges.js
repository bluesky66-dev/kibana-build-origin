"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSavedObjectsPrivilegesWithRequestFactory = void 0;

var _constants = require("../../common/constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function uniq(arr) {
  return Array.from(new Set(arr));
}

const checkSavedObjectsPrivilegesWithRequestFactory = (checkPrivilegesWithRequest, getSpacesService) => {
  return function checkSavedObjectsPrivilegesWithRequest(request) {
    return async function checkSavedObjectsPrivileges(actions, namespaceOrNamespaces) {
      const spacesService = getSpacesService();
      const privileges = {
        kibana: actions
      };

      if (spacesService) {
        if (Array.isArray(namespaceOrNamespaces)) {
          // Spaces enabled, authorizing against multiple spaces
          if (!namespaceOrNamespaces.length) {
            throw new Error(`Can't check saved object privileges for 0 namespaces`);
          }

          const spaceIds = uniq(namespaceOrNamespaces.map(x => spacesService.namespaceToSpaceId(x)));

          if (!spaceIds.includes(_constants.ALL_SPACES_ID)) {
            return await checkPrivilegesWithRequest(request).atSpaces(spaceIds, privileges);
          }
        } else {
          // Spaces enabled, authorizing against a single space
          const spaceId = spacesService.namespaceToSpaceId(namespaceOrNamespaces);

          if (spaceId !== _constants.ALL_SPACES_ID) {
            return await checkPrivilegesWithRequest(request).atSpace(spaceId, privileges);
          }
        }
      } // Spaces plugin is disabled OR we are checking privileges for "all spaces", authorizing globally


      return await checkPrivilegesWithRequest(request).globally(privileges);
    };
  };
};

exports.checkSavedObjectsPrivilegesWithRequestFactory = checkSavedObjectsPrivilegesWithRequestFactory;