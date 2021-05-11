"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLogEntryAnomalies = getLogEntryAnomalies;
exports.getLogEntryExamples = getLogEntryExamples;
exports.fetchLogEntryExamples = fetchLogEntryExamples;
exports.getLogEntryAnomaliesDatasets = getLogEntryAnomaliesDatasets;

var _performance_tracing = require("../../../common/performance_tracing");

var _common = require("./common");

var _log_analysis = require("../../../common/log_analysis");

var _queries = require("./queries");

var _errors = require("./errors");

var _runtime_types = require("../../../common/runtime_types");

var _log_entry_examples = require("./queries/log_entry_examples");

var _log_entry_categories_analysis = require("./log_entry_categories_analysis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getCompatibleAnomaliesJobIds(spaceId, sourceId, mlAnomalyDetectors) {
  const logRateJobId = (0, _log_analysis.getJobId)(spaceId, sourceId, _log_analysis.logEntryRateJobTypes[0]);
  const logCategoriesJobId = (0, _log_analysis.getJobId)(spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
  const jobIds = [];
  let jobSpans = [];

  try {
    const {
      timing: {
        spans
      }
    } = await (0, _common.fetchMlJob)(mlAnomalyDetectors, logRateJobId);
    jobIds.push(logRateJobId);
    jobSpans = [...jobSpans, ...spans];
  } catch (e) {
    if ((0, _errors.isMlPrivilegesError)(e)) {
      throw e;
    } // An error is also thrown when no jobs are found

  }

  try {
    const {
      timing: {
        spans
      }
    } = await (0, _common.fetchMlJob)(mlAnomalyDetectors, logCategoriesJobId);
    jobIds.push(logCategoriesJobId);
    jobSpans = [...jobSpans, ...spans];
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

async function getLogEntryAnomalies(context, sourceId, startTime, endTime, sort, pagination, datasets) {
  const finalizeLogEntryAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('get log entry anomalies');
  const {
    jobIds,
    timing: {
      spans: jobSpans
    }
  } = await getCompatibleAnomaliesJobIds(context.infra.spaceId, sourceId, context.infra.mlAnomalyDetectors);

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
  } = await fetchLogEntryAnomalies(context.infra.mlSystem, jobIds, startTime, endTime, sort, pagination, datasets);
  const parsedAnomalies = anomalies.map(anomaly => {
    const {
      jobId
    } = anomaly;

    if (!anomaly.categoryId) {
      return parseLogRateAnomalyResult(anomaly, jobId);
    } else {
      return parseCategoryAnomalyResult(anomaly, jobId);
    }
  });
  const categoryIds = parsedAnomalies.reduce((acc, anomaly) => {
    return (0, _log_analysis.isCategoryAnomaly)(anomaly) ? [...acc, parseInt(anomaly.categoryId, 10)] : acc;
  }, []);
  const logEntryCategoriesCountJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
  const {
    logEntryCategoriesById
  } = await (0, _log_entry_categories_analysis.fetchLogEntryCategories)(context, logEntryCategoriesCountJobId, categoryIds);
  const parsedAnomaliesWithExpandedCategoryInformation = parsedAnomalies.map(anomaly => {
    if ((0, _log_analysis.isCategoryAnomaly)(anomaly)) {
      if (logEntryCategoriesById[parseInt(anomaly.categoryId, 10)]) {
        const {
          _source: {
            regex,
            terms
          }
        } = logEntryCategoriesById[parseInt(anomaly.categoryId, 10)];
        return { ...anomaly,
          ...{
            categoryRegex: regex,
            categoryTerms: terms
          }
        };
      } else {
        return { ...anomaly,
          ...{
            categoryRegex: '',
            categoryTerms: ''
          }
        };
      }
    } else {
      return anomaly;
    }
  });
  const logEntryAnomaliesSpan = finalizeLogEntryAnomaliesSpan();
  return {
    data: parsedAnomaliesWithExpandedCategoryInformation,
    paginationCursors,
    hasMoreEntries,
    timing: {
      spans: [logEntryAnomaliesSpan, ...jobSpans, ...fetchLogEntryAnomaliesSpans]
    }
  };
}

const parseLogRateAnomalyResult = (anomaly, jobId) => {
  const {
    id,
    anomalyScore,
    dataset,
    typical,
    actual,
    duration,
    startTime: anomalyStartTime
  } = anomaly;
  return {
    id,
    anomalyScore,
    dataset,
    typical,
    actual,
    duration,
    startTime: anomalyStartTime,
    type: 'logRate',
    jobId
  };
};

const parseCategoryAnomalyResult = (anomaly, jobId) => {
  const {
    id,
    anomalyScore,
    dataset,
    typical,
    actual,
    duration,
    startTime: anomalyStartTime,
    categoryId
  } = anomaly;
  return {
    id,
    anomalyScore,
    dataset,
    typical,
    actual,
    duration,
    startTime: anomalyStartTime,
    categoryId,
    type: 'logCategory',
    jobId
  };
};

async function fetchLogEntryAnomalies(mlSystem, jobIds, startTime, endTime, sort, pagination, datasets) {
  // We'll request 1 extra entry on top of our pageSize to determine if there are
  // more entries to be fetched. This avoids scenarios where the client side can't
  // determine if entries.length === pageSize actually means there are more entries / next page
  // or not.
  const expandedPagination = { ...pagination,
    pageSize: pagination.pageSize + 1
  };
  const finalizeFetchLogEntryAnomaliesSpan = (0, _performance_tracing.startTracingSpan)('fetch log entry anomalies');
  const results = (0, _runtime_types.decodeOrThrow)(_queries.logEntryAnomaliesResponseRT)(await mlSystem.mlAnomalySearch((0, _queries.createLogEntryAnomaliesQuery)(jobIds, startTime, endTime, sort, expandedPagination, datasets), jobIds));
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
      partition_field_value: dataset,
      bucket_span: duration,
      timestamp: anomalyStartTime,
      by_field_value: categoryId
    } = result.fields;
    return {
      id: result._id,
      anomalyScore: anomalyScore[0],
      dataset: dataset[0],
      typical: typical[0],
      actual: actual[0],
      jobId: job_id[0],
      startTime: parseInt(anomalyStartTime[0], 10),
      duration: duration[0] * 1000,
      categoryId: categoryId === null || categoryId === void 0 ? void 0 : categoryId[0]
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

async function getLogEntryExamples(context, sourceId, startTime, endTime, dataset, exampleCount, sourceConfiguration, callWithRequest, categoryId) {
  var _customSettings$logs_, _customSettings$logs_2;

  const finalizeLogEntryExamplesSpan = (0, _performance_tracing.startTracingSpan)('get log entry rate example log entries');
  const jobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, categoryId != null ? _log_analysis.logEntryCategoriesJobTypes[0] : _log_analysis.logEntryRateJobTypes[0]);
  const {
    mlJob,
    timing: {
      spans: fetchMlJobSpans
    }
  } = await (0, _common.fetchMlJob)(context.infra.mlAnomalyDetectors, jobId);
  const customSettings = (0, _runtime_types.decodeOrThrow)(_log_analysis.jobCustomSettingsRT)(mlJob.custom_settings);
  const indices = customSettings === null || customSettings === void 0 ? void 0 : (_customSettings$logs_ = customSettings.logs_source_config) === null || _customSettings$logs_ === void 0 ? void 0 : _customSettings$logs_.indexPattern;
  const timestampField = customSettings === null || customSettings === void 0 ? void 0 : (_customSettings$logs_2 = customSettings.logs_source_config) === null || _customSettings$logs_2 === void 0 ? void 0 : _customSettings$logs_2.timestampField;
  const tiebreakerField = sourceConfiguration.configuration.fields.tiebreaker;

  if (indices == null || timestampField == null) {
    throw new _errors.InsufficientLogAnalysisMlJobConfigurationError(`Failed to find index configuration for ml job ${jobId}`);
  }

  const {
    examples,
    timing: {
      spans: fetchLogEntryExamplesSpans
    }
  } = await fetchLogEntryExamples(context, sourceId, indices, timestampField, tiebreakerField, startTime, endTime, dataset, exampleCount, callWithRequest, categoryId);
  const logEntryExamplesSpan = finalizeLogEntryExamplesSpan();
  return {
    data: examples,
    timing: {
      spans: [logEntryExamplesSpan, ...fetchMlJobSpans, ...fetchLogEntryExamplesSpans]
    }
  };
}

async function fetchLogEntryExamples(context, sourceId, indices, timestampField, tiebreakerField, startTime, endTime, dataset, exampleCount, callWithRequest, categoryId) {
  const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('Fetch log rate examples from ES');
  let categoryQuery; // Examples should be further scoped to a specific ML category

  if (categoryId) {
    const parsedCategoryId = parseInt(categoryId, 10);
    const logEntryCategoriesCountJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
    const {
      logEntryCategoriesById
    } = await (0, _log_entry_categories_analysis.fetchLogEntryCategories)(context, logEntryCategoriesCountJobId, [parsedCategoryId]);
    const category = logEntryCategoriesById[parsedCategoryId];

    if (category == null) {
      throw new _errors.UnknownCategoryError(parsedCategoryId);
    }

    categoryQuery = category._source.terms;
  }

  const {
    hits: {
      hits
    }
  } = (0, _runtime_types.decodeOrThrow)(_log_entry_examples.logEntryExamplesResponseRT)(await callWithRequest(context, 'search', (0, _log_entry_examples.createLogEntryExamplesQuery)(indices, timestampField, tiebreakerField, startTime, endTime, dataset, exampleCount, categoryQuery)));
  const esSearchSpan = finalizeEsSearchSpan();
  return {
    examples: hits.map(hit => {
      var _hit$fields$eventDat, _hit$fields$eventDat2, _hit$fields$message$, _hit$fields$message;

      return {
        id: hit._id,
        dataset: (_hit$fields$eventDat = (_hit$fields$eventDat2 = hit.fields['event.dataset']) === null || _hit$fields$eventDat2 === void 0 ? void 0 : _hit$fields$eventDat2[0]) !== null && _hit$fields$eventDat !== void 0 ? _hit$fields$eventDat : '',
        message: (_hit$fields$message$ = (_hit$fields$message = hit.fields.message) === null || _hit$fields$message === void 0 ? void 0 : _hit$fields$message[0]) !== null && _hit$fields$message$ !== void 0 ? _hit$fields$message$ : '',
        timestamp: hit.sort[0],
        tiebreaker: hit.sort[1]
      };
    }),
    timing: {
      spans: [esSearchSpan]
    }
  };
}

async function getLogEntryAnomaliesDatasets(context, sourceId, startTime, endTime) {
  const {
    jobIds,
    timing: {
      spans: jobSpans
    }
  } = await getCompatibleAnomaliesJobIds(context.infra.spaceId, sourceId, context.infra.mlAnomalyDetectors);

  if (jobIds.length === 0) {
    throw new _errors.InsufficientAnomalyMlJobsConfigured('Log rate or categorisation ML jobs need to be configured to search for anomaly datasets');
  }

  const {
    data: datasets,
    timing: {
      spans: datasetsSpans
    }
  } = await (0, _common.getLogEntryDatasets)(context.infra.mlSystem, startTime, endTime, jobIds);
  return {
    datasets,
    timing: {
      spans: [...jobSpans, ...datasetsSpans]
    }
  };
}