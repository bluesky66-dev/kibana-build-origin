"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeCatalogueBuilder = void 0;

var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FeaturePrivilegeCatalogueBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition) {
    const catalogueEntries = privilegeDefinition.catalogue;

    if (!catalogueEntries) {
      return [];
    }

    return catalogueEntries.map(catalogueEntryId => this.actions.ui.get('catalogue', catalogueEntryId));
  }

}

exports.FeaturePrivilegeCatalogueBuilder = FeaturePrivilegeCatalogueBuilder;