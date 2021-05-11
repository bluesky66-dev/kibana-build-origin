"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeNavlinkBuilder = void 0;

var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class FeaturePrivilegeNavlinkBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition) {
    var _privilegeDefinition$;

    return ((_privilegeDefinition$ = privilegeDefinition.app) !== null && _privilegeDefinition$ !== void 0 ? _privilegeDefinition$ : []).map(app => this.actions.ui.get('navLinks', app));
  }

}

exports.FeaturePrivilegeNavlinkBuilder = FeaturePrivilegeNavlinkBuilder;