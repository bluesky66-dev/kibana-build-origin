"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeApiBuilder = void 0;

var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FeaturePrivilegeApiBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition) {
    if (privilegeDefinition.api) {
      return privilegeDefinition.api.map(operation => this.actions.api.get(operation));
    }

    return [];
  }

}

exports.FeaturePrivilegeApiBuilder = FeaturePrivilegeApiBuilder;