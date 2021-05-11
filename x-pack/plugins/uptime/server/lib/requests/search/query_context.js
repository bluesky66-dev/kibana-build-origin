"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QueryContext = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _helper = require("../../helper");

var _runtime_types = require("../../../../common/runtime_types");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}

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

class QueryContext {
  constructor(database, dateRangeStart, dateRangeEnd, pagination, filterClause, size, statusFilter) {
    _defineProperty(this, "callES", void 0);

    _defineProperty(this, "dateRangeStart", void 0);

    _defineProperty(this, "dateRangeEnd", void 0);

    _defineProperty(this, "pagination", void 0);

    _defineProperty(this, "filterClause", void 0);

    _defineProperty(this, "size", void 0);

    _defineProperty(this, "statusFilter", void 0);

    _defineProperty(this, "hasTimespanCache", void 0);

    this.callES = database;
    this.dateRangeStart = dateRangeStart;
    this.dateRangeEnd = dateRangeEnd;
    this.pagination = pagination;
    this.filterClause = filterClause;
    this.size = size;
    this.statusFilter = statusFilter;
  }

  async search(params) {
    return this.callES.search(params);
  }

  async count(params) {
    const {
      body
    } = await this.callES.count(params);
    return body;
  }

  async dateAndCustomFilters() {
    const clauses = [await this.dateRangeFilter()];

    if (this.filterClause) {
      clauses.push(this.filterClause);
    }

    return clauses;
  }

  async dateRangeFilter() {
    const timestampClause = {
      range: {
        '@timestamp': {
          gte: this.dateRangeStart,
          lte: this.dateRangeEnd
        }
      }
    };

    if (!(await this.hasTimespan())) {
      return timestampClause;
    }

    return {
      bool: {
        filter: [timestampClause, {
          bool: {
            should: [this.timespanClause(), {
              bool: {
                must_not: {
                  exists: {
                    field: 'monitor.timespan'
                  }
                }
              }
            }]
          }
        }]
      }
    };
  } // timeRangeClause queries the given date range using the monitor timespan field
  // which is a bit dicey since we may have data that predates this field existing,
  // or we may have data that has it, but a slow ingestion process.


  timespanClause() {
    // We subtract 5m from the start to account for data that shows up late,
    // for instance, with a large value for the elasticsearch refresh interval
    // setting it lower can work very well on someone's laptop, but with real world
    // latencies and slowdowns that's dangerous. Making this value larger makes things
    // only slower, but only marginally so, and prevents people from seeing weird
    // behavior.
    const tsEnd = (0, _helper.parseRelativeDate)(this.dateRangeEnd, {
      roundUp: true
    });
    const tsStart = (0, _moment.default)(tsEnd).subtract(5, 'minutes');
    return {
      range: {
        'monitor.timespan': {
          gte: tsStart.toISOString(),
          lte: tsEnd.toISOString()
        }
      }
    };
  }

  async hasTimespan() {
    if (this.hasTimespanCache) {
      return this.hasTimespanCache;
    }

    this.hasTimespanCache = (await this.count({
      body: {
        query: {
          bool: {
            filter: [this.timespanClause()]
          }
        }
      },
      terminate_after: 1
    })).count > 0;
    return this.hasTimespanCache;
  }

  clone() {
    return new QueryContext(this.callES, this.dateRangeStart, this.dateRangeEnd, this.pagination, this.filterClause, this.size, this.statusFilter);
  } // Returns true if the order returned by the ES query matches the requested sort order.
  // This useful to determine if the results need to be reversed from their ES results order.
  // I.E. when navigating backwards using prevPagePagination (CursorDirection.Before) yet using a SortOrder.ASC.


  searchSortAligned() {
    if (this.pagination.cursorDirection === _runtime_types.CursorDirection.AFTER) {
      return this.pagination.sortOrder === _runtime_types.SortOrder.ASC;
    } else {
      return this.pagination.sortOrder === _runtime_types.SortOrder.DESC;
    }
  }

  cursorOrder() {
    return _runtime_types.CursorDirection[this.pagination.cursorDirection] === _runtime_types.CursorDirection.AFTER ? 'asc' : 'desc';
  }

}

exports.QueryContext = QueryContext;