"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LifecycleQuery = void 0;

var _index = require("../utils/index");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Builds a query for retrieving descendants of a node.
 */


class LifecycleQuery {
  constructor({
    schema,
    indexPatterns,
    timeRange
  }) {
    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "indexPatterns", void 0);

    _defineProperty(this, "timeRange", void 0);

    _defineProperty(this, "docValueFields", void 0);

    this.docValueFields = (0, _index.docValueFields)(schema);
    this.schema = schema;
    this.indexPatterns = indexPatterns;
    this.timeRange = timeRange;
  }

  query(nodes) {
    return {
      _source: false,
      docvalue_fields: this.docValueFields,
      size: nodes.length,
      collapse: {
        field: this.schema.id
      },
      sort: [{
        '@timestamp': 'asc'
      }],
      query: {
        bool: {
          filter: [{
            range: {
              '@timestamp': {
                gte: this.timeRange.from,
                lte: this.timeRange.to,
                format: 'strict_date_optional_time'
              }
            }
          }, {
            terms: {
              [this.schema.id]: nodes
            }
          }, {
            exists: {
              field: this.schema.id
            }
          }, {
            bool: {
              must_not: {
                term: {
                  [this.schema.id]: ''
                }
              }
            }
          }, {
            term: {
              'event.category': 'process'
            }
          }, {
            term: {
              'event.kind': 'event'
            }
          }]
        }
      }
    };
  }
  /**
   * Searches for lifecycle events matching the specified node IDs.
   *
   * @param client for making requests to Elasticsearch
   * @param nodes the unique IDs to search for in Elasticsearch
   */


  async search(client, nodes) {
    const validNodes = (0, _index.validIDs)(nodes);

    if (validNodes.length <= 0) {
      return [];
    }

    const response = await client.asCurrentUser.search({
      body: this.query(validNodes),
      index: this.indexPatterns
    });
    /**
     * The returned values will look like:
     * [
     *  { 'schema_id_value': <value>, 'schema_parent_value': <value> }
     * ]
     *
     * So the schema fields are flattened ('process.parent.entity_id')
     */

    return response.body.hits.hits.map(hit => hit.fields);
  }

}

exports.LifecycleQuery = LifecycleQuery;