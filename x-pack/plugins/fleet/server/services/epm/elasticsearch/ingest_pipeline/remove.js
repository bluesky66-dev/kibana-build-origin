"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deletePipeline = deletePipeline;
exports.deletePipelineRefs = exports.deletePreviousPipelines = void 0;

var _ = require("../../../");

var _types = require("../../../../types");

var _errors = require("../../../../errors");

var _get = require("../../packages/get");

var _common = require("../../../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deletePreviousPipelines = async (callCluster, savedObjectsClient, pkgName, previousPkgVersion) => {
  const logger = _.appContextService.getLogger();

  const installation = await (0, _get.getInstallation)({
    savedObjectsClient,
    pkgName
  });
  if (!installation) return;
  const installedEsAssets = installation.installed_es;
  const installedPipelines = installedEsAssets.filter(({
    type,
    id
  }) => type === _types.ElasticsearchAssetType.ingestPipeline && id.includes(previousPkgVersion));
  const deletePipelinePromises = installedPipelines.map(({
    type,
    id
  }) => {
    return deletePipeline(callCluster, id);
  });

  try {
    await Promise.all(deletePipelinePromises);
  } catch (e) {
    logger.error(e);
  }

  try {
    await deletePipelineRefs(savedObjectsClient, installedEsAssets, pkgName, previousPkgVersion);
  } catch (e) {
    logger.error(e);
  }
};

exports.deletePreviousPipelines = deletePreviousPipelines;

const deletePipelineRefs = async (savedObjectsClient, installedEsAssets, pkgName, pkgVersion) => {
  const filteredAssets = installedEsAssets.filter(({
    type,
    id
  }) => {
    if (type !== _types.ElasticsearchAssetType.ingestPipeline) return true;
    if (!id.includes(pkgVersion)) return true;
    return false;
  });
  return savedObjectsClient.update(_common.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
    installed_es: filteredAssets
  });
};

exports.deletePipelineRefs = deletePipelineRefs;

async function deletePipeline(callCluster, id) {
  // '*' shouldn't ever appear here, but it still would delete all ingest pipelines
  if (id && id !== '*') {
    try {
      await callCluster('ingest.deletePipeline', {
        id
      });
    } catch (err) {
      // Only throw if error is not a 404 error. Sometimes the pipeline is already deleted, but we have
      // duplicate references to them, see https://github.com/elastic/kibana/issues/91192
      if (err.statusCode !== 404) {
        throw new _errors.IngestManagerError(`error deleting pipeline ${id}: ${err}`);
      }
    }
  }
}