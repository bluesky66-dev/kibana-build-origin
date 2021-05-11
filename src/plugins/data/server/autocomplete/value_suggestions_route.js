"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerValueSuggestionsRoute = registerValueSuggestionsRoute;

var _lodash = require("lodash");

var _configSchema = require("@kbn/config-schema");

var _operators = require("rxjs/operators");

var _index_patterns = require("../index_patterns");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerValueSuggestionsRoute(router, config$) {
  router.post({
    path: '/api/kibana/suggestions/values/{index}',
    validate: {
      params: _configSchema.schema.object({
        index: _configSchema.schema.string()
      }, {
        unknowns: 'allow'
      }),
      body: _configSchema.schema.object({
        field: _configSchema.schema.string(),
        query: _configSchema.schema.string(),
        filters: _configSchema.schema.maybe(_configSchema.schema.any())
      }, {
        unknowns: 'allow'
      })
    }
  }, async (context, request, response) => {
    const config = await config$.pipe((0, _operators.first)()).toPromise();
    const {
      field: fieldName,
      query,
      filters
    } = request.body;
    const {
      index
    } = request.params;
    const {
      client
    } = context.core.elasticsearch.legacy;
    const signal = (0, _lib.getRequestAbortedSignal)(request.events.aborted$);
    const autocompleteSearchOptions = {
      timeout: `${config.kibana.autocompleteTimeout.asMilliseconds()}ms`,
      terminate_after: config.kibana.autocompleteTerminateAfter.asMilliseconds()
    };
    const indexPattern = await (0, _index_patterns.findIndexPatternById)(context.core.savedObjects.client, index);
    const field = indexPattern && (0, _index_patterns.getFieldByName)(fieldName, indexPattern);
    const body = await getBody(autocompleteSearchOptions, field || fieldName, query, filters);

    try {
      const result = await client.callAsCurrentUser('search', {
        index,
        body
      }, {
        signal
      });
      const buckets = (0, _lodash.get)(result, 'aggregations.suggestions.buckets') || (0, _lodash.get)(result, 'aggregations.nestedSuggestions.suggestions.buckets');
      return response.ok({
        body: (0, _lodash.map)(buckets || [], 'key')
      });
    } catch (error) {
      return response.internalError({
        body: error
      });
    }
  });
}

async function getBody( // eslint-disable-next-line @typescript-eslint/naming-convention
{
  timeout,
  terminate_after
}, field, query, filters = []) {
  const isFieldObject = f => Boolean(f && f.name); // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#_standard_operators


  const getEscapedQuery = (q = '') => q.replace(/[.?+*|{}[\]()"\\#@&<>~]/g, match => `\\${match}`); // Helps ensure that the regex is not evaluated eagerly against the terms dictionary


  const executionHint = 'map'; // We don't care about the accuracy of the counts, just the content of the terms, so this reduces
  // the amount of information that needs to be transmitted to the coordinating node

  const shardSize = 10;
  const body = {
    size: 0,
    timeout,
    terminate_after,
    query: {
      bool: {
        filter: filters
      }
    },
    aggs: {
      suggestions: {
        terms: {
          field: isFieldObject(field) ? field.name : field,
          include: `${getEscapedQuery(query)}.*`,
          execution_hint: executionHint,
          shard_size: shardSize
        }
      }
    }
  };

  if (isFieldObject(field) && field.subType && field.subType.nested) {
    return { ...body,
      aggs: {
        nestedSuggestions: {
          nested: {
            path: field.subType.nested.path
          },
          aggs: body.aggs
        }
      }
    };
  }

  return body;
}