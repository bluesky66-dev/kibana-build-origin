"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePackageInfo = exports.setPackageInfo = exports.getArchivePackage = exports.getPackageInfo = exports.deleteArchiveFilelist = exports.setArchiveFilelist = exports.getArchiveFilelist = exports.deleteArchiveEntry = exports.clearArchiveEntries = exports.hasArchiveEntry = exports.setArchiveEntry = exports.getArchiveEntry = void 0;

var _ = require("../../");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const archiveEntryCache = new Map();

const getArchiveEntry = key => archiveEntryCache.get(key);

exports.getArchiveEntry = getArchiveEntry;

const setArchiveEntry = (key, value) => archiveEntryCache.set(key, value);

exports.setArchiveEntry = setArchiveEntry;

const hasArchiveEntry = key => archiveEntryCache.has(key);

exports.hasArchiveEntry = hasArchiveEntry;

const clearArchiveEntries = () => archiveEntryCache.clear();

exports.clearArchiveEntries = clearArchiveEntries;

const deleteArchiveEntry = key => archiveEntryCache.delete(key);

exports.deleteArchiveEntry = deleteArchiveEntry;
const archiveFilelistCache = new Map();

const getArchiveFilelist = keyArgs => archiveFilelistCache.get(sharedKey(keyArgs));

exports.getArchiveFilelist = getArchiveFilelist;

const setArchiveFilelist = (keyArgs, paths) => {
  _.appContextService.getLogger().debug(`setting file list to the cache for ${keyArgs.name}-${keyArgs.version}:\n${JSON.stringify(paths)}`);

  return archiveFilelistCache.set(sharedKey(keyArgs), paths);
};

exports.setArchiveFilelist = setArchiveFilelist;

const deleteArchiveFilelist = keyArgs => archiveFilelistCache.delete(sharedKey(keyArgs));

exports.deleteArchiveFilelist = deleteArchiveFilelist;
const packageInfoCache = new Map();

const sharedKey = ({
  name,
  version
}) => `${name}-${version}`;

const getPackageInfo = args => {
  return packageInfoCache.get(sharedKey(args));
};

exports.getPackageInfo = getPackageInfo;

const getArchivePackage = args => {
  const packageInfo = getPackageInfo(args);
  const paths = getArchiveFilelist(args);
  if (!paths || !packageInfo) return undefined;
  return {
    paths,
    packageInfo
  };
};

exports.getArchivePackage = getArchivePackage;

const setPackageInfo = ({
  name,
  version,
  packageInfo
}) => {
  const key = sharedKey({
    name,
    version
  });

  _.appContextService.getLogger().debug(`setting package info to the cache for ${name}-${version}:\n${JSON.stringify(packageInfo)}`);

  return packageInfoCache.set(key, packageInfo);
};

exports.setPackageInfo = setPackageInfo;

const deletePackageInfo = args => packageInfoCache.delete(sharedKey(args));

exports.deletePackageInfo = deletePackageInfo;