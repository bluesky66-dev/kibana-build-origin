"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serializePrivileges = void 0;

var _privilege_serializer = require("./privilege_serializer");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const serializePrivileges = (application, privilegeMap) => {
  return {
    [application]: { ...Object.entries(privilegeMap.global).reduce((acc, [privilegeName, privilegeActions]) => {
        const name = _privilege_serializer.PrivilegeSerializer.serializeGlobalBasePrivilege(privilegeName);

        acc[name] = {
          application,
          name: privilegeName,
          actions: privilegeActions,
          metadata: {}
        };
        return acc;
      }, {}),
      ...Object.entries(privilegeMap.space).reduce((acc, [privilegeName, privilegeActions]) => {
        const name = _privilege_serializer.PrivilegeSerializer.serializeSpaceBasePrivilege(privilegeName);

        acc[name] = {
          application,
          name,
          actions: privilegeActions,
          metadata: {}
        };
        return acc;
      }, {}),
      ...Object.entries(privilegeMap.features).reduce((acc, [featureName, featurePrivileges]) => {
        Object.entries(featurePrivileges).forEach(([privilegeName, privilegeActions]) => {
          const name = _privilege_serializer.PrivilegeSerializer.serializeFeaturePrivilege(featureName, privilegeName);

          if (Object.keys(acc).includes(name)) {
            throw new Error(`Detected duplicate feature privilege name: ${name}`);
          }

          acc[name] = {
            application,
            name,
            actions: privilegeActions,
            metadata: {}
          };
        });
        return acc;
      }, {}),
      ...Object.entries(privilegeMap.reserved).reduce((acc, [privilegeName, privilegeActions]) => {
        const name = _privilege_serializer.PrivilegeSerializer.serializeReservedPrivilege(privilegeName);

        acc[name] = {
          application,
          name,
          actions: privilegeActions,
          metadata: {}
        };
        return acc;
      }, {})
    }
  };
};

exports.serializePrivileges = serializePrivileges;