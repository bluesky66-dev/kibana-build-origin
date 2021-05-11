"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventsQuery = void 0;

var _serialized_query = require("../../../../utils/serialized_query");

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
 * Builds a query for retrieving events.
 */


class EventsQuery {
  constructor({
    pagination,
    indexPatterns,
    timeRange
  }) {
    _defineProperty(this, "pagination", void 0);

    _defineProperty(this, "indexPatterns", void 0);

    _defineProperty(this, "timeRange", void 0);

    this.pagination = pagination;
    this.indexPatterns = indexPatterns;
    this.timeRange = timeRange;
  }

  query(filters) {
    return {
      query: {
        bool: {
          filter: [...filters, {
            range: {
              '@timestamp': {
                gte: this.timeRange.from,
                lte: this.timeRange.to,
                format: 'strict_date_optional_time'
              }
            }
          }, {
            term: {
              'event.kind': 'event'
            }
          }]
        }
      },
      ...this.pagination.buildQueryFields('event.id', 'desc')
    };
  }

  buildSearch(filters) {
    return {
      body: this.query(filters),
      index: this.indexPatterns
    };
  }

  static buildFilters(filter) {
    if (filter === undefined) {
      return [];
    }

    return [(0, _serialized_query.parseFilterQuery)(filter)];
  }
  /**
   * Searches ES for the specified events and format the response.
   *
   * @param client a client for searching ES
   * @param filter an optional string representation of a raw Elasticsearch clause for filtering the results
   */


  async search(client, filter) {
    const parsedFilters = EventsQuery.buildFilters(filter);
    const response = await client.asCurrentUser.search(this.buildSearch(parsedFilters));
    return response.body.hits.hits.map(hit => hit._source);
  }

}

exports.EventsQuery = EventsQuery;