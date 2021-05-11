"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateIndex = createOrUpdateIndex;

var _pRetry = _interopRequireDefault(require("p-retry"));

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


async function createOrUpdateIndex({
  index,
  mappings,
  client,
  logger
}) {
  try {
    /*
     * In some cases we could be trying to create an index before ES is ready.
     * When this happens, we retry creating the index with exponential backoff.
     * We use retry's default formula, meaning that the first retry happens after 2s,
     * the 5th after 32s, and the final attempt after around 17m. If the final attempt fails,
     * the error is logged to the console.
     * See https://github.com/sindresorhus/p-retry and https://github.com/tim-kos/node-retry.
     */
    await (0, _pRetry.default)(async () => {
      const indexExists = (await client.indices.exists({
        index
      })).body;
      const result = indexExists ? await updateExistingIndex({
        index,
        client,
        mappings
      }) : await createNewIndex({
        index,
        client,
        mappings
      });

      if (!result.body.acknowledged) {
        const resultError = result && result.body.error && JSON.stringify(result.body.error);
        throw new Error(resultError);
      }
    }, {
      onFailedAttempt: e => {
        logger.warn(`Could not create index: '${index}'. Retrying...`);
        logger.warn(e);
      }
    });
  } catch (e) {
    logger.error(`Could not create index: '${index}'. Error: ${e.message}.`);
  }
}

function createNewIndex({
  index,
  client,
  mappings
}) {
  return client.indices.create({
    index,
    body: {
      // auto_expand_replicas: Allows cluster to not have replicas for this index
      settings: {
        'index.auto_expand_replicas': '0-1'
      },
      mappings
    }
  });
}

function updateExistingIndex({
  index,
  client,
  mappings
}) {
  return client.indices.putMapping({
    index,
    body: mappings
  });
}