"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _handlers = require("./handlers");

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const MAX_FILE_SIZE_BYTES = 104857600; // 100MB

const registerRoutes = router => {
  router.get({
    path: _constants.EPM_API_ROUTES.CATEGORIES_PATTERN,
    validate: _types.GetCategoriesRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getCategoriesHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.LIST_PATTERN,
    validate: _types.GetPackagesRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getListHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.LIMITED_LIST_PATTERN,
    validate: false,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}`]
    }
  }, _handlers.getLimitedListHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.STATS_PATTERN,
    validate: _types.GetStatsRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}`]
    }
  }, _handlers.getStatsHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.FILEPATH_PATTERN,
    validate: _types.GetFileRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getFileHandler);
  router.get({
    path: _constants.EPM_API_ROUTES.INFO_PATTERN,
    validate: _types.GetInfoRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getInfoHandler);
  router.post({
    path: _constants.EPM_API_ROUTES.INSTALL_FROM_REGISTRY_PATTERN,
    validate: _types.InstallPackageFromRegistryRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.installPackageFromRegistryHandler);
  router.post({
    path: _constants.EPM_API_ROUTES.BULK_INSTALL_PATTERN,
    validate: _types.BulkUpgradePackagesFromRegistryRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.bulkInstallPackagesFromRegistryHandler);
  router.post({
    path: _constants.EPM_API_ROUTES.INSTALL_BY_UPLOAD_PATTERN,
    validate: _types.InstallPackageByUploadRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`],
      body: {
        accepts: ['application/gzip', 'application/zip'],
        parse: false,
        maxBytes: MAX_FILE_SIZE_BYTES
      }
    }
  }, _handlers.installPackageByUploadHandler);
  router.delete({
    path: _constants.EPM_API_ROUTES.DELETE_PATTERN,
    validate: _types.DeletePackageRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.deletePackageHandler);
};

exports.registerRoutes = registerRoutes;