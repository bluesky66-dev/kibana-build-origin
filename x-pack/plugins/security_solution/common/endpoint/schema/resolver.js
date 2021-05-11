"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEntities = exports.validateEvents = exports.validateTree = void 0;

var _configSchema = require("@kbn/config-schema");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Used to validate GET requests for a complete resolver tree.
 */


const validateTree = {
  body: _configSchema.schema.object({
    /**
     * If the ancestry field is specified this field will be ignored
     *
     * If the ancestry field is specified we have a much more performant way of retrieving levels so let's not limit
     * the number of levels that come back in that scenario. We could still limit it, but what we'd likely have to do
     * is get all the levels back like we normally do with the ancestry array, bucket them together by level, and then
     * remove the levels that exceeded the requested number which seems kind of wasteful.
     */
    descendantLevels: _configSchema.schema.number({
      defaultValue: 20,
      min: 0,
      max: 1000
    }),
    descendants: _configSchema.schema.number({
      defaultValue: 1000,
      min: 0,
      max: 10000
    }),
    // if the ancestry array isn't specified allowing 200 might be too high
    ancestors: _configSchema.schema.number({
      defaultValue: 200,
      min: 0,
      max: 10000
    }),
    timeRange: _configSchema.schema.object({
      from: _configSchema.schema.string(),
      to: _configSchema.schema.string()
    }),
    schema: _configSchema.schema.object({
      // the ancestry field is optional
      ancestry: _configSchema.schema.maybe(_configSchema.schema.string({
        minLength: 1
      })),
      id: _configSchema.schema.string({
        minLength: 1
      }),
      name: _configSchema.schema.maybe(_configSchema.schema.string({
        minLength: 1
      })),
      parent: _configSchema.schema.string({
        minLength: 1
      })
    }),
    // only allowing strings and numbers for node IDs because Elasticsearch only allows those types for collapsing:
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/collapse-search-results.html
    // We use collapsing in our Elasticsearch queries for the tree api
    nodes: _configSchema.schema.arrayOf(_configSchema.schema.oneOf([_configSchema.schema.string({
      minLength: 1
    }), _configSchema.schema.number()]), {
      minSize: 1
    }),
    indexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string(), {
      minSize: 1
    })
  })
};
/**
 * Used to validate POST requests for `/resolver/events` api.
 */

exports.validateTree = validateTree;
const validateEvents = {
  query: _configSchema.schema.object({
    // keeping the max as 10k because the limit in ES for a single query is also 10k
    limit: _configSchema.schema.number({
      defaultValue: 1000,
      min: 1,
      max: 10000
    }),
    afterEvent: _configSchema.schema.maybe(_configSchema.schema.string())
  }),
  body: _configSchema.schema.object({
    timeRange: _configSchema.schema.object({
      from: _configSchema.schema.string(),
      to: _configSchema.schema.string()
    }),
    indexPatterns: _configSchema.schema.arrayOf(_configSchema.schema.string()),
    filter: _configSchema.schema.maybe(_configSchema.schema.string())
  })
};
/**
 * Used to validate GET requests for 'entities'
 */

exports.validateEvents = validateEvents;
const validateEntities = {
  query: _configSchema.schema.object({
    /**
     * Return the process entities related to the document w/ the matching `_id`.
     */
    _id: _configSchema.schema.string(),

    /**
     * Indices to search in.
     */
    indices: _configSchema.schema.oneOf([_configSchema.schema.arrayOf(_configSchema.schema.string()), _configSchema.schema.string()])
  })
};
exports.validateEntities = validateEntities;