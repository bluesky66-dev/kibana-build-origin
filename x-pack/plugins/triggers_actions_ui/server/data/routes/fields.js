"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFieldsRoute = createFieldsRoute;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  indexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

function createFieldsRoute(logger, router, baseRoute) {
  const path = `${baseRoute}/_fields`;
  logger.debug(`registering indexThreshold route POST ${path}`);
  router.post({
    path,
    validate: {
      body: bodySchema
    }
  }, handler);

  async function handler(ctx, req, res) {
    logger.debug(`route ${path} request: ${JSON.stringify(req.body)}`);
    let rawFields; // special test for no patterns, otherwise all are returned!

    if (req.body.indexPatterns.length === 0) {
      return res.ok({
        body: {
          fields: []
        }
      });
    }

    try {
      rawFields = await getRawFields(ctx.core.elasticsearch.legacy.client, req.body.indexPatterns);
    } catch (err) {
      const indexPatterns = req.body.indexPatterns.join(',');
      logger.warn(`route ${path} error getting fields from pattern "${indexPatterns}": ${err.message}`);
      return res.ok({
        body: {
          fields: []
        }
      });
    }

    const result = {
      fields: getFieldsFromRawFields(rawFields)
    };
    logger.debug(`route ${path} response: ${JSON.stringify(result)}`);
    return res.ok({
      body: result
    });
  }
} // RawFields is a structure with the following shape:
// {
//   "fields": {
//     "_routing": { "_routing": { "type": "_routing", "searchable": true, "aggregatable": false}},
//     "host":     { "keyword":  { "type": "keyword",  "searchable": true, "aggregatable": true}},
//     ...
// }


async function getRawFields(dataClient, indexes) {
  const params = {
    index: indexes,
    fields: ['*'],
    ignoreUnavailable: true,
    allowNoIndices: true,
    ignore: 404
  };
  const result = await dataClient.callAsCurrentUser('fieldCaps', params);
  return result;
}

function getFieldsFromRawFields(rawFields) {
  const result = [];

  if (!rawFields || !rawFields.fields) {
    return [];
  }

  for (const name of Object.keys(rawFields.fields)) {
    const rawField = rawFields.fields[name];
    const type = Object.keys(rawField)[0];
    const values = rawField[type];
    if (!type || type.startsWith('_')) continue;
    if (!values) continue;
    const normalizedType = normalizedFieldTypes[type] || type;
    const aggregatable = values.aggregatable;
    const searchable = values.searchable;
    result.push({
      name,
      type,
      normalizedType,
      aggregatable,
      searchable
    });
  }

  result.sort((a, b) => a.name.localeCompare(b.name));
  return result;
}

const normalizedFieldTypes = {
  long: 'number',
  integer: 'number',
  short: 'number',
  byte: 'number',
  double: 'number',
  float: 'number',
  half_float: 'number',
  scaled_float: 'number'
};