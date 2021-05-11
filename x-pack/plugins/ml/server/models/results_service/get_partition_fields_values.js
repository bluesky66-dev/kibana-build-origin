"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPartitionFieldsValuesFactory = void 0;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _anomalies = require("../../../common/constants/anomalies");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Gets an object for aggregation query to retrieve field name and values.
 * @param fieldType - Field type
 * @param isModelPlotSearch
 * @param query - Optional query string for partition value
 * @param fieldConfig - Optional config for filtering and sorting
 * @returns {Object}
 */


function getFieldAgg(fieldType, isModelPlotSearch, query, fieldConfig) {
  var _fieldConfig$sort, _fieldConfig$sort$ord;

  const AGG_SIZE = 100;
  const fieldNameKey = `${fieldType}_name`;
  const fieldValueKey = `${fieldType}_value`;
  const sortByField = (fieldConfig === null || fieldConfig === void 0 ? void 0 : (_fieldConfig$sort = fieldConfig.sort) === null || _fieldConfig$sort === void 0 ? void 0 : _fieldConfig$sort.by) === 'name' || isModelPlotSearch ? '_key' : 'maxRecordScore';
  return {
    [fieldNameKey]: {
      terms: {
        field: fieldNameKey
      }
    },
    [fieldValueKey]: {
      filter: {
        bool: {
          must: [...(query ? [{
            wildcard: {
              [fieldValueKey]: {
                value: `*${query}*`
              }
            }
          }] : []), ...(fieldConfig !== null && fieldConfig !== void 0 && fieldConfig.anomalousOnly ? [{
            range: {
              record_score: {
                gt: 0
              }
            }
          }] : [])]
        }
      },
      aggs: {
        values: {
          terms: {
            size: AGG_SIZE,
            field: fieldValueKey,
            ...(fieldConfig !== null && fieldConfig !== void 0 && fieldConfig.sort ? {
              order: {
                [sortByField]: (_fieldConfig$sort$ord = fieldConfig.sort.order) !== null && _fieldConfig$sort$ord !== void 0 ? _fieldConfig$sort$ord : 'desc'
              }
            } : {})
          },
          ...(isModelPlotSearch ? {} : {
            aggs: {
              maxRecordScore: {
                max: {
                  field: 'record_score'
                }
              }
            }
          })
        }
      }
    }
  };
}
/**
 * Gets formatted result for particular field from aggregation response.
 * @param fieldType - Field type
 * @param aggs - Aggregation response
 */


function getFieldObject(fieldType, aggs) {
  const fieldNameKey = `${fieldType}_name`;
  const fieldValueKey = `${fieldType}_value`;
  return aggs[fieldNameKey].buckets.length > 0 ? {
    [fieldType]: {
      name: aggs[fieldNameKey].buckets[0].key,
      values: aggs[fieldValueKey].values.buckets.map(({
        key,
        maxRecordScore
      }) => ({
        value: key,
        ...(maxRecordScore ? {
          maxRecordScore: maxRecordScore.value
        } : {})
      }))
    }
  } : {};
}

const getPartitionFieldsValuesFactory = mlClient =>
/**
 * Gets the record of partition fields with possible values that fit the provided queries.
 * @param jobId - Job ID
 * @param searchTerm - object of queries for partition fields, e.g. { partition_field: 'query' }
 * @param criteriaFields - key - value pairs of the term field, e.g. { detector_index: 0 }
 * @param earliestMs
 * @param latestMs
 * @param fieldsConfig
 */
async function getPartitionFieldsValues(jobId, searchTerm = {}, criteriaFields, earliestMs, latestMs, fieldsConfig = {}) {
  var _job$model_plot_confi;

  const {
    body: jobsResponse
  } = await mlClient.getJobs({
    job_id: jobId
  });

  if (jobsResponse.count === 0 || jobsResponse.jobs === undefined) {
    throw _boom.default.notFound(`Job with the id "${jobId}" not found`);
  }

  const job = jobsResponse.jobs[0];
  const isModelPlotEnabled = job === null || job === void 0 ? void 0 : (_job$model_plot_confi = job.model_plot_config) === null || _job$model_plot_confi === void 0 ? void 0 : _job$model_plot_confi.enabled;
  const isAnomalousOnly = Object.entries(fieldsConfig).some(([k, v]) => {
    return !!(v !== null && v !== void 0 && v.anomalousOnly);
  });
  const applyTimeRange = Object.entries(fieldsConfig).some(([k, v]) => {
    return !!(v !== null && v !== void 0 && v.applyTimeRange);
  });
  const isModelPlotSearch = !!isModelPlotEnabled && !isAnomalousOnly; // Remove the time filter in case model plot is not enabled
  // and time range is not applied, so
  // it includes the records that occurred as anomalies historically

  const searchAllTime = !isModelPlotEnabled && !applyTimeRange;
  const requestBody = {
    query: {
      bool: {
        filter: [...criteriaFields.map(({
          fieldName,
          fieldValue
        }) => {
          return {
            term: {
              [fieldName]: fieldValue
            }
          };
        }), {
          term: {
            job_id: jobId
          }
        }, ...(searchAllTime ? [] : [{
          range: {
            timestamp: {
              gte: earliestMs,
              lte: latestMs,
              format: 'epoch_millis'
            }
          }
        }]), {
          term: {
            result_type: isModelPlotSearch ? 'model_plot' : 'record'
          }
        }]
      }
    },
    aggs: { ..._anomalies.PARTITION_FIELDS.reduce((acc, key) => {
        return { ...acc,
          ...getFieldAgg(key, isModelPlotSearch, searchTerm[key], fieldsConfig[key])
        };
      }, {})
    }
  };
  const {
    body
  } = await mlClient.anomalySearch({
    size: 0,
    body: requestBody
  }, [jobId]);
  return _anomalies.PARTITION_FIELDS.reduce((acc, key) => {
    return { ...acc,
      ...getFieldObject(key, body.aggregations)
    };
  }, {});
};

exports.getPartitionFieldsValuesFactory = getPartitionFieldsValuesFactory;