"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrivilegeSerializer = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const featurePrefix = 'feature_';
const spacePrefix = 'space_';
const reservedPrefix = 'reserved_';
const basePrivilegeNames = ['all', 'read'];
const globalBasePrivileges = [...basePrivilegeNames];
const spaceBasePrivileges = basePrivilegeNames.map(privilegeName => `${spacePrefix}${privilegeName}`);
const deserializeFeaturePrivilegeRegexp = new RegExp(`^${featurePrefix}([a-zA-Z0-9_-]+)\\.([a-zA-Z0-9_-]+)$`);

class PrivilegeSerializer {
  static isSerializedGlobalBasePrivilege(privilegeName) {
    return globalBasePrivileges.includes(privilegeName);
  }

  static isSerializedSpaceBasePrivilege(privilegeName) {
    return spaceBasePrivileges.includes(privilegeName);
  }

  static isSerializedReservedPrivilege(privilegeName) {
    return privilegeName.startsWith(reservedPrefix);
  }

  static isSerializedFeaturePrivilege(privilegeName) {
    return privilegeName.startsWith(featurePrefix);
  }

  static serializeGlobalBasePrivilege(privilegeName) {
    if (!globalBasePrivileges.includes(privilegeName)) {
      throw new Error('Unrecognized global base privilege');
    }

    return privilegeName;
  }

  static serializeSpaceBasePrivilege(privilegeName) {
    if (!basePrivilegeNames.includes(privilegeName)) {
      throw new Error('Unrecognized space base privilege');
    }

    return `${spacePrefix}${privilegeName}`;
  }

  static serializeFeaturePrivilege(featureId, privilegeName) {
    return `${featurePrefix}${featureId}.${privilegeName}`;
  }

  static serializeReservedPrivilege(privilegeName) {
    return `${reservedPrefix}${privilegeName}`;
  }

  static deserializeFeaturePrivilege(privilege) {
    const match = privilege.match(deserializeFeaturePrivilegeRegexp);

    if (!match) {
      throw new Error(`Feature privilege '${privilege}' didn't match pattern`);
    }

    return {
      featureId: match[1],
      privilege: match[2]
    };
  }

  static deserializeGlobalBasePrivilege(privilege) {
    if (PrivilegeSerializer.isSerializedGlobalBasePrivilege(privilege)) {
      return privilege;
    }

    throw new Error('Unrecognized global base privilege');
  }

  static deserializeSpaceBasePrivilege(privilege) {
    if (!PrivilegeSerializer.isSerializedSpaceBasePrivilege(privilege)) {
      throw new Error('Unrecognized space base privilege');
    }

    return privilege.slice(spacePrefix.length);
  }

  static deserializeReservedPrivilege(privilege) {
    if (!PrivilegeSerializer.isSerializedReservedPrivilege(privilege)) {
      throw new Error('Unrecognized reserved privilege');
    }

    return privilege.slice(reservedPrefix.length);
  }

}

exports.PrivilegeSerializer = PrivilegeSerializer;