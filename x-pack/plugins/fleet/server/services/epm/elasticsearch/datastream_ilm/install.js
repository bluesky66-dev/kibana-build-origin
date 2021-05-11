"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installIlmForDataStream = void 0;

var _models = require("../../../../../common/types/models");

var _packages = require("../../packages");

var _remove = require("./remove");

var _install = require("../../packages/install");

var _common = require("../transform/common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installIlmForDataStream = async (registryPackage, paths, callCluster, savedObjectsClient) => {
  const installation = await (0, _packages.getInstallation)({
    savedObjectsClient,
    pkgName: registryPackage.name
  });
  let previousInstalledIlmEsAssets = [];

  if (installation) {
    previousInstalledIlmEsAssets = installation.installed_es.filter(({
      type,
      id
    }) => type === _models.ElasticsearchAssetType.dataStreamIlmPolicy);
  } // delete all previous ilm


  await (0, _remove.deleteIlms)(callCluster, previousInstalledIlmEsAssets.map(asset => asset.id)); // install the latest dataset

  const dataStreams = registryPackage.data_streams;
  if (!(dataStreams !== null && dataStreams !== void 0 && dataStreams.length)) return [];
  const dataStreamIlmPaths = paths.filter(path => isDataStreamIlm(path));
  let installedIlms = [];

  if (dataStreamIlmPaths.length > 0) {
    const ilmPathDatasets = dataStreams.reduce((acc, dataStream) => {
      dataStreamIlmPaths.forEach(path => {
        if (isDatasetIlm(path, dataStream.path)) {
          acc.push({
            path,
            dataStream
          });
        }
      });
      return acc;
    }, []);
    const ilmRefs = ilmPathDatasets.reduce((acc, ilmPathDataset) => {
      if (ilmPathDataset) {
        acc.push({
          id: getIlmNameForInstallation(ilmPathDataset),
          type: _models.ElasticsearchAssetType.dataStreamIlmPolicy
        });
      }

      return acc;
    }, []);
    await (0, _install.saveInstalledEsRefs)(savedObjectsClient, registryPackage.name, ilmRefs);
    const ilmInstallations = ilmPathDatasets.map(ilmPathDataset => {
      return {
        installationName: getIlmNameForInstallation(ilmPathDataset),
        content: (0, _common.getAsset)(ilmPathDataset.path).toString('utf-8')
      };
    });
    const installationPromises = ilmInstallations.map(async ilmInstallation => {
      return handleIlmInstall({
        callCluster,
        ilmInstallation
      });
    });
    installedIlms = await Promise.all(installationPromises).then(results => results.flat());
  }

  if (previousInstalledIlmEsAssets.length > 0) {
    const currentInstallation = await (0, _packages.getInstallation)({
      savedObjectsClient,
      pkgName: registryPackage.name
    }); // remove the saved object reference

    await (0, _remove.deleteIlmRefs)(savedObjectsClient, (currentInstallation === null || currentInstallation === void 0 ? void 0 : currentInstallation.installed_es) || [], registryPackage.name, previousInstalledIlmEsAssets.map(asset => asset.id), installedIlms.map(installed => installed.id));
  }

  return installedIlms;
};

exports.installIlmForDataStream = installIlmForDataStream;

async function handleIlmInstall({
  callCluster,
  ilmInstallation
}) {
  await callCluster('transport.request', {
    method: 'PUT',
    path: `/_ilm/policy/${ilmInstallation.installationName}`,
    body: ilmInstallation.content
  });
  return {
    id: ilmInstallation.installationName,
    type: _models.ElasticsearchAssetType.dataStreamIlmPolicy
  };
}

const isDataStreamIlm = path => {
  return new RegExp('(?<package>.*)/data_stream/(?<dataset>.*)/elasticsearch/ilm/*.*').test(path);
};

const isDatasetIlm = (path, datasetName) => {
  return new RegExp(`(?<package>.*)/data_stream\\/${datasetName}/elasticsearch/ilm/*.*`).test(path);
};

const getIlmNameForInstallation = ilmPathDataset => {
  var _ilmPathDataset$path$, _ilmPathDataset$path$2;

  const filename = ilmPathDataset === null || ilmPathDataset === void 0 ? void 0 : (_ilmPathDataset$path$ = ilmPathDataset.path.split('/')) === null || _ilmPathDataset$path$ === void 0 ? void 0 : (_ilmPathDataset$path$2 = _ilmPathDataset$path$.pop()) === null || _ilmPathDataset$path$2 === void 0 ? void 0 : _ilmPathDataset$path$2.split('.')[0];
  return `${ilmPathDataset.dataStream.type}-${ilmPathDataset.dataStream.package}.${ilmPathDataset.dataStream.path}-${filename}`;
};