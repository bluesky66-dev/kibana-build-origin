"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssets = getAssets;
exports.getAssetsData = getAssetsData;

var _archive = require("../archive");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// paths from RegistryPackage are routes to the assets on EPR
// e.g. `/package/nginx/1.2.0/data_stream/access/fields/fields.yml`
// paths for ArchiveEntry are routes to the assets in the archive
// e.g. `nginx-1.2.0/data_stream/access/fields/fields.yml`
// RegistryPackage paths have a `/package/` prefix compared to ArchiveEntry paths
// and different package and version structure


function getAssets(packageInfo, filter = path => true, datasetName) {
  const assets = [];
  const {
    name,
    version
  } = packageInfo;
  const paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  }); // TODO: might be better to throw a PackageCacheError here

  if (!paths || paths.length === 0) return assets; // Skip directories

  for (const path of paths) {
    if (path.endsWith('/')) {
      continue;
    } // if dataset, filter for them


    if (datasetName) {
      const comparePath = `${packageInfo.name}-${packageInfo.version}/data_stream/${datasetName}/`;

      if (!path.includes(comparePath)) {
        continue;
      }
    }

    if (!filter(path)) {
      continue;
    }

    assets.push(path);
  }

  return assets;
} // ASK: Does getAssetsData need an installSource now?
// if so, should it be an Installation vs InstallablePackage or add another argument?


async function getAssetsData(packageInfo, filter = path => true, datasetName) {
  // Gather all asset data
  const assets = getAssets(packageInfo, filter, datasetName);
  const entries = assets.map(path => {
    const buffer = (0, _archive.getAsset)(path);
    return {
      path,
      buffer
    };
  });
  return entries;
}