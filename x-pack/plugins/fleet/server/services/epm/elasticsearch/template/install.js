"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.installTemplateForDataStream = installTemplateForDataStream;
exports.installTemplate = installTemplate;
exports.installTemplates = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _types = require("../../../../types");

var _field = require("../../fields/field");

var _install = require("../ingest_pipeline/install");

var _template = require("./template");

var _archive = require("../../archive");

var _install2 = require("../../packages/install");

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


const installTemplates = async (installablePackage, callCluster, paths, savedObjectsClient) => {
  // install any pre-built index template assets,
  // atm, this is only the base package's global index templates
  // Install component templates first, as they are used by the index templates
  await installPreBuiltComponentTemplates(paths, callCluster);
  await installPreBuiltTemplates(paths, callCluster); // remove package installation's references to index templates

  await (0, _install2.removeAssetsFromInstalledEsByType)(savedObjectsClient, installablePackage.name, _types.ElasticsearchAssetType.indexTemplate); // build templates per data stream from yml files

  const dataStreams = installablePackage.data_streams;
  if (!dataStreams) return []; // get template refs to save

  const installedTemplateRefs = dataStreams.map(dataStream => ({
    id: (0, _template.generateTemplateName)(dataStream),
    type: _types.ElasticsearchAssetType.indexTemplate
  })); // add package installation's references to index templates

  await (0, _install2.saveInstalledEsRefs)(savedObjectsClient, installablePackage.name, installedTemplateRefs);

  if (dataStreams) {
    const installTemplatePromises = dataStreams.reduce((acc, dataStream) => {
      acc.push(installTemplateForDataStream({
        pkg: installablePackage,
        callCluster,
        dataStream
      }));
      return acc;
    }, []);
    const res = await Promise.all(installTemplatePromises);
    const installedTemplates = res.flat();
    return installedTemplates;
  }

  return [];
};

exports.installTemplates = installTemplates;

