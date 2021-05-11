"use strict";

var _lodash = require("lodash");

var _elasticsearch = require("@elastic/elasticsearch");

var _yargs = require("yargs");

var _unwrap_es_response = require("../../../observability/server/utils/unwrap_es_response");

var _downloadTelemetryTemplate = require("../shared/download-telemetry-template");

var _apm_telemetry = require("../../common/apm_telemetry");

var _generateSampleDocuments = require("./generate-sample-documents");

var _readKibanaConfig = require("../shared/read-kibana-config");

var _getHttpAuth = require("../shared/get-http-auth");

var _createOrUpdateIndex = require("../shared/create-or-update-index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// This script downloads the telemetry mapping, runs the APM telemetry tasks,
// generates a bunch of randomized data based on the downloaded sample,
// and uploads it to a cluster of your choosing in the same format as it is
// stored in the telemetry cluster. Its purpose is twofold:
// - Easier testing of the telemetry tasks
// - Validate whether we can run the queries we want to on the telemetry data
// eslint-disable-next-line @kbn/eslint/no-restricted-paths


async function uploadData() {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    throw new Error('GITHUB_TOKEN was not provided.');
  }

  const xpackTelemetryIndexName = 'xpack-phone-home';
  const telemetryTemplate = await (0, _downloadTelemetryTemplate.downloadTelemetryTemplate)({
    githubToken
  });
  const config = (0, _readKibanaConfig.readKibanaConfig)();
  const httpAuth = (0, _getHttpAuth.getHttpAuth)(config);
  const client = new _elasticsearch.Client({
    nodes: [config['elasticsearch.hosts']],
    ...(httpAuth ? {
      auth: { ...httpAuth,
        username: 'elastic'
      }
    } : {})
  }); // The new template is the template downloaded from the telemetry repo, with
  // our current telemetry mapping merged in, with the "index_patterns" key
  // (which cannot be used when creating an index) removed.

  const newTemplate = (0, _lodash.omit)((0, _apm_telemetry.mergeApmTelemetryMapping)((0, _lodash.merge)(telemetryTemplate, {
    index_patterns: undefined,
    settings: {
      index: {
        mapping: {
          total_fields: {
            limit: 10000
          }
        }
      }
    }
  })), 'index_patterns');
  await (0, _createOrUpdateIndex.createOrUpdateIndex)({
    indexName: xpackTelemetryIndexName,
    client,
    template: newTemplate,
    clear: !!_yargs.argv.clear
  });
  const sampleDocuments = await (0, _generateSampleDocuments.generateSampleDocuments)({
    collectTelemetryParams: {
      logger: console,
      indices: { ...config,
        apmCustomLinkIndex: '.apm-custom-links',
        apmAgentConfigurationIndex: '.apm-agent-configuration'
      },
      search: body => {
        return (0, _unwrap_es_response.unwrapEsResponse)(client.search(body));
      },
      indicesStats: body => {
        return (0, _unwrap_es_response.unwrapEsResponse)(client.indices.stats(body));
      },
      transportRequest: params => {
        return (0, _unwrap_es_response.unwrapEsResponse)(client.transport.request({
          method: params.method,
          path: params.path
        }));
      }
    }
  });
  const chunks = (0, _lodash.chunk)(sampleDocuments, 250);
  await chunks.reduce((prev, documents) => {
    return prev.then(async () => {
      const body = (0, _lodash.flatten)(documents.map(doc => [{
        index: {
          _index: xpackTelemetryIndexName
        }
      }, doc]));
      return client.bulk({
        body,
        refresh: 'wait_for'
      }).then(response => {
        if (response.errors) {
          const firstError = response.items.filter(item => item.index.status >= 400)[0].index.error;
          throw new Error(`Failed to upload documents: ${firstError.reason} `);
        }
      });
    });
  }, Promise.resolve());
}

uploadData().catch(e => {
  if ('response' in e) {
    if (typeof e.response === 'string') {
      // eslint-disable-next-line no-console
      console.log(e.response);
    } else {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(e.response, ['status', 'statusText', 'headers', 'data'], 2));
    }
  } else {
    // eslint-disable-next-line no-console
    console.log(e);
  }

  process.exit(1);
}).then(() => {
  // eslint-disable-next-line no-console
  console.log('Finished uploading generated telemetry data');
});