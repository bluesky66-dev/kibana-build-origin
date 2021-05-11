"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installLatestPackage = installLatestPackage;
exports.ensureInstalledDefaultPackages = ensureInstalledDefaultPackages;
exports.ensureInstalledPackage = ensureInstalledPackage;
exports.handleInstallPackageFailure = handleInstallPackageFailure;
exports.upgradePackage = upgradePackage;
exports.installPackage = installPackage;
exports.createInstallation = createInstallation;
exports.ensurePackagesCompletedInstall = ensurePackagesCompletedInstall;
exports.getInstallType = getInstallType;
exports.removeAssetsFromInstalledEsByType = exports.saveInstalledEsRefs = exports.saveKibanaAssetsRefs = exports.updateVersion = void 0;

var _gt = _interopRequireDefault(require("semver/functions/gt"));

var _lt = _interopRequireDefault(require("semver/functions/lt"));

var _template = require("../elasticsearch/template/template");

var _index = require("./index");

var _common = require("../../../../common");

var _constants = require("../../../constants");

var Registry = _interopRequireWildcard(require("../registry"));

var _archive = require("../archive");

var _install = require("../kibana/assets/install");

var _remove = require("./remove");

var _errors = require("../../../errors");

var _get = require("./get");

var _app_context = require("../../app_context");

var _install_package = require("./_install_package");

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


async function installLatestPackage(options) {
  const {
    savedObjectsClient,
    pkgName,
    callCluster
  } = options;

  try {
    const latestPackage = await Registry.fetchFindLatestPackage(pkgName);
    const pkgkey = Registry.pkgToPkgKey({
      name: latestPackage.name,
      version: latestPackage.version
    });
    return installPackage({
      installSource: 'registry',
      savedObjectsClient,
      pkgkey,
      callCluster
    });
  } catch (err) {
    throw err;
  }
}

async function ensureInstalledDefaultPackages(savedObjectsClient, callCluster) {
  const installations = [];
  const bulkResponse = await (0, _index.bulkInstallPackages)({
    savedObjectsClient,
    packagesToUpgrade: Object.values(_common.defaultPackages),
    callCluster
  });

  for (const resp of bulkResponse) {
    if ((0, _index.isBulkInstallError)(resp)) {
      throw resp.error;
    } else {
      installations.push((0, _index.getInstallation)({
        savedObjectsClient,
        pkgName: resp.name
      }));
    }
  }

  const retrievedInstallations = await Promise.all(installations);
  return retrievedInstallations.map((installation, index) => {
    if (!installation) {
      throw new Error(`could not get installation ${bulkResponse[index].name}`);
    }

    return installation;
  });
}

async function ensureInstalledPackage(options) {
  const {
    savedObjectsClient,
    pkgName,
    callCluster
  } = options;
  const installedPackage = await (0, _index.getInstallation)({
    savedObjectsClient,
    pkgName
  });

  if (installedPackage) {
    return installedPackage;
  } // if the requested packaged was not found to be installed, install


  await installLatestPackage({
    savedObjectsClient,
    pkgName,
    callCluster
  });
  const installation = await (0, _index.getInstallation)({
    savedObjectsClient,
    pkgName
  });
  if (!installation) throw new Error(`could not get installation ${pkgName}`);
  return installation;
}

async function handleInstallPackageFailure({
  savedObjectsClient,
  error,
  pkgName,
  pkgVersion,
  installedPkg,
  callCluster
}) {
  if (error instanceof _errors.IngestManagerError) {
    return;
  }

  const logger = _app_context.appContextService.getLogger();

  const pkgkey = Registry.pkgToPkgKey({
    name: pkgName,
    version: pkgVersion
  }); // if there is an unknown server error, uninstall any package assets or reinstall the previous version if update

  try {
    const installType = getInstallType({
      pkgVersion,
      installedPkg
    });

    if (installType === 'install' || installType === 'reinstall') {
      logger.error(`uninstalling ${pkgkey} after error installing`);
      await (0, _remove.removeInstallation)({
        savedObjectsClient,
        pkgkey,
        callCluster
      });
    }

    if (installType === 'update') {
      if (!installedPkg) {
        logger.error(`failed to rollback package after installation error ${error} because saved object was undefined`);
        return;
      }

      const prevVersion = `${pkgName}-${installedPkg.attributes.version}`;
      logger.error(`rolling back to ${prevVersion} after error installing ${pkgkey}`);
      await installPackage({
        installSource: 'registry',
        savedObjectsClient,
        pkgkey: prevVersion,
        callCluster
      });
    }
  } catch (e) {
    logger.error(`failed to uninstall or rollback package after installation error ${e}`);
  }
}

