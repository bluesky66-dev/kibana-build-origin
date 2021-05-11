"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.topCategoriesProvider = topCategoriesProvider;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function topCategoriesProvider(mlClient) {
  async function getTotalCategories(jobId) {
    var _body$hits$total$valu, _body$hits, _body$hits$total;

    const {
      body
    } = await mlClient.anomalySearch({
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                job_id: jobId
              }
            }, {
              exists: {
                field: 'category_id'
              }
            }]
          }
        }
      }
    }, []); // @ts-ignore total is an object here

    return (_body$hits$total$valu = body === null || body === void 0 ? void 0 : (_body$hits = body.hits) === null || _body$hits === void 0 ? void 0 : (_body$hits$total = _body$hits.total) === null || _body$hits$total === void 0 ? void 0 : _body$hits$total.value) !== null && _body$hits$total$valu !== void 0 ? _body$hits$total$valu : 0;
  }

  async function getTopCategoryCounts(jobId, numberOfCategories) {
    var _body$aggregations, _body$aggregations$ca;

    const {
      body
    } = await mlClient.anomalySearch({
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                job_id: jobId
              }
            }, {
              term: {
                result_type: 'model_plot'
              }
            }, {
              term: {
                by_field_name: 'mlcategory'
              }
            }]
          }
        },
        aggs: {
          cat_count: {
            terms: {
              field: 'by_field_value',
              size: numberOfCategories
            }
          }
        }
      }
    }, []);
    const catCounts = (_body$aggregations = body.aggregations) === null || _body$aggregations === void 0 ? void 0 : (_body$aggregations$ca = _body$aggregations.cat_count) === null || _body$aggregations$ca === void 0 ? void 0 : _body$aggregations$ca.buckets.map(c => ({
      id: c.key,
      count: c.doc_count
    }));
    return catCounts || [];
  }

  async function getCategories(jobId, catIds, size) {
    var _body$hits$hits;

    const categoryFilter = catIds.length ? {
      terms: {
        category_id: catIds
      }
    } : {
      exists: {
        field: 'category_id'
      }
    };
    const {
      body
    } = await mlClient.anomalySearch({
      size,
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                job_id: jobId
              }
            }, categoryFilter]
          }
        }
      }
    }, []);
    return ((_body$hits$hits = body.hits.hits) === null || _body$hits$hits === void 0 ? void 0 : _body$hits$hits.map(c => c._source)) || [];
  }

  async function topCategories(jobId, numberOfCategories) {
    const catCounts = await getTopCategoryCounts(jobId, numberOfCategories);
    const categories = await getCategories(jobId, catCounts.map(c => c.id), catCounts.length || numberOfCategories);
    const catsById = categories.reduce((p, c) => {
      p[c.category_id] = c;
      return p;
    }, {});
    const total = await getTotalCategories(jobId);

    if (catCounts.length) {
      return {
        total,
        categories: catCounts.map(({
          id,
          count
        }) => {
          var _catsById$id;

          return {
            count,
            category: (_catsById$id = catsById[id]) !== null && _catsById$id !== void 0 ? _catsById$id : null
          };
        })
      };
    } else {
      return {
        total,
        categories: categories.map(category => {
          return {
            category
          };
        })
      };
    }
  }

  return {
    topCategories
  };
}