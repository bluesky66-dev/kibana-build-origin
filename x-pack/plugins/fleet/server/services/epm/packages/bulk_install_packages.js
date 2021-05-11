"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bulkInstallPackages = bulkInstallPackages;
exports.isBulkInstallError = isBulkInstallError;

var Registry = _interopRequireWildcard(require("../registry"));

var _index = require("./index");

var _install = require("./install");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function bulkInstallPackages({
  savedObjectsClient,
  packagesToUpgrade,
  callCluster
}) {
  const installedAndLatestPromises = packagesToUpgrade.map(pkgToUpgrade => Promise.all([(0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName: pkgToUpgrade
  }), Registry.fetchFindLatestPackage(pkgToUpgrade)]));
  const installedAndLatestResults = await Promise.allSettled(installedAndLatestPromises);
  const installResponsePromises = installedAndLatestResults.map(async (result, index) => {
    const pkgToUpgrade = packagesToUpgrade[index];

    if (result.status === 'fulfilled') {
      const [installedPkg, latestPkg] = result.value;
      return (0, _install.upgradePackage)({
        savedObjectsClient,
        callCluster,
        installedPkg,
        latestPkg,
        pkgToUpgrade
      });
    } else {
      return {
        name: pkgToUpgrade,
        error: result.reason
      };
    }
  });
  const installResults = await Promise.allSettled(installResponsePromises);
  const installResponses = installResults.map((result, index) => {
    const pkgToUpgrade = packagesToUpgrade[index];

    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        name: pkgToUpgrade,
        error: result.reason
      };
    }
  });
  return installResponses;
}

function isBulkInstallError(test) {
  return 'error' in test && test.error instanceof Error;
}