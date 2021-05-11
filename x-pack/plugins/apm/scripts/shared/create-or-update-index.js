"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createOrUpdateIndex = createOrUpdateIndex;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

async function createOrUpdateIndex({
  client,
  clear,
  indexName,
  template
}) {
  var _settings$index, _settings$index2;

  if (clear) {
    try {
      await client.indices.delete({
        index: indexName
      });
    } catch (err) {
      // 404 = index not found, totally okay
      if (err.body.status !== 404) {
        throw err;
      }
    }
  } // Some settings are non-updateable and need to be removed.


  const settings = { ...template.settings
  };
  settings === null || settings === void 0 ? true : (_settings$index = settings.index) === null || _settings$index === void 0 ? true : delete _settings$index.number_of_shards;
  settings === null || settings === void 0 ? true : (_settings$index2 = settings.index) === null || _settings$index2 === void 0 ? true : delete _settings$index2.sort;
  const indexExists = (await client.indices.exists({
    index: indexName
  })).body;

  if (!indexExists) {
    await client.indices.create({
      index: indexName,
      body: template
    });
  } else {
    await client.indices.close({
      index: indexName
    });
    await Promise.all([template.mappings ? client.indices.putMapping({
      index: indexName,
      body: template.mappings
    }) : Promise.resolve(undefined), settings ? client.indices.putSettings({
      index: indexName,
      body: settings
    }) : Promise.resolve(undefined)]);
    await client.indices.open({
      index: indexName
    });
  }
}