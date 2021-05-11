"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePackageHandler = exports.installPackageByUploadHandler = exports.bulkInstallPackagesFromRegistryHandler = exports.installPackageFromRegistryHandler = exports.getStatsHandler = exports.getInfoHandler = exports.getFileHandler = exports.getLimitedListHandler = exports.getListHandler = exports.getCategoriesHandler = void 0;

var _mimeTypes = _interopRequireDefault(require("mime-types"));

var _path = _interopRequireDefault(require("path"));

var _packages = require("../../services/epm/packages");

var _errors = require("../../errors");

var _registry = require("../../services/epm/registry");

var _services = require("../../services");

var _cache = require("../../services/epm/archive/cache");

var _storage = require("../../services/epm/archive/storage");

var _get = require("../../services/epm/packages/get");

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


const getCategoriesHandler = async (context, request, response) => {
  try {
    const res = await (0, _packages.getCategories)(request.query);
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getCategoriesHandler = getCategoriesHandler;

const getListHandler = async (context, request, response) => {
  try {
    const savedObjectsClient = context.core.savedObjects.client;
    const res = await (0, _packages.getPackages)({
      savedObjectsClient,
      ...request.query
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getListHandler = getListHandler;

const getLimitedListHandler = async (context, request, response) => {
  try {
    const savedObjectsClient = context.core.savedObjects.client;
    const res = await (0, _packages.getLimitedPackages)({
      savedObjectsClient
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getLimitedListHandler = getLimitedListHandler;

const getFileHandler = async (context, request, response) => {
  try {
    const {
      pkgName,
      pkgVersion,
      filePath
    } = request.params;
    const savedObjectsClient = context.core.savedObjects.client;
    const installation = await (0, _packages.getInstallation)({
      savedObjectsClient,
      pkgName
    });
    const useLocalFile = pkgVersion === (installation === null || installation === void 0 ? void 0 : installation.version);

    if (useLocalFile) {
      const assetPath = `${pkgName}-${pkgVersion}/${filePath}`;
      const fileBuffer = (0, _cache.getArchiveEntry)(assetPath); // only pull local installation if we don't have it cached

      const storedAsset = !fileBuffer && (await (0, _storage.getAsset)({
        savedObjectsClient,
        path: assetPath
      })); // error, if neither is available

      if (!fileBuffer && !storedAsset) {
        return response.custom({
          body: `installed package file not found: ${filePath}`,
          statusCode: 404
        });
      } // if storedAsset is not available, fileBuffer *must* be
      // b/c we error if we don't have at least one, and storedAsset is the least likely


      const {
        buffer,
        contentType
      } = storedAsset ? {
        contentType: storedAsset.media_type,
        buffer: storedAsset.data_utf8 ? Buffer.from(storedAsset.data_utf8, 'utf8') : Buffer.from(storedAsset.data_base64, 'base64')
      } : {
        contentType: _mimeTypes.default.contentType(_path.default.extname(assetPath)),
        buffer: fileBuffer
      };

      if (!contentType) {
        return response.custom({
          body: `unknown content type for file: ${filePath}`,
          statusCode: 400
        });
      }

      return response.custom({
        body: buffer,
        statusCode: 200,
        headers: {
          'cache-control': 'max-age=10, public',
          'content-type': contentType
        }
      });
    } else {
      const registryResponse = await (0, _packages.getFile)(pkgName, pkgVersion, filePath);
      const headersToProxy = ['content-type', 'cache-control'];
      const proxiedHeaders = headersToProxy.reduce((headers, knownHeader) => {
        const value = registryResponse.headers.get(knownHeader);

        if (value !== null) {
          headers[knownHeader] = value;
        }

        return headers;
      }, {});
      return response.custom({
        body: registryResponse.body,
        statusCode: registryResponse.status,
        headers: proxiedHeaders
      });
    }
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getFileHandler = getFileHandler;

const getInfoHandler = async (context, request, response) => {
  try {
    const {
      pkgkey
    } = request.params;
    const savedObjectsClient = context.core.savedObjects.client; // TODO: change epm API to /packageName/version so we don't need to do this

    const {
      pkgName,
      pkgVersion
    } = (0, _registry.splitPkgKey)(pkgkey);
    const res = await (0, _packages.getPackageInfo)({
      savedObjectsClient,
      pkgName,
      pkgVersion
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getInfoHandler = getInfoHandler;

const getStatsHandler = async (context, request, response) => {
  try {
    const {
      pkgName
    } = request.params;
    const savedObjectsClient = context.core.savedObjects.client;
    const body = {
      response: await (0, _get.getPackageUsageStats)({
        savedObjectsClient,
        pkgName
      })
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getStatsHandler = getStatsHandler;

const installPackageFromRegistryHandler = async (context, request, response) => {
  const savedObjectsClient = context.core.savedObjects.client;
  const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
  const {
    pkgkey
  } = request.params;
  const {
    pkgName,
    pkgVersion
  } = (0, _registry.splitPkgKey)(pkgkey);
  const installedPkg = await (0, _packages.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });

  try {
    var _request$body;

    const res = await (0, _packages.installPackage)({
      installSource: 'registry',
      savedObjectsClient,
      pkgkey,
      callCluster,
      force: (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.force
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (e) {
    const defaultResult = await (0, _errors.defaultIngestErrorHandler)({
      error: e,
      response
    });
    await (0, _packages.handleInstallPackageFailure)({
      savedObjectsClient,
      error: e,
      pkgName,
      pkgVersion,
      installedPkg,
      callCluster
    });
    return defaultResult;
  }
};

exports.installPackageFromRegistryHandler = installPackageFromRegistryHandler;

const bulkInstallServiceResponseToHttpEntry = result => {
  if ((0, _packages.isBulkInstallError)(result)) {
    const {
      statusCode,
      body
    } = (0, _errors.ingestErrorToResponseOptions)(result.error);
    return {
      name: result.name,
      statusCode,
      error: body.message
    };
  } else {
    return result;
  }
};

const bulkInstallPackagesFromRegistryHandler = async (context, request, response) => {
  const savedObjectsClient = context.core.savedObjects.client;
  const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
  const bulkInstalledResponses = await (0, _packages.bulkInstallPackages)({
    savedObjectsClient,
    callCluster,
    packagesToUpgrade: request.body.packages
  });
  const payload = bulkInstalledResponses.map(bulkInstallServiceResponseToHttpEntry);
  const body = {
    response: payload
  };
  return response.ok({
    body
  });
};

exports.bulkInstallPackagesFromRegistryHandler = bulkInstallPackagesFromRegistryHandler;

const installPackageByUploadHandler = async (context, request, response) => {
  if (!_services.licenseService.isEnterprise()) {
    return response.customError({
      statusCode: 403,
      body: {
        message: 'Requires Enterprise license'
      }
    });
  }

  const savedObjectsClient = context.core.savedObjects.client;
  const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
  const contentType = request.headers['content-type']; // from types it could also be string[] or undefined but this is checked later

  const archiveBuffer = Buffer.from(request.body);

  try {
    const res = await (0, _packages.installPackage)({
      installSource: 'upload',
      savedObjectsClient,
      callCluster,
      archiveBuffer,
      contentType
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.installPackageByUploadHandler = installPackageByUploadHandler;

const deletePackageHandler = async (context, request, response) => {
  try {
    const {
      pkgkey
    } = request.params;
    const savedObjectsClient = context.core.savedObjects.client;
    const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
    const res = await (0, _packages.removeInstallation)({
      savedObjectsClient,
      pkgkey,
      callCluster
    });
    const body = {
      response: res
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.deletePackageHandler = deletePackageHandler;