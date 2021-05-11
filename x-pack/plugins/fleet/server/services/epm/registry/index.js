"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.splitPkgKey = splitPkgKey;
exports.fetchList = fetchList;
exports.fetchFindLatestPackage = fetchFindLatestPackage;
exports.fetchInfo = fetchInfo;
exports.getFile = getFile;
exports.fetchFile = fetchFile;
exports.fetchCategories = fetchCategories;
exports.getInfo = getInfo;
exports.getRegistryPackage = getRegistryPackage;
exports.ensureCachedArchiveInfo = ensureCachedArchiveInfo;
exports.groupPathsByService = groupPathsByService;
exports.pkgToPkgKey = void 0;

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _valid = _interopRequireDefault(require("semver/functions/valid"));

var _url = require("url");

var _types = require("../../../types");

var _archive = require("../archive");

var _requests = require("./requests");

var _streams = require("../streams");

var _registry_url = require("./registry_url");

var _ = require("../..");

var _errors = require("../../../errors");

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

/**
 * Extract the package name and package version from a string.
 *
 * @param pkgkey a string containing the package name delimited by the package version
 */


function splitPkgKey(pkgkey) {
  // this will return an empty string if `indexOf` returns -1
  const pkgName = pkgkey.substr(0, pkgkey.indexOf('-'));

  if (pkgName === '') {
    throw new Error('Package key parsing failed: package name was empty');
  } // this will return the entire string if `indexOf` return -1


  const pkgVersion = pkgkey.substr(pkgkey.indexOf('-') + 1);

  if (!(0, _valid.default)(pkgVersion)) {
    throw new Error('Package key parsing failed: package version was not a valid semver');
  }

  return {
    pkgName,
    pkgVersion
  };
}

const pkgToPkgKey = ({
  name,
  version
}) => `${name}-${version}`;

exports.pkgToPkgKey = pkgToPkgKey;

async function fetchList(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/search`);

  const kibanaVersion = _.appContextService.getKibanaVersion().split('-')[0]; // may be x.y.z-SNAPSHOT


  const kibanaBranch = _.appContextService.getKibanaBranch();

  if (params) {
    if (params.category) {
      url.searchParams.set('category', params.category);
    }

    if (params.experimental) {
      url.searchParams.set('experimental', params.experimental.toString());
    }
  } // on master, request all packages regardless of version


  if (kibanaVersion && kibanaBranch !== 'master') {
    url.searchParams.set('kibana.version', kibanaVersion);
  }

  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}

async function fetchFindLatestPackage(packageName) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();

  const kibanaVersion = _.appContextService.getKibanaVersion().split('-')[0]; // may be x.y.z-SNAPSHOT


  const kibanaBranch = _.appContextService.getKibanaBranch();

  const url = new _url.URL(`${registryUrl}/search?package=${packageName}&internal=true&experimental=true`); // on master, request all packages regardless of version

  if (kibanaVersion && kibanaBranch !== 'master') {
    url.searchParams.set('kibana.version', kibanaVersion);
  }

  const res = await (0, _requests.fetchUrl)(url.toString());
  const searchResults = JSON.parse(res);

  if (searchResults.length) {
    return searchResults[0];
  } else {
    throw new _errors.PackageNotFoundError(`${packageName} not found`);
  }
}

async function fetchInfo(pkgName, pkgVersion) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  return (0, _requests.fetchUrl)(`${registryUrl}/package/${pkgName}/${pkgVersion}`).then(JSON.parse);
}

async function getFile(pkgName, pkgVersion, relPath) {
  const filePath = `/package/${pkgName}/${pkgVersion}/${relPath}`;
  return fetchFile(filePath);
}

async function fetchFile(filePath) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  return (0, _requests.getResponse)(`${registryUrl}${filePath}`);
}

async function fetchCategories(params) {
  const registryUrl = (0, _registry_url.getRegistryUrl)();
  const url = new _url.URL(`${registryUrl}/categories`);

  if (params) {
    if (params.experimental) {
      url.searchParams.set('experimental', params.experimental.toString());
    }
  }

  return (0, _requests.fetchUrl)(url.toString()).then(JSON.parse);
}

async function getInfo(name, version) {
  let packageInfo = (0, _archive.getPackageInfo)({
    name,
    version
  });

  if (!packageInfo) {
    packageInfo = await fetchInfo(name, version);
    (0, _archive.setPackageInfo)({
      name,
      version,
      packageInfo
    });
  }

  return packageInfo;
}

async function getRegistryPackage(name, version) {
  const installSource = 'registry';
  let paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  });

  if (!paths || paths.length === 0) {
    const {
      archiveBuffer,
      archivePath
    } = await fetchArchiveBuffer(name, version);
    paths = await (0, _archive.unpackBufferToCache)({
      name,
      version,
      installSource,
      archiveBuffer,
      contentType: ensureContentType(archivePath)
    });
  }

  const packageInfo = await getInfo(name, version);
  return {
    paths,
    packageInfo
  };
}

function ensureContentType(archivePath) {
  const contentType = _mimeTypes.default.lookup(archivePath);

  if (!contentType) {
    throw new Error(`Unknown compression format for '${archivePath}'. Please use .zip or .gz`);
  }

  return contentType;
}

async function ensureCachedArchiveInfo(name, version, installSource = 'registry') {
  const paths = (0, _archive.getArchiveFilelist)({
    name,
    version
  });

  if (!paths || paths.length === 0) {
    if (installSource === 'registry') {
      await getRegistryPackage(name, version);
    } else {
      throw new _errors.PackageCacheError(`Package ${name}-${version} not cached. If it was uploaded, try uninstalling and reinstalling manually.`);
    }
  }
}

async function fetchArchiveBuffer(pkgName, pkgVersion) {
  const {
    download: archivePath
  } = await getInfo(pkgName, pkgVersion);
  const archiveUrl = `${(0, _registry_url.getRegistryUrl)()}${archivePath}`;
  const archiveBuffer = await (0, _requests.getResponseStream)(archiveUrl).then(_streams.streamToBuffer);
  return {
    archiveBuffer,
    archivePath
  };
}

function groupPathsByService(paths) {
  const kibanaAssetTypes = Object.values(_types.KibanaAssetType); // ASK: best way, if any, to avoid `any`?

  const assets = paths.reduce((map, path) => {
    const parts = (0, _archive.getPathParts)(path.replace(/^\/package\//, ''));

    if (parts.service === 'kibana' && kibanaAssetTypes.includes(parts.type) || parts.service === 'elasticsearch') {
      if (!map[parts.service]) map[parts.service] = {};
      if (!map[parts.service][parts.type]) map[parts.service][parts.type] = [];
      map[parts.service][parts.type].push(parts);
    }

    return map;
  }, {});
  return {
    kibana: assets.kibana,
    elasticsearch: assets.elasticsearch
  };
}