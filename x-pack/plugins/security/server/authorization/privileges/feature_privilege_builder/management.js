"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeManagementBuilder = void 0;

var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FeaturePrivilegeManagementBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition) {
    const managementSections = privilegeDefinition.management;

    if (!managementSections) {
      return [];
    }

    return Object.entries(managementSections).reduce((acc, [sectionId, items]) => {
      return [...acc, ...items.map(item => this.actions.ui.get('management', sectionId, item))];
    }, []);
  }

}

exports.FeaturePrivilegeManagementBuilder = FeaturePrivilegeManagementBuilder;