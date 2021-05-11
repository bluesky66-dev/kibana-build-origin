"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subFeaturePrivilegeIterator = subFeaturePrivilegeIterator;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function* subFeaturePrivilegeIterator(feature, licenseType) {
  for (const subFeature of feature.subFeatures) {
    for (const group of subFeature.privilegeGroups) {
      yield* group.privileges.filter(privilege => !privilege.minimumLicense || privilege.minimumLicense <= licenseType);
    }
  }
}