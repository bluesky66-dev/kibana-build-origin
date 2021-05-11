"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFilterBar = exports.combineRangeWithFilters = void 0;

var _generate_filter_aggs = require("./generate_filter_aggs");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const combineRangeWithFilters = (dateRangeStart, dateRangeEnd, filters) => {
  var _filters$bool$filter, _filters$bool, _filters$bool$filter2, _filters$bool2;

  const range = {
    range: {
      '@timestamp': {
        gte: dateRangeStart,
        lte: dateRangeEnd
      }
    }
  };
  if (!(filters !== null && filters !== void 0 && filters.bool)) return range;
  const clientFiltersList = Array.isArray((_filters$bool$filter = filters === null || filters === void 0 ? void 0 : (_filters$bool = filters.bool) === null || _filters$bool === void 0 ? void 0 : _filters$bool.filter) !== null && _filters$bool$filter !== void 0 ? _filters$bool$filter : {}) ? // i.e. {"bool":{"filter":{ ...some nested filter objects }}}
  filters.bool.filter : // i.e. {"bool":{"filter":[ ...some listed filter objects ]}}
  Object.keys((_filters$bool$filter2 = filters === null || filters === void 0 ? void 0 : (_filters$bool2 = filters.bool) === null || _filters$bool2 === void 0 ? void 0 : _filters$bool2.filter) !== null && _filters$bool$filter2 !== void 0 ? _filters$bool$filter2 : {}).map(key => {
    var _filters$bool3, _filters$bool3$filter;

    return { ...(filters === null || filters === void 0 ? void 0 : (_filters$bool3 = filters.bool) === null || _filters$bool3 === void 0 ? void 0 : (_filters$bool3$filter = _filters$bool3.filter) === null || _filters$bool3$filter === void 0 ? void 0 : _filters$bool3$filter[key])
    };
  });
  filters.bool.filter = [...clientFiltersList, range];
  return filters;
};

exports.combineRangeWithFilters = combineRangeWithFilters;

const getFilterBar = async ({
  uptimeEsClient,
  dateRangeStart,
  dateRangeEnd,
  search,
  filterOptions
}) => {
  var _locations$term, _ports$term, _schemes$term, _tags$term;

  const aggs = (0, _generate_filter_aggs.generateFilterAggs)([{
    aggName: 'locations',
    filterName: 'locations',
    field: 'observer.geo.name'
  }, {
    aggName: 'ports',
    filterName: 'ports',
    field: 'url.port'
  }, {
    aggName: 'schemes',
    filterName: 'schemes',
    field: 'monitor.type'
  }, {
    aggName: 'tags',
    filterName: 'tags',
    field: 'tags'
  }], filterOptions);
  const filters = combineRangeWithFilters(dateRangeStart, dateRangeEnd, search);
  const searchBody = {
    size: 0,
    query: { ...filters
    },
    aggs
  };
  const {
    body: {
      aggregations
    }
  } = await uptimeEsClient.search({
    body: searchBody
  });
  const {
    tags,
    locations,
    ports,
    schemes
  } = aggregations !== null && aggregations !== void 0 ? aggregations : {};
  return {
    locations: locations === null || locations === void 0 ? void 0 : (_locations$term = locations.term) === null || _locations$term === void 0 ? void 0 : _locations$term.buckets.map(item => item.key),
    ports: ports === null || ports === void 0 ? void 0 : (_ports$term = ports.term) === null || _ports$term === void 0 ? void 0 : _ports$term.buckets.map(item => item.key),
    schemes: schemes === null || schemes === void 0 ? void 0 : (_schemes$term = schemes.term) === null || _schemes$term === void 0 ? void 0 : _schemes$term.buckets.map(item => item.key),
    tags: tags === null || tags === void 0 ? void 0 : (_tags$term = tags.term) === null || _tags$term === void 0 ? void 0 : _tags$term.buckets.map(item => item.key)
  };
};

exports.getFilterBar = getFilterBar;