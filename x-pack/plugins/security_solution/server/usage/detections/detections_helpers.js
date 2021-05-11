"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMlJobMetrics = exports.getMlJobsUsage = exports.getRulesUsage = exports.initialMlJobsUsage = exports.initialRulesUsage = void 0;

var _constants = require("../../../common/constants");

var _helpers = require("../../../common/machine_learning/helpers");

var _is_security_job = require("../../../common/machine_learning/is_security_job");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const isElasticRule = tags => tags.includes(`${_constants.INTERNAL_IMMUTABLE_KEY}:true`);
/**
 * Default detection rule usage count
 */


const initialRulesUsage = {
  custom: {
    enabled: 0,
    disabled: 0
  },
  elastic: {
    enabled: 0,
    disabled: 0
  }
};
/**
 * Default ml job usage count
 */

exports.initialRulesUsage = initialRulesUsage;
const initialMlJobsUsage = {
  custom: {
    enabled: 0,
    disabled: 0
  },
  elastic: {
    enabled: 0,
    disabled: 0
  }
};
exports.initialMlJobsUsage = initialMlJobsUsage;

const updateRulesUsage = (ruleMetric, usage) => {
  const {
    isEnabled,
    isElastic
  } = ruleMetric;

  if (isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        enabled: usage.elastic.enabled + 1
      }
    };
  } else if (!isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        disabled: usage.elastic.disabled + 1
      }
    };
  } else if (isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        enabled: usage.custom.enabled + 1
      }
    };
  } else if (!isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        disabled: usage.custom.disabled + 1
      }
    };
  } else {
    return usage;
  }
};

const updateMlJobsUsage = (jobMetric, usage) => {
  const {
    isEnabled,
    isElastic
  } = jobMetric;

  if (isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        enabled: usage.elastic.enabled + 1
      }
    };
  } else if (!isEnabled && isElastic) {
    return { ...usage,
      elastic: { ...usage.elastic,
        disabled: usage.elastic.disabled + 1
      }
    };
  } else if (isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        enabled: usage.custom.enabled + 1
      }
    };
  } else if (!isEnabled && !isElastic) {
    return { ...usage,
      custom: { ...usage.custom,
        disabled: usage.custom.disabled + 1
      }
    };
  } else {
    return usage;
  }
};

const getRulesUsage = async (index, esClient) => {
  let rulesUsage = initialRulesUsage;
  const ruleSearchOptions = {
    body: {
      query: {
        bool: {
          filter: {
            term: {
              'alert.alertTypeId': _constants.SIGNALS_ID
            }
          }
        }
      }
    },
    filterPath: ['hits.hits._source.alert.enabled', 'hits.hits._source.alert.tags'],
    ignoreUnavailable: true,
    index,
    size: 10000 // elasticsearch index.max_result_window default value

  };

  try {
    var _ruleResults$hits, _ruleResults$hits$hit;

    const {
      body: ruleResults
    } = await esClient.search(ruleSearchOptions);

    if (((_ruleResults$hits = ruleResults.hits) === null || _ruleResults$hits === void 0 ? void 0 : (_ruleResults$hits$hit = _ruleResults$hits.hits) === null || _ruleResults$hits$hit === void 0 ? void 0 : _ruleResults$hits$hit.length) > 0) {
      rulesUsage = ruleResults.hits.hits.reduce((usage, hit) => {
        const isElastic = isElasticRule(hit._source.alert.tags);
        const isEnabled = hit._source.alert.enabled;
        return updateRulesUsage({
          isElastic,
          isEnabled
        }, usage);
      }, initialRulesUsage);
    }
  } catch (e) {// ignore failure, usage will be zeroed
  }

  return rulesUsage;
};

exports.getRulesUsage = getRulesUsage;

const getMlJobsUsage = async (ml, savedObjectClient) => {
  let jobsUsage = initialMlJobsUsage;

  if (ml) {
    try {
      const fakeRequest = {
        headers: {}
      };
      const modules = await ml.modulesProvider(fakeRequest, savedObjectClient).listModules();
      const moduleJobs = modules.flatMap(module => module.jobs);
      const jobs = await ml.jobServiceProvider(fakeRequest, savedObjectClient).jobsSummary();
      jobsUsage = jobs.filter(_is_security_job.isSecurityJob).reduce((usage, job) => {
        const isElastic = moduleJobs.some(moduleJob => moduleJob.id === job.id);
        const isEnabled = (0, _helpers.isJobStarted)(job.jobState, job.datafeedState);
        return updateMlJobsUsage({
          isElastic,
          isEnabled
        }, usage);
      }, initialMlJobsUsage);
    } catch (e) {// ignore failure, usage will be zeroed
    }
  }

  return jobsUsage;
};