async function upgradePackage({
  savedObjectsClient,
  callCluster,
  installedPkg,
  latestPkg,
  pkgToUpgrade
}) {
  if (!installedPkg || (0, _gt.default)(latestPkg.version, installedPkg.attributes.version)) {
    const pkgkey = Registry.pkgToPkgKey({
      name: latestPkg.name,
      version: latestPkg.version
    });

    try {
      var _installedPkg$attribu;

      const assets = await installPackage({
        installSource: 'registry',
        savedObjectsClient,
        pkgkey,
        callCluster
      });
      return {
        name: pkgToUpgrade,
        newVersion: latestPkg.version,
        oldVersion: (_installedPkg$attribu = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.version) !== null && _installedPkg$attribu !== void 0 ? _installedPkg$attribu : null,
        assets
      };
    } catch (installFailed) {
      await handleInstallPackageFailure({
        savedObjectsClient,
        error: installFailed,
        pkgName: latestPkg.name,
        pkgVersion: latestPkg.version,
        installedPkg,
        callCluster
      });
      return {
        name: pkgToUpgrade,
        error: installFailed
      };
    }
  } else {
    // package was already at the latest version
    return {
      name: pkgToUpgrade,
      newVersion: latestPkg.version,
      oldVersion: latestPkg.version,
      assets: [...installedPkg.attributes.installed_es, ...installedPkg.attributes.installed_kibana]
    };
  }
}

async function installPackageFromRegistry({
  savedObjectsClient,
  pkgkey,
  callCluster,
  force = false
}) {
  // TODO: change epm API to /packageName/version so we don't need to do this
  const {
    pkgName,
    pkgVersion
  } = Registry.splitPkgKey(pkgkey); // get the currently installed package

  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installType = getInstallType({
    pkgVersion,
    installedPkg
  }); // let the user install if using the force flag or needing to reinstall or install a previous version due to failed update

  const installOutOfDateVersionOk = installType === 'reinstall' || installType === 'reupdate' || installType === 'rollback';
  const latestPackage = await Registry.fetchFindLatestPackage(pkgName);

  if ((0, _lt.default)(pkgVersion, latestPackage.version) && !force && !installOutOfDateVersionOk) {
    throw new _errors.PackageOutdatedError(`${pkgkey} is out-of-date and cannot be installed or updated`);
  }

  const {
    paths,
    packageInfo
  } = await Registry.getRegistryPackage(pkgName, pkgVersion);
  return (0, _install_package._installPackage)({
    savedObjectsClient,
    callCluster,
    installedPkg,
    paths,
    packageInfo,
    installType,
    installSource: 'registry'
  });
}

async function installPackageByUpload({
  savedObjectsClient,
  callCluster,
  archiveBuffer,
  contentType
}) {
  const {
    packageInfo
  } = await (0, _archive.parseAndVerifyArchiveEntries)(archiveBuffer, contentType);
  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName: packageInfo.name
  });
  const installType = getInstallType({
    pkgVersion: packageInfo.version,
    installedPkg
  });

  if (installType !== 'install') {
    throw new _errors.PackageOperationNotSupportedError(`Package upload only supports fresh installations. Package ${packageInfo.name} is already installed, please uninstall first.`);
  }

  const installSource = 'upload';
  const paths = await (0, _archive.unpackBufferToCache)({
    name: packageInfo.name,
    version: packageInfo.version,
    installSource,
    archiveBuffer,
    contentType
  });
  (0, _archive.setPackageInfo)({
    name: packageInfo.name,
    version: packageInfo.version,
    packageInfo
  });
  return (0, _install_package._installPackage)({
    savedObjectsClient,
    callCluster,
    installedPkg,
    paths,
    packageInfo,
    installType,
    installSource
  });
}

async function installPackage(args) {
  if (!('installSource' in args)) {
    throw new Error('installSource is required');
  }

  if (args.installSource === 'registry') {
    const {
      savedObjectsClient,
      pkgkey,
      callCluster,
      force
    } = args;
    return installPackageFromRegistry({
      savedObjectsClient,
      pkgkey,
      callCluster,
      force
    });
  } else if (args.installSource === 'upload') {
    const {
      savedObjectsClient,
      callCluster,
      archiveBuffer,
      contentType
    } = args;
    return installPackageByUpload({
      savedObjectsClient,
      callCluster,
      archiveBuffer,
      contentType
    });
  } // @ts-expect-error s/b impossibe b/c `never` by this point, but just in case


  throw new Error(`Unknown installSource: ${args.installSource}`);
}

