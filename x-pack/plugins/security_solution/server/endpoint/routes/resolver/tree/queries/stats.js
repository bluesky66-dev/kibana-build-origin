"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StatsQuery = void 0;

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
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Builds a query for retrieving descendants of a node.
 */


class StatsQuery {
  constructor({
    schema,
    indexPatterns,
    timeRange
  }) {
    _defineProperty(this, "schema", void 0);

    _defineProperty(this, "indexPatterns", void 0);

    _defineProperty(this, "timeRange", void 0);

    this.schema = schema;
    this.indexPatterns = indexPatterns;
    this.timeRange = timeRange;
  }

  query(nodes) {
    return {
      size: 0,
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
            term: {
              'event.kind': 'event'
            }
          }, {
            bool: {
              must_not: {
                term: {
                  'event.category': 'process'
                }
              }
            }
          }]
        }
      },
      aggs: {
        ids: {
          terms: {
            field: this.schema.id,
            size: nodes.length
          },
          aggs: {
            categories: {
              terms: {
                field: 'event.category',
                size: 1000
              }
            }
          }
        }
      }
    };
  }

  static getEventStats(catAgg) {
    var _catAgg$categories;

    const total = catAgg.doc_count;

    if (!((_catAgg$categories = catAgg.categories) !== null && _catAgg$categories !== void 0 && _catAgg$categories.buckets)) {
      return {
        total,
        byCategory: {}
      };
    }

    const byCategory = catAgg.categories.buckets.reduce((cummulative, bucket) => ({ ...cummulative,
      [bucket.key]: bucket.doc_count
    }), {});
    return {
      total,
      byCategory
    };
  }
  /**
   * Returns the related event statistics for a set of nodes.
   * @param client used to make requests to Elasticsearch
   * @param nodes an array of unique IDs representing nodes in a resolver graph
   */


  async search(client, nodes) {
    var _response$body$aggreg, _response$body$aggreg2;

    if (nodes.length <= 0) {
      return {};
    } // leaving unknown here because we don't actually need the hits part of the body


    const response = await client.asCurrentUser.search({
      body: this.query(nodes),
      index: this.indexPatterns
    });
    return (_response$body$aggreg = response.body.aggregations) === null || _response$body$aggreg === void 0 ? void 0 : (_response$body$aggreg2 = _response$body$aggreg.ids) === null || _response$body$aggreg2 === void 0 ? void 0 : _response$body$aggreg2.buckets.reduce((cummulative, bucket) => ({ ...cummulative,
      [bucket.key]: StatsQuery.getEventStats(bucket)
    }), {});
  }

}

exports.StatsQuery = StatsQuery;