exports.getMlJobsUsage = getMlJobsUsage;

const getMlJobMetrics = async (ml, savedObjectClient) => {
  if (ml) {
    try {
      const fakeRequest = {
        headers: {}
      };
      const jobsType = 'security';
      const securityJobStats = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).jobStats(jobsType);
      const jobDetails = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).jobs(jobsType);
      const jobDetailsCache = new Map();
      jobDetails.jobs.forEach(detail => jobDetailsCache.set(detail.job_id, detail));
      const datafeedStats = await ml.anomalyDetectorsProvider(fakeRequest, savedObjectClient).datafeedStats();
      const datafeedStatsCache = new Map();
      datafeedStats.datafeeds.forEach(datafeedStat => datafeedStatsCache.set(`${datafeedStat.datafeed_id}`, datafeedStat));
      return securityJobStats.jobs.map(stat => {
        const jobId = stat.job_id;
        const jobDetail = jobDetailsCache.get(stat.job_id);
        const datafeed = datafeedStatsCache.get(`datafeed-${jobId}`);
        return {
          job_id: jobId,
          open_time: stat.open_time,
          create_time: jobDetail === null || jobDetail === void 0 ? void 0 : jobDetail.create_time,
          finished_time: jobDetail === null || jobDetail === void 0 ? void 0 : jobDetail.finished_time,
          state: stat.state,
          data_counts: {
            bucket_count: stat.data_counts.bucket_count,
            empty_bucket_count: stat.data_counts.empty_bucket_count,
            input_bytes: stat.data_counts.input_bytes,
            input_record_count: stat.data_counts.input_record_count,
            last_data_time: stat.data_counts.last_data_time,
            processed_record_count: stat.data_counts.processed_record_count
          },
          model_size_stats: {
            bucket_allocation_failures_count: stat.model_size_stats.bucket_allocation_failures_count,
            memory_status: stat.model_size_stats.memory_status,
            model_bytes: stat.model_size_stats.model_bytes,
            model_bytes_exceeded: stat.model_size_stats.model_bytes_exceeded,
            model_bytes_memory_limit: stat.model_size_stats.model_bytes_memory_limit,
            peak_model_bytes: stat.model_size_stats.peak_model_bytes
          },
          timing_stats: {
            average_bucket_processing_time_ms: stat.timing_stats.average_bucket_processing_time_ms,
            bucket_count: stat.timing_stats.bucket_count,
            exponential_average_bucket_processing_time_ms: stat.timing_stats.exponential_average_bucket_processing_time_ms,
            exponential_average_bucket_processing_time_per_hour_ms: stat.timing_stats.exponential_average_bucket_processing_time_per_hour_ms,
            maximum_bucket_processing_time_ms: stat.timing_stats.maximum_bucket_processing_time_ms,
            minimum_bucket_processing_time_ms: stat.timing_stats.minimum_bucket_processing_time_ms,
            total_bucket_processing_time_ms: stat.timing_stats.total_bucket_processing_time_ms
          },
          datafeed: {
            datafeed_id: datafeed === null || datafeed === void 0 ? void 0 : datafeed.datafeed_id,
            state: datafeed === null || datafeed === void 0 ? void 0 : datafeed.state,
            timing_stats: {
              average_search_time_per_bucket_ms: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.average_search_time_per_bucket_ms,
              bucket_count: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.bucket_count,
              exponential_average_search_time_per_hour_ms: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.exponential_average_search_time_per_hour_ms,
              search_count: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.search_count,
              total_search_time_ms: datafeed === null || datafeed === void 0 ? void 0 : datafeed.timing_stats.total_search_time_ms
            }
          }
        };
      });
    } catch (e) {// ignore failure, usage will be zeroed
    }
  }

  return [];
};

exports.getMlJobMetrics = getMlJobMetrics;