const updateVersion = async (savedObjectsClient, pkgName, pkgVersion) => {
  return savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    version: pkgVersion
  });
};

exports.updateVersion = updateVersion;

async function createInstallation(options) {
  const {
    savedObjectsClient,
    packageInfo,
    installSource
  } = options;
  const {
    internal = false,
    name: pkgName,
    version: pkgVersion
  } = packageInfo;
  const removable = !(0, _index.isRequiredPackage)(pkgName);
  const toSaveESIndexPatterns = (0, _template.generateESIndexPatterns)(packageInfo.data_streams);
  const created = await savedObjectsClient.create(_constants.PACKAGES_SAVED_OBJECT_TYPE, {
    installed_kibana: [],
    installed_es: [],
    package_assets: [],
    es_index_patterns: toSaveESIndexPatterns,
    name: pkgName,
    version: pkgVersion,
    internal,
    removable,
    install_version: pkgVersion,
    install_status: 'installing',
    install_started_at: new Date().toISOString(),
    install_source: installSource
  }, {
    id: pkgName,
    overwrite: true
  });
  return created;
}

const saveKibanaAssetsRefs = async (savedObjectsClient, pkgName, kibanaAssets) => {
  const assetRefs = Object.values(kibanaAssets).flat().map(_install.toAssetReference);
  await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_kibana: assetRefs
  });
  return assetRefs;
};

exports.saveKibanaAssetsRefs = saveKibanaAssetsRefs;

const saveInstalledEsRefs = async (savedObjectsClient, pkgName, installedAssets) => {
  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installedAssetsToSave = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.installed_es.concat(installedAssets);
  await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: installedAssetsToSave
  });
  return installedAssets;
};

exports.saveInstalledEsRefs = saveInstalledEsRefs;

const removeAssetsFromInstalledEsByType = async (savedObjectsClient, pkgName, assetType) => {
  const installedPkg = await (0, _index.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  const installedAssets = installedPkg === null || installedPkg === void 0 ? void 0 : installedPkg.attributes.installed_es;
  if (!(installedAssets !== null && installedAssets !== void 0 && installedAssets.length)) return;
  const installedAssetsToSave = installedAssets === null || installedAssets === void 0 ? void 0 : installedAssets.filter(({
    id,
    type
  }) => {
    return type !== assetType;
  });
  return savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: installedAssetsToSave
  });
};

exports.removeAssetsFromInstalledEsByType = removeAssetsFromInstalledEsByType;

async function ensurePackagesCompletedInstall(savedObjectsClient, callCluster) {
  const installingPackages = await (0, _get.getPackageSavedObjects)(savedObjectsClient, {
    searchFields: ['install_status'],
    search: 'installing'
  });
  const installingPromises = installingPackages.saved_objects.reduce((acc, pkg) => {
    const startDate = pkg.attributes.install_started_at;
    const nowDate = new Date().toISOString();
    const elapsedTime = Date.parse(nowDate) - Date.parse(startDate);
    const pkgkey = `${pkg.attributes.name}-${pkg.attributes.install_version}`; // reinstall package

    if (elapsedTime > _constants.MAX_TIME_COMPLETE_INSTALL) {
      acc.push(installPackage({
        installSource: 'registry',
        savedObjectsClient,
        pkgkey,
        callCluster
      }));
    }

    return acc;
  }, []);
  await Promise.all(installingPromises);
  return installingPackages;
} // implementation


function getInstallType(args) {
  const {
    pkgVersion,
    installedPkg
  } = args;
  if (!installedPkg) return 'install';
  const currentPkgVersion = installedPkg.attributes.version;
  const lastStartedInstallVersion = installedPkg.attributes.install_version;
  if (pkgVersion === currentPkgVersion && pkgVersion !== lastStartedInstallVersion) return 'rollback';
  if (pkgVersion === currentPkgVersion) return 'reinstall';
  if (pkgVersion === lastStartedInstallVersion && pkgVersion !== currentPkgVersion) return 'reupdate';
  if (pkgVersion !== lastStartedInstallVersion && pkgVersion !== currentPkgVersion) return 'update';
  throw new Error('unknown install type');
}