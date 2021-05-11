"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resultsServiceProvider = resultsServiceProvider;

var _lodash = require("lodash");

var _moment = _interopRequireDefault(require("moment"));

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _build_anomaly_table_items = require("./build_anomaly_table_items");

var _search = require("../../../common/constants/search");

var _get_partition_fields_values = require("./get_partition_fields_values");

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
// Service for carrying out Elasticsearch queries to obtain data for the
// ML Results dashboards.


const DEFAULT_MAX_EXAMPLES = 500;

function resultsServiceProvider(mlClient) {
  // Obtains data for the anomalies table, aggregating anomalies by day or hour as requested.
  // Return an Object with properties 'anomalies' and 'interval' (interval used to aggregate anomalies,
  // one of day, hour or second. Note 'auto' can be provided as the aggregationInterval in the request,
  // in which case the interval is determined according to the time span between the first and
  // last anomalies),  plus an examplesByJobId property if any of the
  // anomalies are categorization anomalies in mlcategory.
  async function getAnomaliesTableData(jobIds, criteriaFields, influencers, aggregationInterval, threshold, earliestMs, latestMs, dateFormatTz, maxRecords = _search.ANOMALIES_TABLE_DEFAULT_QUERY_SIZE, maxExamples = DEFAULT_MAX_EXAMPLES, influencersFilterQuery, functionDescription) {
    // Build the query to return the matching anomaly record results.
    // Add criteria for the time range, record score, plus any specified job IDs.
    const boolCriteria = [{
      range: {
        timestamp: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }, {
      range: {
        record_score: {
          gte: threshold
        }
      }
    }];

    if (jobIds && jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      jobIds.forEach((jobId, i) => {
        if (i > 0) {
          jobIdFilterStr += ' OR ';
        }

        jobIdFilterStr += 'job_id:';
        jobIdFilterStr += jobId;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    } // Add in term queries for each of the specified criteria.


    criteriaFields.forEach(criteria => {
      boolCriteria.push({
        term: {
          [criteria.fieldName]: criteria.fieldValue
        }
      });
    });

    if (functionDescription !== undefined) {
      boolCriteria.push({
        term: {
          function_description: functionDescription
        }
      });
    }

    if (influencersFilterQuery !== undefined) {
      boolCriteria.push(influencersFilterQuery);
    } // Add a nested query to filter for each of the specified influencers.


    if (influencers.length > 0) {
      boolCriteria.push({
        bool: {
          should: influencers.map(influencer => {
            return {
              nested: {
                path: 'influencers',
                query: {
                  bool: {
                    must: [{
                      match: {
                        'influencers.influencer_field_name': influencer.fieldName
                      }
                    }, {
                      match: {
                        'influencers.influencer_field_values': influencer.fieldValue
                      }
                    }]
                  }
                }
              }
            };
          }),
          minimum_should_match: 1
        }
      });
    }

    const {
      body
    } = await mlClient.anomalySearch({
      size: maxRecords,
      body: {
        query: {
          bool: {
            filter: [{
              query_string: {
                query: 'result_type:record',
                analyze_wildcard: false
              }
            }, {
              bool: {
                must: boolCriteria
              }
            }]
          }
        },
        sort: [{
          record_score: {
            order: 'desc'
          }
        }]
      }
    }, []);
    const tableData = {
      anomalies: [],
      interval: 'second'
    };

    if (body.hits.total.value > 0) {
      let records = [];
      body.hits.hits.forEach(hit => {
        records.push(hit._source);
      }); // Sort anomalies in ascending time order.

      records = (0, _lodash.sortBy)(records, 'timestamp');
      tableData.interval = aggregationInterval;

      if (aggregationInterval === 'auto') {
        // Determine the actual interval to use if aggregating.
        const earliest = (0, _moment.default)(records[0].timestamp);
        const latest = (0, _moment.default)(records[records.length - 1].timestamp);
        const daysDiff = latest.diff(earliest, 'days');
        tableData.interval = daysDiff < 2 ? 'hour' : 'day';
      }

      tableData.anomalies = (0, _build_anomaly_table_items.buildAnomalyTableItems)(records, tableData.interval, dateFormatTz); // Load examples for any categorization anomalies.

      const categoryAnomalies = tableData.anomalies.filter(item => item.entityName === 'mlcategory');

      if (categoryAnomalies.length > 0) {
        tableData.examplesByJobId = {};
        const categoryIdsByJobId = {};
        categoryAnomalies.forEach(anomaly => {
          if (categoryIdsByJobId[anomaly.jobId] === undefined) {
            categoryIdsByJobId[anomaly.jobId] = [];
          }

          if (categoryIdsByJobId[anomaly.jobId].indexOf(anomaly.entityValue) === -1) {
            categoryIdsByJobId[anomaly.jobId].push(anomaly.entityValue);
          }
        });
        const categoryJobIds = Object.keys(categoryIdsByJobId);
        await Promise.all(categoryJobIds.map(async jobId => {
          const examplesByCategoryId = await getCategoryExamples(jobId, categoryIdsByJobId[jobId], maxExamples);

          if (tableData.examplesByJobId !== undefined) {
            tableData.examplesByJobId[jobId] = examplesByCategoryId;
          }
        }));
      }
    }

    return tableData;
  } // Returns the maximum anomaly_score for result_type:bucket over jobIds for the interval passed in


  async function getMaxAnomalyScore(jobIds = [], earliestMs, latestMs) {
    // Build the criteria to use in the bool filter part of the request.
    // Adds criteria for the time range plus any specified job IDs.
    const boolCriteria = [{
      range: {
        timestamp: {
          gte: earliestMs,
          lte: latestMs,
          format: 'epoch_millis'
        }
      }
    }];

    if (jobIds.length > 0) {
      let jobIdFilterStr = '';
      jobIds.forEach((jobId, i) => {
        if (i > 0) {
          jobIdFilterStr += ' OR ';
        }

        jobIdFilterStr += 'job_id:';
        jobIdFilterStr += jobId;
      });
      boolCriteria.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    }

    const query = {
      size: 0,
      body: {
        query: {
          bool: {
            filter: [{
              query_string: {
                query: 'result_type:bucket',
                analyze_wildcard: false
              }
            }, {
              bool: {
                must: boolCriteria
              }
            }]
          }
        },
        aggs: {
          max_score: {
            max: {
              field: 'anomaly_score'
            }
          }
        }
      }
    };
    const {
      body
    } = await mlClient.anomalySearch(query, []);
    const maxScore = (0, _lodash.get)(body, ['aggregations', 'max_score', 'value'], null);
    return {
      maxScore
    };
  } // Obtains the latest bucket result timestamp by job ID.
  // Returns data over all jobs unless an optional list of job IDs of interest is supplied.
  // Returned response consists of latest bucket timestamps (ms since Jan 1 1970) against job ID


  async function getLatestBucketTimestampByJob(jobIds = []) {
    const filter = [{
      term: {
        result_type: 'bucket'
      }
    }];

    if (jobIds.length > 0 && !(jobIds.length === 1 && jobIds[0] === '*')) {
      let jobIdFilterStr = '';
      jobIds.forEach((jobId, i) => {
        if (i > 0) {
          jobIdFilterStr += ' OR ';
        }

        jobIdFilterStr += 'job_id:';
        jobIdFilterStr += jobId;
      });
      filter.push({
        query_string: {
          analyze_wildcard: false,
          query: jobIdFilterStr
        }
      });
    } // Size of job terms agg, consistent with maximum number of jobs supported by Java endpoints.


    const maxJobs = 10000;
    const {
      body
    } = await mlClient.anomalySearch({
      size: 0,
      body: {
        query: {
          bool: {
            filter
          }
        },
        aggs: {
          byJobId: {
            terms: {
              field: 'job_id',
              size: maxJobs
            },
            aggs: {
              maxTimestamp: {
                max: {
                  field: 'timestamp'
                }
              }
            }
          }
        }
      }
    }, []);
    const bucketsByJobId = (0, _lodash.get)(body, ['aggregations', 'byJobId', 'buckets'], []);
    const timestampByJobId = {};
    bucketsByJobId.forEach(bucket => {
      timestampByJobId[bucket.key] = bucket.maxTimestamp.value;
    });
    return timestampByJobId;
  } // Obtains the categorization examples for the categories with the specified IDs
  // from the given index and job ID.
  // Returned response consists of a list of examples against category ID.


  async function getCategoryExamples(jobId, categoryIds, maxExamples) {
    const {
      body
    } = await mlClient.anomalySearch({
      size: _search.ANOMALIES_TABLE_DEFAULT_QUERY_SIZE,
      // Matches size of records in anomaly summary table.
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                job_id: jobId
              }
            }, {
              terms: {
                category_id: categoryIds
              }
            }]
          }
        }
      }
    }, []);
    const examplesByCategoryId = {};

    if (body.hits.total.value > 0) {
      body.hits.hits.forEach(hit => {
        if (maxExamples) {
          examplesByCategoryId[hit._source.category_id] = (0, _lodash.slice)(hit._source.examples, 0, Math.min(hit._source.examples.length, maxExamples));
        } else {
          examplesByCategoryId[hit._source.category_id] = hit._source.examples;
        }
      });
    }

    return examplesByCategoryId;
  } // Obtains the definition of the category with the specified ID and job ID.
  // Returned response contains four properties - categoryId, regex, examples
  // and terms (space delimited String of the common tokens matched in values of the category).


  async function getCategoryDefinition(jobId, categoryId) {
    const {
      body
    } = await mlClient.anomalySearch({
      size: 1,
      body: {
        query: {
          bool: {
            filter: [{
              term: {
                job_id: jobId
              }
            }, {
              term: {
                category_id: categoryId
              }
            }]
          }
        }
      }
    }, []);
    const definition = {
      categoryId,
      terms: null,
      regex: null,
      examples: []
    };

    if (body.hits.total.value > 0) {
      const source = body.hits.hits[0]._source;
      definition.categoryId = source.category_id;
      definition.regex = source.regex;
      definition.terms = source.terms;
      definition.examples = source.examples;
    }

    return definition;
  }

  async function getCategorizerStats(jobId, partitionByValue) {
    const mustMatchClauses = [{
      match: {
        result_type: 'categorizer_stats'
      }
    }];

    if (typeof partitionByValue === 'string') {
      mustMatchClauses.push({
        match: {
          partition_by_value: partitionByValue
        }
      });
    }

    const {
      body
    } = await mlClient.anomalySearch({
      body: {
        query: {
          bool: {
            must: mustMatchClauses,
            filter: [{
              term: {
                job_id: jobId
              }
            }]
          }
        }
      }
    }, []);
    return body ? body.hits.hits.map(r => r._source) : [];
  }

  async function getCategoryStoppedPartitions(jobIds, fieldToBucket = _anomalies.PARTITION_FIELD_VALUE) {
    let finalResults = {
      jobs: {}
    }; // first determine from job config if stop_on_warn is true
    // if false return []

    const {
      body
    } = await mlClient.getJobs({
      job_id: jobIds.join()
    });

    if (!body || body.jobs.length < 1) {
      throw _boom.default.notFound(`Unable to find anomaly detector jobs ${jobIds.join(', ')}`);
    }

    const jobIdsWithStopOnWarnSet = body.jobs.filter(jobConfig => {
      var _jobConfig$analysis_c, _jobConfig$analysis_c2;

      return ((_jobConfig$analysis_c = jobConfig.analysis_config) === null || _jobConfig$analysis_c === void 0 ? void 0 : (_jobConfig$analysis_c2 = _jobConfig$analysis_c.per_partition_categorization) === null || _jobConfig$analysis_c2 === void 0 ? void 0 : _jobConfig$analysis_c2.stop_on_warn) === true;
    }).map(j => j.job_id);
    let aggs;

    if (fieldToBucket === _anomalies.JOB_ID) {
      // if bucketing by job_id, then return list of job_ids with at least one stopped_partitions
      aggs = {
        unique_terms: {
          terms: {
            field: _anomalies.JOB_ID
          }
        }
      };
    } else {
      // if bucketing by partition field value, then return list of unique stopped_partitions for each job
      aggs = {
        jobs: {
          terms: {
            field: _anomalies.JOB_ID
          },
          aggs: {
            unique_stopped_partitions: {
              terms: {
                field: _anomalies.PARTITION_FIELD_VALUE
              }
            }
          }
        }
      };
    }

    if (jobIdsWithStopOnWarnSet.length > 0) {
      // search for categorizer_stats documents for the current job where the categorization_status is warn
      // Return all the partition_field_value values from the documents found
      const mustMatchClauses = [{
        match: {
          result_type: 'categorizer_stats'
        }
      }, {
        match: {
          categorization_status: 'warn'
        }
      }];
      const {
        body: results
      } = await mlClient.anomalySearch({
        size: 0,
        body: {
          query: {
            bool: {
              must: mustMatchClauses,
              filter: [{
                terms: {
                  job_id: jobIdsWithStopOnWarnSet
                }
              }]
            }
          },
          aggs
        }
      }, []);

      if (fieldToBucket === _anomalies.JOB_ID) {
        var _results$aggregations, _results$aggregations2;

        finalResults = {
          jobs: (_results$aggregations = results.aggregations) === null || _results$aggregations === void 0 ? void 0 : (_results$aggregations2 = _results$aggregations.unique_terms) === null || _results$aggregations2 === void 0 ? void 0 : _results$aggregations2.buckets.map(b => b.key)
        };
      } else if (fieldToBucket === _anomalies.PARTITION_FIELD_VALUE) {
        const jobs = jobIdsWithStopOnWarnSet.reduce((obj, jobId) => {
          obj[jobId] = [];
          return obj;
        }, {});
        results.aggregations.jobs.buckets.forEach(bucket => {
          jobs[bucket.key] = bucket.unique_stopped_partitions.buckets.map(b => b.key);
        });
        finalResults.jobs = jobs;
      }
    }

    return finalResults;
  }

  return {
    getAnomaliesTableData,
    getCategoryDefinition,
    getCategoryExamples,
    getLatestBucketTimestampByJob,
    getMaxAnomalyScore,
    getPartitionFieldsValues: (0, _get_partition_fields_values.getPartitionFieldsValuesFactory)(mlClient),
    getCategorizerStats,
    getCategoryStoppedPartitions
  };
}