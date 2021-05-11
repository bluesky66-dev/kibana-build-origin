"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricsHostsAnomalies = getMetricsHostsAnomalies;

var _performance_tracing = require("../../../common/performance_tracing");

var _common = require("./common");

var _infra_ml = require("../../../common/infra_ml");

var _errors = require("./errors");

var _runtime_types = require("../../../common/runtime_types");

var _metrics_hosts_anomalies = require("./queries/metrics_hosts_anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCompatibleAnomaliesJobIds(spaceId, sourceId, metric, mlAnomalyDetectors) {
  let metricsHostsJobIds = _infra_ml.metricsHostsJobTypes;

  if (metric) {
    metricsHostsJobIds = metricsHostsJobIds.filter(jt => jt === `hosts_${metric}`);
  }

  const jobIds = [];
  let jobSpans = [];

  try {
    await Promise.all(metricsHostsJobIds.map(jt => (0, _infra_ml.getJobId)(spaceId, sourceId, jt)).map(id => {
      return (async () => {
        const {
          timing: {
            spans
          }
        } = await (0, _common.fetchMlJob)(mlAnomalyDetectors, id);
        jobIds.push(id);
        jobSpans = [...jobSpans, ...spans];
      })();
    }));
  } catch (e) {
    if ((0, _errors.isMlPrivilegesError)(e)) {
      throw e;
    } // An error is also thrown when no jobs are found

  }

  return {
    jobIds,
    timing: {
      spans: jobSpans
    }
  };
}

async function getMetricsHostsAnomalies(context, sourceId, anomalyThreshold, startTime, endTime, metric, sort, pagination, influencerFilter) {
  const finalizeMetricsHostsAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('get metrics hosts entry anomalies');
  const {
    jobIds,
    timing: {
      spans: jobSpans
    }
  } = await getCompatibleAnomaliesJobIds(context.spaceId, sourceId, metric, context.mlAnomalyDetectors);

  if (jobIds.length === 0) {
    throw new _errors.InsufficientAnomalyMlJobsConfigured('Metrics Hosts ML jobs need to be configured to search anomalies');
  }

  try {
    const {
      anomalies,
      paginationCursors,
      hasMoreEntries,
      timing: {
        spans: fetchLogEntryAnomaliesSpans
      }
    } = await fetchMetricsHostsAnomalies(context.mlSystem, anomalyThreshold, jobIds, startTime, endTime, sort, pagination, influencerFilter);
    const data = anomalies.map(anomaly => {
      const {
        jobId
      } = anomaly;
      return parseAnomalyResult(anomaly, jobId);
    });
    const metricsHostsAnomaliesSpan = finalizeMetricsHostsAnomaliesSpan();
    return {
      data,
      paginationCursors,
      hasMoreEntries,
      timing: {
        spans: [metricsHostsAnomaliesSpan, ...jobSpans, ...fetchLogEntryAnomaliesSpans]
      }
    };
  } catch (e) {
    throw new Error(e);
  }
}

const parseAnomalyResult = (anomaly, jobId) => {
  const {
    id,
    anomalyScore,
    typical,
    actual,
    duration,
    influencers,
    startTime: anomalyStartTime
  } = anomaly;
  return {
    id,
    anomalyScore,
    typical,
    actual,
    duration,
    influencers,
    startTime: anomalyStartTime,
    type: 'metrics_hosts',
    jobId
  };
};

async function fetchMetricsHostsAnomalies(mlSystem, anomalyThreshold, jobIds, startTime, endTime, sort, pagination, influencerFilter) {
  // We'll request 1 extra entry on top of our pageSize to determine if there are
  // more entries to be fetched. This avoids scenarios where the client side can't
  // determine if entries.length === pageSize actually means there are more entries / next page
  // or not.
  const expandedPagination = { ...pagination,
    pageSize: pagination.pageSize + 1
  };
  const finalizeFetchLogEntryAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('fetch metrics hosts anomalies');
  const results = (0, _runtime_types.decodeOrThrow)(_metrics_hosts_anomalies.metricsHostsAnomaliesResponseRT)(await mlSystem.mlAnomalySearch((0, _metrics_hosts_anomalies.createMetricsHostsAnomaliesQuery)({
    jobIds,
    anomalyThreshold,
    startTime,
    endTime,
    sort,
    pagination: expandedPagination,
    influencerFilter
  }), jobIds));
  const {
    hits: {
      hits
    }
  } = results;
  const hasMoreEntries = hits.length > pagination.pageSize; // An extra entry was found and hasMoreEntries has been determined, the extra entry can be removed.

  if (hasMoreEntries) {
    hits.pop();
  } // To "search_before" the sort order will have been reversed for ES.
  // The results are now reversed back, to match the requested sort.


  if (pagination.cursor && 'searchBefore' in pagination.cursor) {
    hits.reverse();
  }

  const paginationCursors = hits.length > 0 ? {
    previousPageCursor: hits[0].sort,
    nextPageCursor: hits[hits.length - 1].sort
  } : undefined;
  const anomalies = hits.map(result => {
    const {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      job_id,
      record_score: anomalyScore,
      typical,
      actual,
      influencers,
      bucket_span: duration,
      timestamp: anomalyStartTime,
      by_field_value: categoryId
    } = result._source;
    const hostInfluencers = influencers.filter(i => i.influencer_field_name === 'host.name');
    return {
      id: result._id,
      anomalyScore,
      dataset: '',
      typical: typical[0],
      actual: actual[0],
      jobId: job_id,
      influencers: hostInfluencers.reduce((acc, i) => [...acc, ...i.influencer_field_values], []),
      startTime: anomalyStartTime,
      duration: duration * 1000,
      categoryId
    };
  });
  const fetchLogEntryAnomaliesSpan = finalizeFetchLogEntryAnomaliesSpan();
  return {
    anomalies,
    paginationCursors,
    hasMoreEntries,
    timing: {
      spans: [fetchLogEntryAnomaliesSpan]
    }
  };
}