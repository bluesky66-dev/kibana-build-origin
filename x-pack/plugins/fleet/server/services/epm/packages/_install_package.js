"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._installPackage = _installPackage;

var _common = require("../../../../common");

var _constants = require("../../../constants");

var _types = require("../../../types");

var _install = require("../kibana/index_pattern/install");

var _install2 = require("../elasticsearch/template/install");

var _ingest_pipeline = require("../elasticsearch/ingest_pipeline/");

var _install3 = require("../elasticsearch/ilm/install");

var _install4 = require("../kibana/assets/install");

var _template = require("../elasticsearch/template/template");

var _remove = require("./remove");

var _install5 = require("../elasticsearch/transform/install");

var _install6 = require("./install");

var _install7 = require("../elasticsearch/datastream_ilm/install");

var _storage = require("../archive/storage");

var _errors = require("../../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// this is only exported for testing
// use a leading underscore to indicate it's not the supported path
// only the more explicit `installPackage*` functions should be used


async function _installPackage({
  savedObjectsClient,
  callCluster,
  installedPkg,
  paths,
  packageInfo,
  installType,
  installSource
}) {
  const {
    name: pkgName,
    version: pkgVersion
  } = packageInfo;

  try {
    // if some installation already exists
    if (installedPkg) {
      // if the installation is currently running, don't try to install
      // instead, only return already installed assets
      if (installedPkg.attributes.install_status === 'installing' && Date.now() - Date.parse(installedPkg.attributes.install_started_at) < _common.MAX_TIME_COMPLETE_INSTALL) {
        throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting.`);
      } else {
        // if no installation is running, or the installation has been running longer than MAX_TIME_COMPLETE_INSTALL
        // (it might be stuck) update the saved object and proceed
        await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
          install_version: pkgVersion,
          install_status: 'installing',
          install_started_at: new Date().toISOString(),
          install_source: installSource
        });
      }
    } else {
      await (0, _install6.createInstallation)({
        savedObjectsClient,
        packageInfo,
        installSource
      });
    } // kick off `installIndexPatterns` & `installKibanaAssets` as early as possible because they're the longest running operations
    // we don't `await` here because we don't want to delay starting the many other `install*` functions
    // however, without an `await` or a `.catch` we haven't defined how to handle a promise rejection
    // we define it many lines and potentially seconds of wall clock time later in
    // `await Promise.all([installKibanaAssetsPromise, installIndexPatternPromise]);`
    // if we encounter an error before we there, we'll have an "unhandled rejection" which causes its own problems
    // the program will log something like this _and exit/crash_
    //   Unhandled Promise rejection detected:
    //   RegistryResponseError or some other error
    //   Terminating process...
    //    server crashed  with status code 1
    //
    // add a `.catch` to prevent the "unhandled rejection" case
    // in that `.catch`, set something that indicates a failure
    // check for that failure later and act accordingly (throw, ignore, return)


    let installIndexPatternError;
    const installIndexPatternPromise = (0, _install.installIndexPatterns)(savedObjectsClient, pkgName, pkgVersion, installSource).catch(reason => installIndexPatternError = reason);
    const kibanaAssets = await (0, _install4.getKibanaAssets)(paths);
    if (installedPkg) await (0, _remove.deleteKibanaSavedObjectsAssets)(savedObjectsClient, installedPkg.attributes.installed_kibana); // save new kibana refs before installing the assets

    const installedKibanaAssetsRefs = await (0, _install6.saveKibanaAssetsRefs)(savedObjectsClient, pkgName, kibanaAssets);
    let installKibanaAssetsError;
    const installKibanaAssetsPromise = (0, _install4.installKibanaAssets)({
      savedObjectsClient,
      pkgName,
      kibanaAssets
    }).catch(reason => installKibanaAssetsError = reason); // the rest of the installation must happen in sequential order
    // currently only the base package has an ILM policy
    // at some point ILM policies can be installed/modified
    // per data stream and we should then save them

    await (0, _install3.installILMPolicy)(paths, callCluster);
    const installedDataStreamIlm = await (0, _install7.installIlmForDataStream)(packageInfo, paths, callCluster, savedObjectsClient); // installs versionized pipelines without removing currently installed ones

    const installedPipelines = await (0, _ingest_pipeline.installPipelines)(packageInfo, paths, callCluster, savedObjectsClient); // install or update the templates referencing the newly installed pipelines

    const installedTemplates = await (0, _install2.installTemplates)(packageInfo, callCluster, paths, savedObjectsClient); // update current backing indices of each data stream

    await (0, _template.updateCurrentWriteIndices)(callCluster, installedTemplates);
    const installedTransforms = await (0, _install5.installTransform)(packageInfo, paths, callCluster, savedObjectsClient); // if this is an update or retrying an update, delete the previous version's pipelines

    if ((installType === 'update' || installType === 'reupdate') && installedPkg) {
      await (0, _ingest_pipeline.deletePreviousPipelines)(callCluster, savedObjectsClient, pkgName, installedPkg.attributes.version);
    } // pipelines from a different version may have installed during a failed update


    if (installType === 'rollback' && installedPkg) {
      await (0, _ingest_pipeline.deletePreviousPipelines)(callCluster, savedObjectsClient, pkgName, installedPkg.attributes.install_version);
    }

    const installedTemplateRefs = installedTemplates.map(template => ({
      id: template.templateName,
      type: _types.ElasticsearchAssetType.indexTemplate
    })); // make sure the assets are installed (or didn't error)

    if (installIndexPatternError) throw installIndexPatternError;
    if (installKibanaAssetsError) throw installKibanaAssetsError;
    await Promise.all([installKibanaAssetsPromise, installIndexPatternPromise]);
    const packageAssetResults = await (0, _storage.saveArchiveEntries)({
      savedObjectsClient,
      paths,
      packageInfo,
      installSource
    });
    const packageAssetRefs = packageAssetResults.saved_objects.map(result => ({
      id: result.id,
      type: _common.ASSETS_SAVED_OBJECT_TYPE
    })); // update to newly installed version when all assets are successfully installed

    if (installedPkg) await (0, _install6.updateVersion)(savedObjectsClient, pkgName, pkgVersion);
    await savedObjectsClient.update(_constants.PACKAGES_SAVED_OBJECT_TYPE, pkgName, {
      install_version: pkgVersion,
      install_status: 'installed',
      package_assets: packageAssetRefs
    });
    return [...installedKibanaAssetsRefs, ...installedPipelines, ...installedDataStreamIlm, ...installedTemplateRefs, ...installedTransforms];
  } catch (err) {
    if (savedObjectsClient.errors.isConflictError(err)) {
      throw new _errors.ConcurrentInstallOperationError(`Concurrent installation or upgrade of ${pkgName || 'unknown'}-${pkgVersion || 'unknown'} detected, aborting. Original error: ${err.message}`);
    } else {
      throw err;
    }
  }
}