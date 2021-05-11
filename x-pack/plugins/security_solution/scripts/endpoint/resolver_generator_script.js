"use strict";

var _yargs = _interopRequireDefault(require("yargs"));

var _fs = _interopRequireDefault(require("fs"));

var _elasticsearch = require("@elastic/elasticsearch");

var _errors = require("@elastic/elasticsearch/lib/errors");

var _devUtils = require("@kbn/dev-utils");

var _index_data = require("../../common/endpoint/index_data");

var _generate_data = require("../../common/endpoint/generate_data");

var _constants = require("../../../fleet/common/constants");

var _kbn_client_with_api_key_support = require("./kbn_client_with_api_key_support");

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

/* eslint-disable no-console */


main();

async function deleteIndices(indices, client) {
  const handleErr = err => {
    if (err instanceof _errors.ResponseError && err.statusCode !== 404) {
      console.log(JSON.stringify(err, null, 2)); // eslint-disable-next-line no-process-exit

      process.exit(1);
    }
  };

  for (const index of indices) {
    try {
      // The index could be a data stream so let's try deleting that first
      // The ES client in Kibana doesn't support data streams yet so we need to make a raw request to the ES route
      await client.transport.request({
        method: 'DELETE',
        path: `_data_stream/${index}`
      });
    } catch (err) {
      handleErr(err);
    }
  }
}

