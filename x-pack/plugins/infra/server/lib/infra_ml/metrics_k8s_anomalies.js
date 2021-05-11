"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetricK8sAnomalies = getMetricK8sAnomalies;

var _performance_tracing = require("../../../common/performance_tracing");

var _common = require("./common");

var _infra_ml = require("../../../common/infra_ml");

var _errors = require("./errors");

var _runtime_types = require("../../../common/runtime_types");

var _metrics_k8s_anomalies = require("./queries/metrics_k8s_anomalies");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCompatibleAnomaliesJobIds(spaceId, sourceId, metric, mlAnomalyDetectors) {
  let metricsK8sJobIds = _infra_ml.metricsK8SJobTypes;

  if (metric) {
    metricsK8sJobIds = metricsK8sJobIds.filter(jt => jt === `k8s_${metric}`);
  }

  const jobIds = [];
  let jobSpans = [];

  try {
    await Promise.all(metricsK8sJobIds.map(jt => (0, _infra_ml.getJobId)(spaceId, sourceId, jt)).map(id => {
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

async function getMetricK8sAnomalies(context, sourceId, anomalyThreshold, startTime, endTime, metric, sort, pagination, influencerFilter) {
  const finalizeMetricsK8sAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('get metrics k8s entry anomalies');
  const {
    jobIds,
    timing: {
      spans: jobSpans
    }
  } = await getCompatibleAnomaliesJobIds(context.spaceId, sourceId, metric, context.mlAnomalyDetectors);

  if (jobIds.length === 0) {
    throw new _errors.InsufficientAnomalyMlJobsConfigured('Log rate or categorisation ML jobs need to be configured to search anomalies');
  }

  const {
    anomalies,
    paginationCursors,
    hasMoreEntries,
    timing: {
      spans: fetchLogEntryAnomaliesSpans
    }
  } = await fetchMetricK8sAnomalies(context.mlSystem, anomalyThreshold, jobIds, startTime, endTime, sort, pagination, influencerFilter);
  const data = anomalies.map(anomaly => {
    const {
      jobId
    } = anomaly;
    return parseAnomalyResult(anomaly, jobId);
  });
  const metricsK8sAnomaliesSpan = finalizeMetricsK8sAnomaliesSpan();
  return {
    data,
    paginationCursors,
    hasMoreEntries,
    timing: {
      spans: [metricsK8sAnomaliesSpan, ...jobSpans, ...fetchLogEntryAnomaliesSpans]
    }
  };
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
    startTime: anomalyStartTime,
    influencers,
    type: 'metrics_k8s',
    jobId
  };
};

async function fetchMetricK8sAnomalies(mlSystem, anomalyThreshold, jobIds, startTime, endTime, sort, pagination, influencerFilter) {
  // We'll request 1 extra entry on top of our pageSize to determine if there are
  // more entries to be fetched. This avoids scenarios where the client side can't
  // determine if entries.length === pageSize actually means there are more entries / next page
  // or not.
  const expandedPagination = { ...pagination,
    pageSize: pagination.pageSize + 1
  };
  const finalizeFetchLogEntryAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('fetch metrics k8s anomalies');
  const results = (0, _runtime_types.decodeOrThrow)(_metrics_k8s_anomalies.metricsK8sAnomaliesResponseRT)(await mlSystem.mlAnomalySearch((0, _metrics_k8s_anomalies.createMetricsK8sAnomaliesQuery)({
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
      bucket_span: duration,
      timestamp: anomalyStartTime,
      by_field_value: categoryId,
      influencers
    } = result._source;
    const podInfluencers = influencers.filter(i => i.influencer_field_name === 'kubernetes.pod.uid');
    return {
      id: result._id,
      anomalyScore,
      typical: typical[0],
      actual: actual[0],
      jobId: job_id,
      influencers: podInfluencers.reduce((acc, i) => [...acc, ...i.influencer_field_values], []),
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