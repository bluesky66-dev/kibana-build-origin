"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateFilterAggs = exports.FIELD_MAPPINGS = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const FIELD_MAPPINGS = {
  schemes: 'monitor.type',
  ports: 'url.port',
  locations: 'observer.geo.name',
  tags: 'tags'
};
exports.FIELD_MAPPINGS = FIELD_MAPPINGS;

const getFilterAggConditions = (filterTerms, except) => {
  const filters = [];
  Object.keys(filterTerms).forEach(key => {
    if (key === except && FIELD_MAPPINGS[key]) return;
    filters.push(...filterTerms[key].map(value => ({
      term: {
        [FIELD_MAPPINGS[key]]: value
      }
    })));
  });
  return filters;
};

const generateFilterAggs = (aggDefinitions, filterOptions) => aggDefinitions.map(({
  aggName,
  filterName,
  field
}) => ({
  [aggName]: {
    filter: {
      bool: {
        should: [...getFilterAggConditions(filterOptions, filterName)]
      }
    },
    aggs: {
      term: {
        terms: {
          field
        }
      }
    }
  }
})).reduce((parent, agg) => ({ ...parent,
  ...agg
}), {});

exports.generateFilterAggs = generateFilterAggs;