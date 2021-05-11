"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rewriteIngestPipeline = rewriteIngestPipeline;
exports.installPipelinesForDataStream = installPipelinesForDataStream;
exports.getPipelineNameForInstallation = exports.installPipelines = void 0;

var _types = require("../../../../types");

var _archive = require("../../archive");

var _install = require("../../packages/install");

var _packages = require("../../packages");

var _remove = require("./remove");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const installPipelines = async (installablePackage, paths, callCluster, savedObjectsClient) => {
  // unlike other ES assets, pipeline names are versioned so after a template is updated
  // it can be created pointing to the new template, without removing the old one and effecting data
  // so do not remove the currently installed pipelines here
  const dataStreams = installablePackage.data_streams;
  const {
    name: pkgName,
    version: pkgVersion
  } = installablePackage;
  if (!(dataStreams !== null && dataStreams !== void 0 && dataStreams.length)) return [];
  const pipelinePaths = paths.filter(path => isPipeline(path)); // get and save pipeline refs before installing pipelines

  const pipelineRefs = dataStreams.reduce((acc, dataStream) => {
    const filteredPaths = pipelinePaths.filter(path => isDataStreamPipeline(path, dataStream.path));
    const pipelineObjectRefs = filteredPaths.map(path => {
      const {
        name
      } = getNameAndExtension(path);
      const nameForInstallation = getPipelineNameForInstallation({
        pipelineName: name,
        dataStream,
        packageVersion: installablePackage.version
      });
      return {
        id: nameForInstallation,
        type: _types.ElasticsearchAssetType.ingestPipeline
      };
    });
    acc.push(...pipelineObjectRefs);
    return acc;
  }, []); // check that we don't duplicate the pipeline refs if the user is reinstalling

  const installedPkg = await (0, _packages.getInstallationObject)({
    savedObjectsClient,
    pkgName
  });
  if (!installedPkg) throw new Error("integration wasn't found while installing pipelines"); // remove the current pipeline refs, if any exist, associated with this version before saving new ones so no duplicates occur

  await (0, _remove.deletePipelineRefs)(savedObjectsClient, installedPkg.attributes.installed_es, pkgName, pkgVersion);
  await (0, _install.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, pipelineRefs);
  const pipelines = dataStreams.reduce((acc, dataStream) => {
    if (dataStream.ingest_pipeline) {
      acc.push(installPipelinesForDataStream({
        dataStream,
        callCluster,
        paths: pipelinePaths,
        pkgVersion: installablePackage.version
      }));
    }

    return acc;
  }, []);
  return await Promise.all(pipelines).then(results => results.flat());
};

exports.installPipelines = installPipelines;

function rewriteIngestPipeline(pipeline, substitutions) {
  substitutions.forEach(sub => {
    const {
      source,
      target,
      templateFunction
    } = sub; // This fakes the use of the golang text/template expression {{SomeTemplateFunction 'some-param'}}
    // cf. https://github.com/elastic/beats/blob/master/filebeat/fileset/fileset.go#L294
    // "Standard style" uses '{{' and '}}' as delimiters

    const matchStandardStyle = `{{\\s?${templateFunction}\\s+['"]${source}['"]\\s?}}`; // "Beats style" uses '{<' and '>}' as delimiters because this is current practice in the beats project

    const matchBeatsStyle = `{<\\s?${templateFunction}\\s+['"]${source}['"]\\s?>}`;
    const regexStandardStyle = new RegExp(matchStandardStyle);
    const regexBeatsStyle = new RegExp(matchBeatsStyle);
    pipeline = pipeline.replace(regexStandardStyle, target).replace(regexBeatsStyle, target);
  });
  return pipeline;
}

async function installPipelinesForDataStream({
  callCluster,
  pkgVersion,
  paths,
  dataStream
}) {
  const pipelinePaths = paths.filter(path => isDataStreamPipeline(path, dataStream.path));
  let pipelines = [];
  const substitutions = [];
  pipelinePaths.forEach(path => {
    const {
      name,
      extension
    } = getNameAndExtension(path);
    const nameForInstallation = getPipelineNameForInstallation({
      pipelineName: name,
      dataStream,
      packageVersion: pkgVersion
    });
    const content = (0, _archive.getAsset)(path).toString('utf-8');
    pipelines.push({
      name,
      nameForInstallation,
      content,
      extension
    });
    substitutions.push({
      source: name,
      target: nameForInstallation,
      templateFunction: 'IngestPipeline'
    });
  });
  pipelines = pipelines.map(pipeline => {
    return { ...pipeline,
      contentForInstallation: rewriteIngestPipeline(pipeline.content, substitutions)
    };
  });
  const installationPromises = pipelines.map(async pipeline => {
    return installPipeline({
      callCluster,
      pipeline
    });
  });
  return Promise.all(installationPromises);
}

async function installPipeline({
  callCluster,
  pipeline
}) {
  const callClusterParams = {
    method: 'PUT',
    path: `/_ingest/pipeline/${pipeline.nameForInstallation}`,
    ignore: [404],
    body: pipeline.contentForInstallation
  };

  if (pipeline.extension === 'yml') {
    callClusterParams.headers = {
      // pipeline is YAML
      'Content-Type': 'application/yaml',
      // but we want JSON responses (to extract error messages, status code, or other metadata)
      Accept: 'application/json'
    };
  } // This uses the catch-all endpoint 'transport.request' because we have to explicitly
  // set the Content-Type header above for sending yml data. Setting the headers is not
  // exposed in the convenience endpoint 'ingest.putPipeline' of elasticsearch-js-legacy
  // which we could otherwise use.
  // See src/core/server/elasticsearch/api_types.ts for available endpoints.


  await callCluster('transport.request', callClusterParams);
  return {
    id: pipeline.nameForInstallation,
    type: _types.ElasticsearchAssetType.ingestPipeline
  };
}

const isDirectory = ({
  path
}) => path.endsWith('/');

const isDataStreamPipeline = (path, dataStreamDataset) => {
  const pathParts = (0, _archive.getPathParts)(path);
  return !isDirectory({
    path
  }) && pathParts.type === _types.ElasticsearchAssetType.ingestPipeline && pathParts.dataset !== undefined && dataStreamDataset === pathParts.dataset;
};

const isPipeline = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.ingestPipeline;
}; // XXX: assumes path/to/file.ext -- 0..n '/' and exactly one '.'


const getNameAndExtension = path => {
  const splitPath = path.split('/');
  const filename = splitPath[splitPath.length - 1];
  return {
    name: filename.split('.')[0],
    extension: filename.split('.')[1]
  };
};

const getPipelineNameForInstallation = ({
  pipelineName,
  dataStream,
  packageVersion
}) => {
  const isPipelineEntry = pipelineName === dataStream.ingest_pipeline;
  const suffix = isPipelineEntry ? '' : `-${pipelineName}`; // if this is the pipeline entry, don't add a suffix

  return `${dataStream.type}-${dataStream.dataset}-${packageVersion}${suffix}`;
};

exports.getPipelineNameForInstallation = getPipelineNameForInstallation;