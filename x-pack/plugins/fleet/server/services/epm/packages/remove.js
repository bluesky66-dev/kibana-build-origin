"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeInstallation = removeInstallation;
exports.deleteKibanaSavedObjectsAssets = deleteKibanaSavedObjectsAssets;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _constants = require("../../../constants");

var _types = require("../../../types");

var _index = require("./index");

var _ingest_pipeline = require("../elasticsearch/ingest_pipeline/");

var _install = require("../kibana/index_pattern/install");

var _remove = require("../elasticsearch/transform/remove");

var _ = require("../..");

var _registry = require("../registry");

var _archive = require("../archive");

var _remove2 = require("../elasticsearch/datastream_ilm/remove");

var _storage = require("../archive/storage");

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


async function removeInstallation(options) {
  const {
    savedObjectsClient,
    pkgkey,
    callCluster
  } = options; // TODO:  the epm api should change to /name/version so we don't need to do this

  const {
    pkgName,
    pkgVersion
  } = (0, _registry.splitPkgKey)(pkgkey);
  const installation = await (0, _index.getInstallation)({
    savedObjectsClient,
    pkgName
  });
  if (!installation) throw _boom.default.badRequest(`${pkgName} is not installed`);
  if (installation.removable === false) throw _boom.default.badRequest(`${pkgName} is installed by default and cannot be removed`);
  const {
    total
  } = await _.packagePolicyService.list(savedObjectsClient, {
    kuery: `${_constants.PACKAGE_POLICY_SAVED_OBJECT_TYPE}.package.name:${pkgName}`,
    page: 0,
    perPage: 0
  });
  if (total > 0) throw _boom.default.badRequest(`unable to remove package with existing package policy(s) in use by agent(s)`); // Delete the installed assets. Don't include installation.package_assets. Those are irrelevant to users

  const installedAssets = [...installation.installed_kibana, ...installation.installed_es];
  await deleteAssets(installation, savedObjectsClient, callCluster); // Delete the manager saved object with references to the asset objects
  // could also update with [] or some other state

  await savedObjectsClient.delete(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName); // recreate or delete index patterns when a package is uninstalled
  // this must be done after deleting the saved object for the current package otherwise it will retrieve the package
  // from the registry again and reinstall the index patterns

  await (0, _install.installIndexPatterns)(savedObjectsClient); // remove the package archive and its contents from the cache so that a reinstall fetches
  // a fresh copy from the registry

  (0, _archive.deletePackageCache)({
    name: pkgName,
    version: pkgVersion
  });
  await (0, _storage.removeArchiveEntries)({
    savedObjectsClient,
    refs: installation.package_assets
  }); // successful delete's in SO client return {}. return something more useful

  return installedAssets;
}

function deleteKibanaAssets(installedObjects, savedObjectsClient) {
  return installedObjects.map(async ({
    id,
    type
  }) => {
    return savedObjectsClient.delete(type, id);
  });
}

function deleteESAssets(installedObjects, callCluster) {
  return installedObjects.map(async ({
    id,
    type
  }) => {
    const assetType = type;

    if (assetType === _types.ElasticsearchAssetType.ingestPipeline) {
      return (0, _ingest_pipeline.deletePipeline)(callCluster, id);
    } else if (assetType === _types.ElasticsearchAssetType.indexTemplate) {
      return deleteTemplate(callCluster, id);
    } else if (assetType === _types.ElasticsearchAssetType.transform) {
      return (0, _remove.deleteTransforms)(callCluster, [id]);
    } else if (assetType === _types.ElasticsearchAssetType.dataStreamIlmPolicy) {
      return (0, _remove2.deleteIlms)(callCluster, [id]);
    }
  });
}

async function deleteAssets({
  installed_es: installedEs,
  installed_kibana: installedKibana
}, savedObjectsClient, callCluster) {
  const logger = _.appContextService.getLogger();

  const deletePromises = [...deleteESAssets(installedEs, callCluster), ...deleteKibanaAssets(installedKibana, savedObjectsClient)];

  try {
    await Promise.all(deletePromises);
  } catch (err) {
    // in the rollback case, partial installs are likely, so missing assets are not an error
    if (!savedObjectsClient.errors.isNotFoundError(err)) {
      logger.error(err);
    }
  }
}

async function deleteTemplate(callCluster, name) {
  // '*' shouldn't ever appear here, but it still would delete all templates
  if (name && name !== '*') {
    try {
      const callClusterParams = {
        method: 'DELETE',
        path: `/_index_template/${name}`,
        ignore: [404]
      }; // This uses the catch-all endpoint 'transport.request' because there is no
      // convenience endpoint using the new _index_template API yet.
      // The existing convenience endpoint `indices.putTemplate` only sends to _template,
      // which does not support v2 templates.
      // See src/core/server/elasticsearch/api_types.ts for available endpoints.

      await callCluster('transport.request', callClusterParams);
    } catch {
      throw new Error(`error deleting template ${name}`);
    }
  }
}

async function deleteKibanaSavedObjectsAssets(savedObjectsClient, installedRefs) {
  if (!installedRefs.length) return;

  const logger = _.appContextService.getLogger();

  const deletePromises = installedRefs.map(({
    id,
    type
  }) => {
    const assetType = type;

    if (_index.savedObjectTypes.includes(assetType)) {
      return savedObjectsClient.delete(assetType, id);
    }
  });

  try {
    await Promise.all(deletePromises);
  } catch (err) {
    logger.warn(err);
  }
}