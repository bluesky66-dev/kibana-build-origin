"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.featurePrivilegeIterator = featurePrivilegeIterator;

var _lodash = _interopRequireDefault(require("lodash"));

var _sub_feature_privilege_iterator = require("./sub_feature_privilege_iterator");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function* featurePrivilegeIterator(feature, options) {
  for (const entry of Object.entries((_feature$privileges = feature.privileges) !== null && _feature$privileges !== void 0 ? _feature$privileges : {})) {
    var _feature$privileges;

    const [privilegeId, privilege] = entry;

    if (options.predicate && !options.predicate(privilegeId, privilege)) {
      continue;
    }

    if (options.augmentWithSubFeaturePrivileges) {
      yield {
        privilegeId,
        privilege: mergeWithSubFeatures(privilegeId, privilege, feature, options.licenseType)
      };
    } else {
      yield {
        privilegeId,
        privilege
      };
    }
  }
}

function mergeWithSubFeatures(privilegeId, privilege, feature, licenseType) {
  const mergedConfig = _lodash.default.cloneDeep(privilege);

  for (const subFeaturePrivilege of (0, _sub_feature_privilege_iterator.subFeaturePrivilegeIterator)(feature, licenseType)) {
    var _mergedConfig$managem, _subFeaturePrivilege$, _mergedConfig$alertin, _mergedConfig$alertin2, _subFeaturePrivilege$2, _subFeaturePrivilege$3, _mergedConfig$alertin3, _mergedConfig$alertin4, _subFeaturePrivilege$4, _subFeaturePrivilege$5;

    if (subFeaturePrivilege.includeIn !== 'read' && subFeaturePrivilege.includeIn !== privilegeId) {
      continue;
    }

    mergedConfig.api = mergeArrays(mergedConfig.api, subFeaturePrivilege.api);
    mergedConfig.app = mergeArrays(mergedConfig.app, subFeaturePrivilege.app);
    mergedConfig.catalogue = mergeArrays(mergedConfig.catalogue, subFeaturePrivilege.catalogue);
    const managementEntries = Object.entries((_mergedConfig$managem = mergedConfig.management) !== null && _mergedConfig$managem !== void 0 ? _mergedConfig$managem : {});
    const subFeatureManagementEntries = Object.entries((_subFeaturePrivilege$ = subFeaturePrivilege.management) !== null && _subFeaturePrivilege$ !== void 0 ? _subFeaturePrivilege$ : {});
    mergedConfig.management = [managementEntries, subFeatureManagementEntries].flat().reduce((acc, [sectionId, managementApps]) => {
      return { ...acc,
        [sectionId]: mergeArrays(acc[sectionId], managementApps)
      };
    }, {});
    mergedConfig.ui = mergeArrays(mergedConfig.ui, subFeaturePrivilege.ui);
    mergedConfig.savedObject.all = mergeArrays(mergedConfig.savedObject.all, subFeaturePrivilege.savedObject.all);
    mergedConfig.savedObject.read = mergeArrays(mergedConfig.savedObject.read, subFeaturePrivilege.savedObject.read);
    mergedConfig.alerting = {
      all: mergeArrays((_mergedConfig$alertin = (_mergedConfig$alertin2 = mergedConfig.alerting) === null || _mergedConfig$alertin2 === void 0 ? void 0 : _mergedConfig$alertin2.all) !== null && _mergedConfig$alertin !== void 0 ? _mergedConfig$alertin : [], (_subFeaturePrivilege$2 = (_subFeaturePrivilege$3 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$3 === void 0 ? void 0 : _subFeaturePrivilege$3.all) !== null && _subFeaturePrivilege$2 !== void 0 ? _subFeaturePrivilege$2 : []),
      read: mergeArrays((_mergedConfig$alertin3 = (_mergedConfig$alertin4 = mergedConfig.alerting) === null || _mergedConfig$alertin4 === void 0 ? void 0 : _mergedConfig$alertin4.read) !== null && _mergedConfig$alertin3 !== void 0 ? _mergedConfig$alertin3 : [], (_subFeaturePrivilege$4 = (_subFeaturePrivilege$5 = subFeaturePrivilege.alerting) === null || _subFeaturePrivilege$5 === void 0 ? void 0 : _subFeaturePrivilege$5.read) !== null && _subFeaturePrivilege$4 !== void 0 ? _subFeaturePrivilege$4 : [])
    };
  }

  return mergedConfig;
}

function mergeArrays(input1, input2) {
  const first = input1 !== null && input1 !== void 0 ? input1 : [];
  const second = input2 !== null && input2 !== void 0 ? input2 : [];
  return Array.from(new Set([...first, ...second]));
}