"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createQueueFactory = createQueueFactory;

var _create_worker = require("./create_worker");

var _esqueue = require("./esqueue");

var _create_tagged_logger = require("./esqueue/create_tagged_logger");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// @ts-ignore


async function createQueueFactory(reporting, store, logger) {
  const config = reporting.getConfig(); // esqueue-related

  const queueTimeout = config.get('queue', 'timeout');
  const isPollingEnabled = config.get('queue', 'pollEnabled');
  const elasticsearch = reporting.getElasticsearchService();
  const queueOptions = {
    timeout: queueTimeout,
    client: elasticsearch.legacy.client,
    logger: (0, _create_tagged_logger.createTaggedLogger)(logger, ['esqueue', 'queue-worker'])
  };
  const queue = new _esqueue.Esqueue(store, queueOptions);

  if (isPollingEnabled) {
    // create workers to poll the index for idle jobs waiting to be claimed and executed
    const createWorker = (0, _create_worker.createWorkerFactory)(reporting, logger);
    await createWorker(queue);
  } else {
    logger.info('xpack.reporting.queue.pollEnabled is set to false. This Kibana instance ' + 'will not poll for idle jobs to claim and execute. Make sure another ' + 'Kibana instance with polling enabled is running in this cluster so ' + 'reporting jobs can complete.', ['create_queue']);
  }

  return queue;
}