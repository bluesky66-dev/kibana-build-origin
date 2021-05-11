"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateFeaturePrivileges = validateFeaturePrivileges;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function validateFeaturePrivileges(features) {
  for (const feature of features) {
    var _feature$privileges, _feature$subFeatures;

    const seenPrivilegeIds = new Set();
    Object.keys((_feature$privileges = feature.privileges) !== null && _feature$privileges !== void 0 ? _feature$privileges : {}).forEach(privilegeId => {
      seenPrivilegeIds.add(privilegeId);
      seenPrivilegeIds.add(`minimal_${privilegeId}`);
    });
    const subFeatureEntries = (_feature$subFeatures = feature.subFeatures) !== null && _feature$subFeatures !== void 0 ? _feature$subFeatures : [];
    subFeatureEntries.forEach(subFeature => {
      subFeature.privilegeGroups.forEach(subFeaturePrivilegeGroup => {
        subFeaturePrivilegeGroup.privileges.forEach(subFeaturePrivilege => {
          if (seenPrivilegeIds.has(subFeaturePrivilege.id)) {
            throw new Error(`KibanaFeature '${feature.id}' already has a privilege with ID '${subFeaturePrivilege.id}'. Sub feature '${subFeature.name}' cannot also specify this.`);
          }

          seenPrivilegeIds.add(subFeaturePrivilege.id);
        });
      });
    });
  }
}