const installPreBuiltTemplates = async (paths, callCluster) => {
  const templatePaths = paths.filter(path => isTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    let templateAPIPath = '_template'; // v2 index templates need to be installed through the new API endpoint.
    // Checking for 'template' and 'composed_of' should catch them all.
    // For the new v2 format, see https://github.com/elastic/elasticsearch/issues/53101

    if (content.hasOwnProperty('template') || content.hasOwnProperty('composed_of')) {
      templateAPIPath = '_index_template';
    }

    const callClusterParams = {
      method: 'PUT',
      path: `/${templateAPIPath}/${templateName}`,
      ignore: [404],
      body: content
    }; // This uses the catch-all endpoint 'transport.request' because there is no
    // convenience endpoint using the new _index_template API yet.
    // The existing convenience endpoint `indices.putTemplate` only sends to _template,
    // which does not support v2 templates.
    // See src/core/server/elasticsearch/api_types.ts for available endpoints.

    return callCluster('transport.request', callClusterParams);
  });

  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt index templates ${e.message}`, {
      statusCode: 400
    });
  }
};

const installPreBuiltComponentTemplates = async (paths, callCluster) => {
  const templatePaths = paths.filter(path => isComponentTemplate(path));
  const templateInstallPromises = templatePaths.map(async path => {
    const {
      file
    } = (0, _archive.getPathParts)(path);
    const templateName = file.substr(0, file.lastIndexOf('.'));
    const content = JSON.parse((0, _archive.getAsset)(path).toString('utf8'));
    const callClusterParams = {
      method: 'PUT',
      path: `/_component_template/${templateName}`,
      ignore: [404],
      body: content
    }; // This uses the catch-all endpoint 'transport.request' because there is no
    // convenience endpoint for component templates yet.
    // See src/core/server/elasticsearch/api_types.ts for available endpoints.

    return callCluster('transport.request', callClusterParams);
  });

  try {
    return await Promise.all(templateInstallPromises);
  } catch (e) {
    throw new _boom.default.Boom(`Error installing prebuilt component templates ${e.message}`, {
      statusCode: 400
    });
  }
};

const isTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.indexTemplate;
};

const isComponentTemplate = path => {
  const pathParts = (0, _archive.getPathParts)(path);
  return pathParts.type === _types.ElasticsearchAssetType.componentTemplate;
};
/**
 * installTemplateForDataStream installs one template for each data stream
 *
 * The template is currently loaded with the pkgkey-package-data_stream
 */


async function installTemplateForDataStream({
  pkg,
  callCluster,
  dataStream
}) {
  const fields = await (0, _field.loadFieldsFromYaml)(pkg, dataStream.path);
  return installTemplate({
    callCluster,
    fields,
    dataStream,
    packageVersion: pkg.version,
    packageName: pkg.name
  });
}

function putComponentTemplate(body, name, callCluster) {
  if (body) {
    const callClusterParams = {
      method: 'PUT',
      path: `/_component_template/${name}`,
      ignore: [404],
      body
    };
    return {
      clusterPromise: callCluster('transport.request', callClusterParams),
      name
    };
  }
}

function buildComponentTemplates(registryElasticsearch) {
  let mappingsTemplate;
  let settingsTemplate;

  if (registryElasticsearch && registryElasticsearch['index_template.mappings']) {
    mappingsTemplate = {
      template: {
        mappings: { ...registryElasticsearch['index_template.mappings'],
          // temporary change until https://github.com/elastic/elasticsearch/issues/58956 is resolved
          // hopefully we'll be able to remove the entire properties section once that issue is resolved
          properties: {
            // if the timestamp_field changes here: https://github.com/elastic/kibana/blob/master/x-pack/plugins/fleet/server/services/epm/elasticsearch/template/template.ts#L309
            // we'll need to update this as well
            '@timestamp': {
              type: 'date'
            }
          }
        }
      }
    };
  }

  if (registryElasticsearch && registryElasticsearch['index_template.settings']) {
    settingsTemplate = {
      template: {
        settings: registryElasticsearch['index_template.settings']
      }
    };
  }

  return {
    settingsTemplate,
    mappingsTemplate
  };
}

async function installDataStreamComponentTemplates(templateName, registryElasticsearch, callCluster) {
  const templates = [];
  const componentPromises = [];
  const compTemplates = buildComponentTemplates(registryElasticsearch);
  const mappings = putComponentTemplate(compTemplates.mappingsTemplate, `${templateName}-mappings`, callCluster);
  const settings = putComponentTemplate(compTemplates.settingsTemplate, `${templateName}-settings`, callCluster);

  if (mappings) {
    templates.push(mappings.name);
    componentPromises.push(mappings.clusterPromise);
  }

  if (settings) {
    templates.push(settings.name);
    componentPromises.push(settings.clusterPromise);
  } // TODO: Check return values for errors


  await Promise.all(componentPromises);
  return templates;
}

async function installTemplate({
  callCluster,
  fields,
  dataStream,
  packageVersion,
  packageName
}) {
  var _getTemplateRes$index, _existingIndexTemplat, _existingIndexTemplat2;

  const mappings = (0, _template.generateMappings)((0, _field.processFields)(fields));
  const templateName = (0, _template.generateTemplateName)(dataStream);
  const templateIndexPattern = (0, _template.generateTemplateIndexPattern)(dataStream);
  const templatePriority = (0, _template.getTemplatePriority)(dataStream);
  let pipelineName;

  if (dataStream.ingest_pipeline) {
    pipelineName = (0, _install.getPipelineNameForInstallation)({
      pipelineName: dataStream.ingest_pipeline,
      dataStream,
      packageVersion
    });
  } // Datastream now throw an error if the aliases field is present so ensure that we remove that field.


  const getTemplateRes = await callCluster('transport.request', {
    method: 'GET',
    path: `/_index_template/${templateName}`,
    ignore: [404]
  });
  const existingIndexTemplate = getTemplateRes === null || getTemplateRes === void 0 ? void 0 : (_getTemplateRes$index = getTemplateRes.index_templates) === null || _getTemplateRes$index === void 0 ? void 0 : _getTemplateRes$index[0];

  if (existingIndexTemplate && existingIndexTemplate.name === templateName && existingIndexTemplate !== null && existingIndexTemplate !== void 0 && (_existingIndexTemplat = existingIndexTemplate.index_template) !== null && _existingIndexTemplat !== void 0 && (_existingIndexTemplat2 = _existingIndexTemplat.template) !== null && _existingIndexTemplat2 !== void 0 && _existingIndexTemplat2.aliases) {
    const updateIndexTemplateParams = {
      method: 'PUT',
      path: `/_index_template/${templateName}`,
      ignore: [404],
      body: { ...existingIndexTemplate.index_template,
        template: { ...existingIndexTemplate.index_template.template,
          // Remove the aliases field
          aliases: undefined
        }
      }
    }; // This uses the catch-all endpoint 'transport.request' because there is no
    // convenience endpoint using the new _index_template API yet.
    // The existing convenience endpoint `indices.putTemplate` only sends to _template,
    // which does not support v2 templates.
    // See src/core/server/elasticsearch/api_types.ts for available endpoints.

    await callCluster('transport.request', updateIndexTemplateParams);
  }

  const composedOfTemplates = await installDataStreamComponentTemplates(templateName, dataStream.elasticsearch, callCluster);
  const template = (0, _template.getTemplate)({
    type: dataStream.type,
    templateIndexPattern,
    mappings,
    pipelineName,
    packageName,
    composedOfTemplates,
    templatePriority,
    ilmPolicy: dataStream.ilm_policy,
    hidden: dataStream.hidden
  }); // TODO: Check return values for errors

  const callClusterParams = {
    method: 'PUT',
    path: `/_index_template/${templateName}`,
    ignore: [404],
    body: template
  }; // This uses the catch-all endpoint 'transport.request' because there is no
  // convenience endpoint using the new _index_template API yet.
  // The existing convenience endpoint `indices.putTemplate` only sends to _template,
  // which does not support v2 templates.
  // See src/core/server/elasticsearch/api_types.ts for available endpoints.

  await callCluster('transport.request', callClusterParams);
  return {
    templateName,
    indexTemplate: template
  };
}