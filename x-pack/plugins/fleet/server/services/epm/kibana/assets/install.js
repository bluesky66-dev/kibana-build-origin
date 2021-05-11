"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getKibanaAsset = getKibanaAsset;
exports.createSavedObjectKibanaAsset = createSavedObjectKibanaAsset;
exports.installKibanaAssets = installKibanaAssets;
exports.getKibanaAssets = getKibanaAssets;
exports.toAssetReference = toAssetReference;
exports.deleteKibanaInstalledRefs = void 0;

var _common = require("../../../../../common");

var _archive = require("../../archive");

var _types = require("../../../../types");

var _packages = require("../../packages");

var _install = require("../index_pattern/install");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// KibanaSavedObjectTypes are used to ensure saved objects being created for a given
// KibanaAssetType have the correct type


const KibanaSavedObjectTypeMapping = {
  [_types.KibanaAssetType.dashboard]: _types.KibanaSavedObjectType.dashboard,
  [_types.KibanaAssetType.indexPattern]: _types.KibanaSavedObjectType.indexPattern,
  [_types.KibanaAssetType.map]: _types.KibanaSavedObjectType.map,
  [_types.KibanaAssetType.search]: _types.KibanaSavedObjectType.search,
  [_types.KibanaAssetType.visualization]: _types.KibanaSavedObjectType.visualization,
  [_types.KibanaAssetType.lens]: _types.KibanaSavedObjectType.lens
}; // Define how each asset type will be installed

const AssetInstallers = {
  [_types.KibanaAssetType.dashboard]: installKibanaSavedObjects,
  [_types.KibanaAssetType.indexPattern]: installKibanaIndexPatterns,
  [_types.KibanaAssetType.map]: installKibanaSavedObjects,
  [_types.KibanaAssetType.search]: installKibanaSavedObjects,
  [_types.KibanaAssetType.visualization]: installKibanaSavedObjects,
  [_types.KibanaAssetType.lens]: installKibanaSavedObjects
};

async function getKibanaAsset(key) {
  const buffer = (0, _archive.getAsset)(key); // cache values are buffers. convert to string / JSON

  return JSON.parse(buffer.toString('utf8'));
}

function createSavedObjectKibanaAsset(asset) {
  // convert that to an object
  return {
    type: asset.type,
    id: asset.id,
    attributes: asset.attributes,
    references: asset.references || [],
    migrationVersion: asset.migrationVersion || {}
  };
} // TODO: make it an exhaustive list
// e.g. switch statement with cases for each enum key returning `never` for default case


async function installKibanaAssets(options) {
  const {
    savedObjectsClient,
    kibanaAssets
  } = options; // install the assets

  const kibanaAssetTypes = Object.values(_types.KibanaAssetType);
  const installedAssets = await Promise.all(kibanaAssetTypes.map(assetType => {
    if (kibanaAssets[assetType]) {
      return AssetInstallers[assetType]({
        savedObjectsClient,
        kibanaAssets: kibanaAssets[assetType]
      });
    }

    return [];
  }));
  return installedAssets.flat();
}

const deleteKibanaInstalledRefs = async (savedObjectsClient, pkgName, installedKibanaRefs) => {
  const installedAssetsToSave = installedKibanaRefs.filter(({
    id,
    type
  }) => {
    const assetType = type;
    return !_packages.savedObjectTypes.includes(assetType);
  });
  return savedObjectsClient.update(_common.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_kibana: installedAssetsToSave
  });
};

exports.deleteKibanaInstalledRefs = deleteKibanaInstalledRefs;

async function getKibanaAssets(paths) {
  const kibanaAssetTypes = Object.values(_types.KibanaAssetType);

  const isKibanaAssetType = path => {
    const parts = (0, _archive.getPathParts)(path);
    return parts.service === 'kibana' && kibanaAssetTypes.includes(parts.type);
  };

  const filteredPaths = paths.filter(isKibanaAssetType).map(path => [path, (0, _archive.getPathParts)(path)]);
  const assetArrays = [];

  for (const assetType of kibanaAssetTypes) {
    const matching = filteredPaths.filter(([path, parts]) => parts.type === assetType);
    assetArrays.push(Promise.all(matching.map(([path]) => path).map(getKibanaAsset)));
  }

  const resolvedAssets = await Promise.all(assetArrays);
  const result = {};

  for (const [index, assetType] of kibanaAssetTypes.entries()) {
    const expectedType = KibanaSavedObjectTypeMapping[assetType];
    const properlyTypedAssets = resolvedAssets[index].filter(({
      type
    }) => type === expectedType);
    result[assetType] = properlyTypedAssets;
  }

  return result;
}

async function installKibanaSavedObjects({
  savedObjectsClient,
  kibanaAssets
}) {
  const toBeSavedObjects = await Promise.all(kibanaAssets.map(asset => createSavedObjectKibanaAsset(asset)));

  if (toBeSavedObjects.length === 0) {
    return [];
  } else {
    const createResults = await savedObjectsClient.bulkCreate(toBeSavedObjects, {
      overwrite: true
    });
    return createResults.saved_objects;
  }
}

async function installKibanaIndexPatterns({
  savedObjectsClient,
  kibanaAssets
}) {
  // Filter out any reserved index patterns
  const reservedPatterns = _install.indexPatternTypes.map(pattern => `${pattern}-*`);

  const nonReservedPatterns = kibanaAssets.filter(asset => !reservedPatterns.includes(asset.id));
  return installKibanaSavedObjects({
    savedObjectsClient,
    kibanaAssets: nonReservedPatterns
  });
}

function toAssetReference({
  id,
  type
}) {
  const reference = {
    id,
    type: type
  };
  return reference;
}