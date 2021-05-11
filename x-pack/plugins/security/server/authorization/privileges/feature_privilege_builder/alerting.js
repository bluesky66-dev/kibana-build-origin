"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeaturePrivilegeAlertingBuilder = void 0;

var _lodash = require("lodash");

var _feature_privilege_builder = require("./feature_privilege_builder");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readOperations = ['get', 'getAlertState', 'getAlertInstanceSummary', 'find'];
const writeOperations = ['create', 'delete', 'update', 'updateApiKey', 'enable', 'disable', 'muteAll', 'unmuteAll', 'muteInstance', 'unmuteInstance'];
const allOperations = [...readOperations, ...writeOperations];

class FeaturePrivilegeAlertingBuilder extends _feature_privilege_builder.BaseFeaturePrivilegeBuilder {
  getActions(privilegeDefinition, feature) {
    var _privilegeDefinition$, _privilegeDefinition$2, _privilegeDefinition$3, _privilegeDefinition$4;

    const getAlertingPrivilege = (operations, privilegedTypes, consumer) => privilegedTypes.flatMap(type => operations.map(operation => this.actions.alerting.get(type, consumer, operation)));

    return (0, _lodash.uniq)([...getAlertingPrivilege(allOperations, (_privilegeDefinition$ = (_privilegeDefinition$2 = privilegeDefinition.alerting) === null || _privilegeDefinition$2 === void 0 ? void 0 : _privilegeDefinition$2.all) !== null && _privilegeDefinition$ !== void 0 ? _privilegeDefinition$ : [], feature.id), ...getAlertingPrivilege(readOperations, (_privilegeDefinition$3 = (_privilegeDefinition$4 = privilegeDefinition.alerting) === null || _privilegeDefinition$4 === void 0 ? void 0 : _privilegeDefinition$4.read) !== null && _privilegeDefinition$3 !== void 0 ? _privilegeDefinition$3 : [], feature.id)]);
  }

}

exports.FeaturePrivilegeAlertingBuilder = FeaturePrivilegeAlertingBuilder;