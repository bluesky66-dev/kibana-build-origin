"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCategories = getCategories;
exports.getPackages = getPackages;
exports.getLimitedPackages = getLimitedPackages;
exports.getPackageSavedObjects = getPackageSavedObjects;
exports.getPackageInfo = getPackageInfo;
exports.getPackageFromSource = getPackageFromSource;
exports.getInstallationObject = getInstallationObject;
exports.getInstallation = getInstallation;
Object.defineProperty(exports, "getFile", {
  enumerable: true,
  get: function () {
    return Registry.getFile;
  }
});
Object.defineProperty(exports, "SearchParams", {
  enumerable: true,
  get: function () {
    return Registry.SearchParams;
  }
});
exports.getPackageUsageStats = void 0;

var _common = require("../../../../common");

var _constants = require("../../../constants");

var _errors = require("../../../errors");

var _ = require("../../");

var Registry = _interopRequireWildcard(require("../registry"));

var _index = require("./index");

var _storage = require("../archive/storage");

var _archive = require("../archive");

var _saved_object = require("../../saved_object");

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


function nameAsTitle(name) {
  return name.charAt(0).toUpperCase() + name.substr(1).toLowerCase();
}

async function getCategories(options) {
  return Registry.fetchCategories(options);
}

async function getPackages(options) {
  const {
    savedObjectsClient,
    experimental,
    category
  } = options;
  const registryItems = await Registry.fetchList({
    category,
    experimental
  }).then(items => {
    return items.map(item => Object.assign({}, item, {
      title: item.title || nameAsTitle(item.name)
    }));
  }); // get the installed packages

  const packageSavedObjects = await getPackageSavedObjects(savedObjectsClient); // filter out any internal packages

  const savedObjectsVisible = packageSavedObjects.saved_objects.filter(o => !o.attributes.internal);
  const packageList = registryItems.map(item => (0, _index.createInstallableFrom)(item, savedObjectsVisible.find(({
    id
  }) => id === item.name))).sort(sortByName);
  return packageList;
} // Get package names for packages which cannot have more than one package policy on an agent policy
// Assume packages only export one policy template for now


async function getLimitedPackages(options) {
  const {
    savedObjectsClient
  } = options;
  const allPackages = await getPackages({
    savedObjectsClient,
    experimental: true
  });
  const installedPackages = allPackages.filter(pkg => pkg.status === _common.installationStatuses.Installed);
  const installedPackagesInfo = await Promise.all(installedPackages.map(pkgInstall => {
    return getPackageInfo({
      savedObjectsClient,
      pkgName: pkgInstall.name,
      pkgVersion: pkgInstall.version
    });
  }));
  return installedPackagesInfo.filter(_common.isPackageLimited).map(pkgInfo => pkgInfo.name);
}

async function getPackageSavedObjects(savedObjectsClient, options) {
  return savedObjectsClient.find({ ...(options || {}),
    type: _constants.PACKAGES_SAVED_OBJECT_TYPE
  });
}

async function getPackageInfo(options) {
  const {
    savedObjectsClient,
    pkgName,
    pkgVersion
  } = options;
  const [savedObject, latestPackage] = await Promise.all([getInstallationObject({
    savedObjectsClient,
    pkgName
  }), Registry.fetchFindLatestPackage(pkgName)]);
  const getPackageRes = await getPackageFromSource({
    pkgName,
    pkgVersion,
    savedObjectsClient,
    installedPkg: savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes
  });
  const {
    paths,
    packageInfo
  } = getPackageRes; // add properties that aren't (or aren't yet) on the package

  const additions = {
    latestVersion: latestPackage.version,
    title: packageInfo.title || nameAsTitle(packageInfo.name),
    assets: Registry.groupPathsByService(paths || []),
    removable: !(0, _index.isRequiredPackage)(pkgName)
  };
  const updated = { ...packageInfo,
    ...additions
  };
  return (0, _index.createInstallableFrom)(updated, savedObject);
}

const getPackageUsageStats = async ({
  savedObjectsClient,
  pkgName
}) => {
  const filter = (0, _saved_object.normalizeKuery)(_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE, `${_common.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name: ${pkgName}`);
  const agentPolicyCount = new Set();
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    // using saved Objects client directly, instead of the `list()` method of `package_policy` service
    // in order to not cause a circular dependency (package policy service imports from this module)
    const packagePolicies = await savedObjectsClient.find({
      type: _common.PACKAGE_POLICY_SAVED_OBJECT_TYPE,
      perPage: 1000,
      page: page++,
      filter
    });

    for (let index = 0, total = packagePolicies.saved_objects.length; index < total; index++) {
      agentPolicyCount.add(packagePolicies.saved_objects[index].attributes.policy_id);
    }

    hasMore = packagePolicies.saved_objects.length > 0;
  }

  return {
    agent_policy_count: agentPolicyCount.size
  };
};

exports.getPackageUsageStats = getPackageUsageStats; // gets package from install_source if it exists otherwise gets from registry

async function getPackageFromSource(options) {
  const logger = _.appContextService.getLogger();

  const {
    pkgName,
    pkgVersion,
    installedPkg,
    savedObjectsClient
  } = options;
  let res; // If the package is installed

  if (installedPkg && installedPkg.version === pkgVersion) {
    const {
      install_source: pkgInstallSource
    } = installedPkg; // check cache

    res = (0, _archive.getArchivePackage)({
      name: pkgName,
      version: pkgVersion
    });

    if (res) {
      logger.debug(`retrieved installed package ${pkgName}-${pkgVersion} from cache`);
    }

    if (!res && installedPkg.package_assets) {
      res = await (0, _storage.getEsPackage)(pkgName, pkgVersion, installedPkg.package_assets, savedObjectsClient);
      logger.debug(`retrieved installed package ${pkgName}-${pkgVersion} from ES`);
    } // for packages not in cache or package storage and installed from registry, check registry


    if (!res && pkgInstallSource === 'registry') {
      try {
        res = await Registry.getRegistryPackage(pkgName, pkgVersion);
        logger.debug(`retrieved installed package ${pkgName}-${pkgVersion} from registry`); // TODO: add to cache and storage here?
      } catch (error) {// treating this is a 404 as no status code returned
        // in the unlikely event its missing from cache, storage, and never installed from registry
      }
    }
  } else {
    // else package is not installed or installed and missing from cache and storage and installed from registry
    res = await Registry.getRegistryPackage(pkgName, pkgVersion);
    logger.debug(`retrieved uninstalled package ${pkgName}-${pkgVersion} from registry`);
  }

  if (!res) {
    throw new _errors.IngestManagerError(`package info for ${pkgName}-${pkgVersion} does not exist`);
  }

  return {
    paths: res.paths,
    packageInfo: res.packageInfo
  };
}

async function getInstallationObject(options) {
  const {
    savedObjectsClient,
    pkgName
  } = options;
  return savedObjectsClient.get(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName).catch(e => undefined);
}

async function getInstallation(options) {
  const savedObject = await getInstallationObject(options);
  return savedObject === null || savedObject === void 0 ? void 0 : savedObject.attributes;
}

function sortByName(a, b) {
  if (a.name > b.name) {
    return 1;
  } else if (a.name < b.name) {
    return -1;
  } else {
    return 0;
  }
}