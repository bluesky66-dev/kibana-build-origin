"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installBrowser = installBrowser;
exports.getBinaryPath = void 0;

var _del = _interopRequireDefault(require("del"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _paths = require("./chromium/paths");

var _download = require("./download");

var _checksum = require("./download/checksum");

var _extract = require("./extract");

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
// @ts-ignore
// @ts-ignore

/**
 * Small helper util to resolve where chromium is installed
 */


const getBinaryPath = (chromiumPath = _path.default.resolve(__dirname, '../../chromium'), platform = process.platform, architecture = _os.default.arch()) => {
  const pkg = _paths.paths.packages.find(p => {
    return p.platforms.includes(platform) && p.architecture === architecture;
  });

  if (!pkg) {
    // TODO: validate this
    throw new Error(`Unsupported platform: ${platform}-${architecture}`);
  }

  return _path.default.join(chromiumPath, pkg.binaryRelativePath);
};
/**
 * "install" a browser by type into installs path by extracting the downloaded
 * archive. If there is an error extracting the archive an `ExtractError` is thrown
 */


exports.getBinaryPath = getBinaryPath;

function installBrowser(logger, chromiumPath = _path.default.resolve(__dirname, '../../chromium'), platform = process.platform, architecture = _os.default.arch()) {
  const binaryPath$ = new Rx.Subject();

  const backgroundInstall = async () => {
    const pkg = _paths.paths.packages.find(p => {
      return p.platforms.includes(platform) && p.architecture === architecture;
    });

    if (!pkg) {
      // TODO: validate this
      throw new Error(`Unsupported platform: ${platform}-${architecture}`);
    }

    const binaryPath = getBinaryPath(chromiumPath, platform, architecture);
    const binaryChecksum = await (0, _checksum.md5)(binaryPath).catch(() => '');

    if (binaryChecksum !== pkg.binaryChecksum) {
      await (0, _download.ensureBrowserDownloaded)(logger);

      const archive = _path.default.join(_paths.paths.archivesPath, pkg.archiveFilename);

      logger.info(`Extracting [${archive}] to [${binaryPath}]`);
      await (0, _del.default)(chromiumPath);
      await (0, _extract.extract)(archive, chromiumPath);
    }

    logger.debug(`Browser executable: ${binaryPath}`);
    binaryPath$.next(binaryPath); // subscribers wait for download and extract to complete
  };

  backgroundInstall();
  return {
    binaryPath$
  };
}