async function doIngestSetup(kbnClient) {
  // Setup Ingest
  try {
    const setupResponse = await kbnClient.request({
      path: _constants.SETUP_API_ROUTE,
      method: 'POST'
    });

    if (!setupResponse.data.isInitialized) {
      console.error(setupResponse.data);
      throw new Error('Initializing the ingest manager failed, existing');
    }
  } catch (error) {
    console.error(error);
    throw error;
  } // Setup Fleet


  try {
    const setupResponse = await kbnClient.request({
      path: _constants.AGENTS_SETUP_API_ROUTES.CREATE_PATTERN,
      method: 'POST'
    });

    if (!setupResponse.data.isInitialized) {
      console.error(setupResponse.data);
      throw new Error('Initializing Fleet failed, existing');
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function main() {
  const argv = _yargs.default.help().options({
    seed: {
      alias: 's',
      describe: 'random seed to use for document generator',
      type: 'string'
    },
    node: {
      alias: 'n',
      describe: 'elasticsearch node url',
      default: 'http://elastic:changeme@localhost:9200',
      type: 'string'
    },
    kibana: {
      alias: 'k',
      describe: 'kibana url',
      default: 'http://elastic:changeme@localhost:5601',
      type: 'string'
    },
    eventIndex: {
      alias: 'ei',
      describe: 'index to store events in',
      default: 'logs-endpoint.events.process-default',
      type: 'string'
    },
    alertIndex: {
      alias: 'ai',
      describe: 'index to store alerts in',
      default: 'logs-endpoint.alerts-default',
      type: 'string'
    },
    metadataIndex: {
      alias: 'mi',
      describe: 'index to store host metadata in',
      default: 'metrics-endpoint.metadata-default',
      type: 'string'
    },
    policyIndex: {
      alias: 'pi',
      describe: 'index to store host policy in',
      default: 'metrics-endpoint.policy-default',
      type: 'string'
    },
    ancestors: {
      alias: 'anc',
      describe: 'number of ancestors of origin to create',
      type: 'number',
      default: 3
    },
    ancestryArraySize: {
      alias: 'ancSize',
      describe: 'the upper bound size of the ancestry array, 0 will mark the field as undefined',
      type: 'number',
      default: _generate_data.ANCESTRY_LIMIT
    },
    generations: {
      alias: 'gen',
      describe: 'number of child generations to create',
      type: 'number',
      default: 3
    },
    children: {
      alias: 'ch',
      describe: 'maximum number of children per node',
      type: 'number',
      default: 3
    },
    relatedEvents: {
      alias: 'related',
      describe: 'number of related events to create for each process event',
      type: 'number',
      default: 5
    },
    relatedAlerts: {
      alias: 'relAlerts',
      describe: 'number of related alerts to create for each process event',
      type: 'number',
      default: 5
    },
    percentWithRelated: {
      alias: 'pr',
      describe: 'percent of process events to add related events and related alerts to',
      type: 'number',
      default: 30
    },
    percentTerminated: {
      alias: 'pt',
      describe: 'percent of process events to add termination event for',
      type: 'number',
      default: 30
    },
    maxChildrenPerNode: {
      alias: 'maxCh',
      describe: 'always generate the max number of children per node instead of it being random up to the max children',
      type: 'boolean',
      default: false
    },
    numHosts: {
      alias: 'ne',
      describe: 'number of different hosts to generate alerts for',
      type: 'number',
      default: 1
    },
    numDocs: {
      alias: 'nd',
      describe: 'number of metadata and policy response doc to generate per host',
      type: 'number',
      default: 5
    },
    alertsPerHost: {
      alias: 'ape',
      describe: 'number of resolver trees to make for each host',
      type: 'number',
      default: 1
    },
    delete: {
      alias: 'd',
      describe: 'delete indices and remake them',
      type: 'boolean',
      default: false
    },
    fleet: {
      alias: 'f',
      describe: 'enroll fleet agents for hosts',
      type: 'boolean',
      default: false
    },
    ssl: {
      alias: 'ssl',
      describe: 'Use https for elasticsearch and kbn clients',
      type: 'boolean',
      default: false
    }
  }).argv;

  let ca;
  let kbnClient;
  let clientOptions;

  if (argv.ssl) {
    ca = _fs.default.readFileSync(_devUtils.CA_CERT_PATH);
    const url = argv.kibana.replace('http:', 'https:');
    const node = argv.node.replace('http:', 'https:');
    kbnClient = new _kbn_client_with_api_key_support.KbnClientWithApiKeySupport({
      log: new _devUtils.ToolingLog({
        level: 'info',
        writeTo: process.stdout
      }),
      url,
      certificateAuthorities: [ca]
    });
    clientOptions = {
      node,
      ssl: {
        ca: [ca]
      }
    };
  } else {
    kbnClient = new _kbn_client_with_api_key_support.KbnClientWithApiKeySupport({
      log: new _devUtils.ToolingLog({
        level: 'info',
        writeTo: process.stdout
      }),
      url: argv.kibana
    });
    clientOptions = {
      node: argv.node
    };
  }

  const client = new _elasticsearch.Client(clientOptions);

  try {
    await doIngestSetup(kbnClient);
  } catch (error) {
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }

  if (argv.delete) {
    await deleteIndices([argv.eventIndex, argv.metadataIndex, argv.policyIndex, argv.alertIndex], client);
  }

  let seed = argv.seed;

  if (!seed) {
    seed = Math.random().toString();
    console.log(`No seed supplied, using random seed: ${seed}`);
  }

  const startTime = new Date().getTime();
  await (0, _index_data.indexHostsAndAlerts)(client, kbnClient, seed, argv.numHosts, argv.numDocs, argv.metadataIndex, argv.policyIndex, argv.eventIndex, argv.alertIndex, argv.alertsPerHost, argv.fleet, {
    ancestors: argv.ancestors,
    generations: argv.generations,
    children: argv.children,
    relatedEvents: argv.relatedEvents,
    relatedAlerts: argv.relatedAlerts,
    percentWithRelated: argv.percentWithRelated,
    percentTerminated: argv.percentTerminated,
    alwaysGenMaxChildrenPerNode: argv.maxChildrenPerNode,
    ancestryArraySize: argv.ancestryArraySize,
    eventsDataStream: _generate_data.EndpointDocGenerator.createDataStreamFromIndex(argv.eventIndex),
    alertsDataStream: _generate_data.EndpointDocGenerator.createDataStreamFromIndex(argv.alertIndex)
  });
  console.log(`Creating and indexing documents took: ${new Date().getTime() - startTime}ms`);
}