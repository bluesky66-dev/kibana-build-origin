"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeletePackageRequestSchema = exports.InstallPackageByUploadRequestSchema = exports.BulkUpgradePackagesFromRegistryRequestSchema = exports.InstallPackageFromRegistryRequestSchema = exports.GetStatsRequestSchema = exports.GetInfoRequestSchema = exports.GetFileRequestSchema = exports.GetPackagesRequestSchema = exports.GetCategoriesRequestSchema = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const GetCategoriesRequestSchema = {
  query: _configSchema.schema.object({
    experimental: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.GetCategoriesRequestSchema = GetCategoriesRequestSchema;
const GetPackagesRequestSchema = {
  query: _configSchema.schema.object({
    category: _configSchema.schema.maybe(_configSchema.schema.string()),
    experimental: _configSchema.schema.maybe(_configSchema.schema.boolean())
  })
};
exports.GetPackagesRequestSchema = GetPackagesRequestSchema;
const GetFileRequestSchema = {
  params: _configSchema.schema.object({
    pkgName: _configSchema.schema.string(),
    pkgVersion: _configSchema.schema.string(),
    filePath: _configSchema.schema.string()
  })
};
exports.GetFileRequestSchema = GetFileRequestSchema;
const GetInfoRequestSchema = {
  params: _configSchema.schema.object({
    pkgkey: _configSchema.schema.string()
  })
};
exports.GetInfoRequestSchema = GetInfoRequestSchema;
const GetStatsRequestSchema = {
  params: _configSchema.schema.object({
    pkgName: _configSchema.schema.string()
  })
};
exports.GetStatsRequestSchema = GetStatsRequestSchema;
const InstallPackageFromRegistryRequestSchema = {
  params: _configSchema.schema.object({
    pkgkey: _configSchema.schema.string()
  }),
  body: _configSchema.schema.nullable(_configSchema.schema.object({
    force: _configSchema.schema.boolean()
  }))
};
exports.InstallPackageFromRegistryRequestSchema = InstallPackageFromRegistryRequestSchema;
const BulkUpgradePackagesFromRegistryRequestSchema = {
  body: _configSchema.schema.object({
    packages: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    })
  })
};
exports.BulkUpgradePackagesFromRegistryRequestSchema = BulkUpgradePackagesFromRegistryRequestSchema;
const InstallPackageByUploadRequestSchema = {
  body: _configSchema.schema.buffer()
};
exports.InstallPackageByUploadRequestSchema = InstallPackageByUploadRequestSchema;
const DeletePackageRequestSchema = {
  params: _configSchema.schema.object({
    pkgkey: _configSchema.schema.string()
  })
};
exports.DeletePackageRequestSchema = DeletePackageRequestSchema;