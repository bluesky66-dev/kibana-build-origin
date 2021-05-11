"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLocalFilterQuery = void 0;

var _lodash = require("lodash");

var _merge_projection = require("../../../../projections/util/merge_projection");

var _get_es_filter = require("../../../helpers/convert_ui_filters/get_es_filter");

var _config = require("./config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getLocalFilterQuery = ({
  uiFilters,
  projection,
  localUIFilterName
}) => {
  var _projection$body$quer, _projection$body$quer2;

  const field = _config.localUIFilters[localUIFilterName];
  const filter = (0, _get_es_filter.getEsFilter)((0, _lodash.omit)(uiFilters, field.name));
  const bucketCountAggregation = projection.body.aggs ? {
    aggs: {
      bucket_count: {
        cardinality: {
          field: projection.body.aggs[Object.keys(projection.body.aggs)[0]].terms.field
        }
      }
    }
  } : null;
  return (0, _merge_projection.mergeProjection)(projection, {
    body: {
      size: 0,
      query: {
        bool: {
          filter: filter.concat(((_projection$body$quer = projection.body.query) === null || _projection$body$quer === void 0 ? void 0 : (_projection$body$quer2 = _projection$body$quer.bool) === null || _projection$body$quer2 === void 0 ? void 0 : _projection$body$quer2.filter) || [])
        }
      },
      aggs: {
        by_terms: {
          terms: {
            field: field.fieldName,
            order: {
              _count: 'desc'
            }
          },
          ...bucketCountAggregation
        }
      }
    }
  });
};

exports.getLocalFilterQuery = getLocalFilterQuery;