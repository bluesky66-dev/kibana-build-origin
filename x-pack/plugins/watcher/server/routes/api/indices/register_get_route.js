"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetRoute = registerGetRoute;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  pattern: _configSchema.schema.string()
}, {
  unknowns: 'allow'
});

function getIndexNamesFromAliasesResponse(json) {
  return (0, _lodash.reduce)(json, (list, {
    aliases
  }, indexName) => {
    list.push(indexName);

    if ((0, _lodash.size)(aliases) > 0) {
      list.push(...Object.keys(aliases));
    }

    return list;
  }, []);
}

function getIndices(dataClient, pattern, limit = 10) {
  return dataClient.callAsCurrentUser('indices.getAlias', {
    index: pattern,
    ignore: [404]
  }).then(aliasResult => {
    if (aliasResult.status !== 404) {
      const indicesFromAliasResponse = getIndexNamesFromAliasesResponse(aliasResult);
      return indicesFromAliasResponse.slice(0, limit);
    }

    const params = {
      index: pattern,
      ignore: [404],
      body: {
        size: 0,
        // no hits
        aggs: {
          indices: {
            terms: {
              field: '_index',
              size: limit
            }
          }
        }
      }
    };
    return dataClient.callAsCurrentUser('search', params).then(response => {
      if (response.status === 404 || !response.aggregations) {
        return [];
      }

      return response.aggregations.indices.buckets.map(bucket => bucket.key);
    });
  });
}

function registerGetRoute(deps) {
  deps.router.post({
    path: '/api/watcher/indices',
    validate: {
      body: bodySchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const {
      pattern
    } = request.body;

    try {
      const indices = await getIndices(ctx.watcher.client, pattern);
      return response.ok({
        body: {
          indices
        }
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        return response.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}