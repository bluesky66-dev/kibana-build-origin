"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.docValueFields = docValueFields;
exports.validIDs = validIDs;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Represents a time range filter
 */

/**
 * An array of unique IDs to identify nodes within the resolver tree.
 */

/**
 * Returns the doc value fields filter to use in queries to limit the number of fields returned in the
 * query response.
 *
 * See for more info: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#docvalue-fields
 *
 * @param schema is the node schema information describing how relationships are formed between nodes
 *  in the resolver graph.
 */

function docValueFields(schema) {
  const filter = [{
    field: '@timestamp'
  }, {
    field: schema.id
  }, {
    field: schema.parent
  }];

  if (schema.ancestry) {
    filter.push({
      field: schema.ancestry
    });
  }

  if (schema.name) {
    filter.push({
      field: schema.name
    });
  }

  return filter;
}
/**
 * Returns valid IDs that can be used in a search.
 *
 * @param ids array of ids
 */


function validIDs(ids) {
  return ids.filter(id => String(id) !== '');
}