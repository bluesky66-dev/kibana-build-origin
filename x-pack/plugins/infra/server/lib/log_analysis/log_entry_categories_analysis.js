"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopLogEntryCategories = getTopLogEntryCategories;
exports.getLogEntryCategoryDatasets = getLogEntryCategoryDatasets;
exports.getLogEntryCategoryExamples = getLogEntryCategoryExamples;
exports.fetchLogEntryCategories = fetchLogEntryCategories;

var _log_analysis = require("../../../common/log_analysis");

var _performance_tracing = require("../../../common/performance_tracing");

var _runtime_types = require("../../../common/runtime_types");

var _errors = require("./errors");

var _log_entry_categories = require("./queries/log_entry_categories");

var _log_entry_category_examples = require("./queries/log_entry_category_examples");

var _log_entry_category_histograms = require("./queries/log_entry_category_histograms");

var _top_log_entry_categories = require("./queries/top_log_entry_categories");

var _common = require("./common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getTopLogEntryCategories(context, sourceId, startTime, endTime, categoryCount, datasets, histograms, sort) {
  const finalizeTopLogEntryCategoriesSpan = (0, _performance_tracing.startTracingSpan)('get top categories');
  const logEntryCategoriesCountJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
  const {
    topLogEntryCategories,
    timing: {
      spans: fetchTopLogEntryCategoriesAggSpans
    }
  } = await fetchTopLogEntryCategories(context, logEntryCategoriesCountJobId, startTime, endTime, categoryCount, datasets, sort);
  const categoryIds = topLogEntryCategories.map(({
    categoryId
  }) => categoryId);
  const {
    logEntryCategoriesById,
    timing: {
      spans: fetchTopLogEntryCategoryPatternsSpans
    }
  } = await fetchLogEntryCategories(context, logEntryCategoriesCountJobId, categoryIds);
  const {
    categoryHistogramsById,
    timing: {
      spans: fetchTopLogEntryCategoryHistogramsSpans
    }
  } = await fetchTopLogEntryCategoryHistograms(context, logEntryCategoriesCountJobId, categoryIds, histograms);
  const topLogEntryCategoriesSpan = finalizeTopLogEntryCategoriesSpan();
  return {
    data: topLogEntryCategories.map(topCategory => {
      var _logEntryCategoriesBy, _logEntryCategoriesBy2, _categoryHistogramsBy;

      return { ...topCategory,
        regularExpression: (_logEntryCategoriesBy = (_logEntryCategoriesBy2 = logEntryCategoriesById[topCategory.categoryId]) === null || _logEntryCategoriesBy2 === void 0 ? void 0 : _logEntryCategoriesBy2._source.regex) !== null && _logEntryCategoriesBy !== void 0 ? _logEntryCategoriesBy : '',
        histograms: (_categoryHistogramsBy = categoryHistogramsById[topCategory.categoryId]) !== null && _categoryHistogramsBy !== void 0 ? _categoryHistogramsBy : []
      };
    }),
    timing: {
      spans: [topLogEntryCategoriesSpan, ...fetchTopLogEntryCategoriesAggSpans, ...fetchTopLogEntryCategoryPatternsSpans, ...fetchTopLogEntryCategoryHistogramsSpans]
    }
  };
}

async function getLogEntryCategoryDatasets(context, sourceId, startTime, endTime) {
  const logEntryCategoriesCountJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
  const jobIds = [logEntryCategoriesCountJobId];
  return await (0, _common.getLogEntryDatasets)(context.infra.mlSystem, startTime, endTime, jobIds);
}

async function getLogEntryCategoryExamples(context, sourceId, startTime, endTime, categoryId, exampleCount, sourceConfiguration) {
  var _customSettings$logs_, _customSettings$logs_2;

  const finalizeLogEntryCategoryExamplesSpan = (0, _performance_tracing.startTracingSpan)('get category example log entries');
  const logEntryCategoriesCountJobId = (0, _log_analysis.getJobId)(context.infra.spaceId, sourceId, _log_analysis.logEntryCategoriesJobTypes[0]);
  const {
    mlJob,
    timing: {
      spans: fetchMlJobSpans
    }
  } = await (0, _common.fetchMlJob)(context.infra.mlAnomalyDetectors, logEntryCategoriesCountJobId);
  const customSettings = (0, _runtime_types.decodeOrThrow)(_log_analysis.jobCustomSettingsRT)(mlJob.custom_settings);
  const indices = customSettings === null || customSettings === void 0 ? void 0 : (_customSettings$logs_ = customSettings.logs_source_config) === null || _customSettings$logs_ === void 0 ? void 0 : _customSettings$logs_.indexPattern;
  const timestampField = customSettings === null || customSettings === void 0 ? void 0 : (_customSettings$logs_2 = customSettings.logs_source_config) === null || _customSettings$logs_2 === void 0 ? void 0 : _customSettings$logs_2.timestampField;
  const tiebreakerField = sourceConfiguration.configuration.fields.tiebreaker;

  if (indices == null || timestampField == null) {
    throw new _errors.InsufficientLogAnalysisMlJobConfigurationError(`Failed to find index configuration for ml job ${logEntryCategoriesCountJobId}`);
  }

  const {
    logEntryCategoriesById,
    timing: {
      spans: fetchLogEntryCategoriesSpans
    }
  } = await fetchLogEntryCategories(context, logEntryCategoriesCountJobId, [categoryId]);
  const category = logEntryCategoriesById[categoryId];

  if (category == null) {
    throw new _errors.UnknownCategoryError(categoryId);
  }

  const {
    examples,
    timing: {
      spans: fetchLogEntryCategoryExamplesSpans
    }
  } = await fetchLogEntryCategoryExamples(context, indices, timestampField, tiebreakerField, startTime, endTime, category._source.terms, exampleCount);
  const logEntryCategoryExamplesSpan = finalizeLogEntryCategoryExamplesSpan();
  return {
    data: examples,
    timing: {
      spans: [logEntryCategoryExamplesSpan, ...fetchMlJobSpans, ...fetchLogEntryCategoriesSpans, ...fetchLogEntryCategoryExamplesSpans]
    }
  };
}

async function fetchTopLogEntryCategories(context, logEntryCategoriesCountJobId, startTime, endTime, categoryCount, datasets, sort) {
  var _topLogEntryCategorie, _topLogEntryCategorie2;

  const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('Fetch top categories from ES');
  const topLogEntryCategoriesResponse = (0, _runtime_types.decodeOrThrow)(_top_log_entry_categories.topLogEntryCategoriesResponseRT)(await context.infra.mlSystem.mlAnomalySearch((0, _top_log_entry_categories.createTopLogEntryCategoriesQuery)(logEntryCategoriesCountJobId, startTime, endTime, categoryCount, datasets, sort), [logEntryCategoriesCountJobId]));
  const esSearchSpan = finalizeEsSearchSpan();
  const topLogEntryCategories = (_topLogEntryCategorie = (_topLogEntryCategorie2 = topLogEntryCategoriesResponse.aggregations) === null || _topLogEntryCategorie2 === void 0 ? void 0 : _topLogEntryCategorie2.terms_category_id.buckets.map(topCategoryBucket => {
    var _topCategoryBucket$fi, _topCategoryBucket$fi2;

    const maximumAnomalyScoresByDataset = topCategoryBucket.filter_record.terms_dataset.buckets.reduce((accumulatedMaximumAnomalyScores, datasetFromRecord) => {
      var _datasetFromRecord$ma;

      return { ...accumulatedMaximumAnomalyScores,
        [datasetFromRecord.key]: (_datasetFromRecord$ma = datasetFromRecord.maximum_record_score.value) !== null && _datasetFromRecord$ma !== void 0 ? _datasetFromRecord$ma : 0
      };
    }, {});
    return {
      categoryId: parseCategoryId(topCategoryBucket.key),
      logEntryCount: (_topCategoryBucket$fi = topCategoryBucket.filter_model_plot.sum_actual.value) !== null && _topCategoryBucket$fi !== void 0 ? _topCategoryBucket$fi : 0,
      datasets: topCategoryBucket.filter_model_plot.terms_dataset.buckets.map(datasetBucket => {
        var _maximumAnomalyScores;

        return {
          name: datasetBucket.key,
          maximumAnomalyScore: (_maximumAnomalyScores = maximumAnomalyScoresByDataset[datasetBucket.key]) !== null && _maximumAnomalyScores !== void 0 ? _maximumAnomalyScores : 0
        };
      }).sort(_log_analysis.compareDatasetsByMaximumAnomalyScore).reverse(),
      maximumAnomalyScore: (_topCategoryBucket$fi2 = topCategoryBucket.filter_record.maximum_record_score.value) !== null && _topCategoryBucket$fi2 !== void 0 ? _topCategoryBucket$fi2 : 0
    };
  })) !== null && _topLogEntryCategorie !== void 0 ? _topLogEntryCategorie : [];
  return {
    topLogEntryCategories,
    timing: {
      spans: [esSearchSpan]
    }
  };
}

async function fetchLogEntryCategories(context, logEntryCategoriesCountJobId, categoryIds) {
  if (categoryIds.length === 0) {
    return {
      logEntryCategoriesById: {},
      timing: {
        spans: []
      }
    };
  }

  const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('Fetch category patterns from ES');
  const logEntryCategoriesResponse = (0, _runtime_types.decodeOrThrow)(_log_entry_categories.logEntryCategoriesResponseRT)(await context.infra.mlSystem.mlAnomalySearch((0, _log_entry_categories.createLogEntryCategoriesQuery)(logEntryCategoriesCountJobId, categoryIds), [logEntryCategoriesCountJobId]));
  const esSearchSpan = finalizeEsSearchSpan();
  const logEntryCategoriesById = logEntryCategoriesResponse.hits.hits.reduce((accumulatedCategoriesById, categoryHit) => ({ ...accumulatedCategoriesById,
    [categoryHit._source.category_id]: categoryHit
  }), {});
  return {
    logEntryCategoriesById,
    timing: {
      spans: [esSearchSpan]
    }
  };
}

async function fetchTopLogEntryCategoryHistograms(context, logEntryCategoriesCountJobId, categoryIds, histograms) {
  if (categoryIds.length === 0 || histograms.length === 0) {
    return {
      categoryHistogramsById: {},
      timing: {
        spans: []
      }
    };
  }

  const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('Fetch category histograms from ES');
  const categoryHistogramsReponses = await Promise.all(histograms.map(({
    bucketCount,
    endTime,
    id: histogramId,
    startTime
  }) => context.infra.mlSystem.mlAnomalySearch((0, _log_entry_category_histograms.createLogEntryCategoryHistogramsQuery)(logEntryCategoriesCountJobId, categoryIds, startTime, endTime, bucketCount), [logEntryCategoriesCountJobId]).then((0, _runtime_types.decodeOrThrow)(_log_entry_category_histograms.logEntryCategoryHistogramsResponseRT)).then(response => ({
    histogramId,
    histogramBuckets: response.aggregations.filters_categories.buckets
  }))));
  const esSearchSpan = finalizeEsSearchSpan();
  const categoryHistogramsById = Object.values(categoryHistogramsReponses).reduce((outerAccumulatedHistograms, {
    histogramId,
    histogramBuckets
  }) => Object.entries(histogramBuckets).reduce((innerAccumulatedHistograms, [categoryBucketKey, categoryBucket]) => {
    var _innerAccumulatedHist;

    const categoryId = parseCategoryId(categoryBucketKey);
    return { ...innerAccumulatedHistograms,
      [categoryId]: [...((_innerAccumulatedHist = innerAccumulatedHistograms[categoryId]) !== null && _innerAccumulatedHist !== void 0 ? _innerAccumulatedHist : []), {
        histogramId,
        buckets: categoryBucket.histogram_timestamp.buckets.map(bucket => ({
          bucketDuration: categoryBucket.histogram_timestamp.meta.bucketDuration,
          logEntryCount: bucket.sum_actual.value,
          startTime: bucket.key
        }))
      }]
    };
  }, outerAccumulatedHistograms), {});
  return {
    categoryHistogramsById,
    timing: {
      spans: [esSearchSpan]
    }
  };
}

async function fetchLogEntryCategoryExamples(requestContext, indices, timestampField, tiebreakerField, startTime, endTime, categoryQuery, exampleCount) {
  const finalizeEsSearchSpan = (0, _performance_tracing.startTracingSpan)('Fetch examples from ES');
  const {
    hits: {
      hits
    }
  } = (0, _runtime_types.decodeOrThrow)(_log_entry_category_examples.logEntryCategoryExamplesResponseRT)(await requestContext.core.elasticsearch.legacy.client.callAsCurrentUser('search', (0, _log_entry_category_examples.createLogEntryCategoryExamplesQuery)(indices, timestampField, tiebreakerField, startTime, endTime, categoryQuery, exampleCount)));
  const esSearchSpan = finalizeEsSearchSpan();
  return {
    examples: hits.map(hit => {
      var _hit$fields$eventDat, _hit$fields$eventDat2, _hit$fields$message$, _hit$fields$message;

      return {
        id: hit._id,
        dataset: (_hit$fields$eventDat = (_hit$fields$eventDat2 = hit.fields['event.dataset']) === null || _hit$fields$eventDat2 === void 0 ? void 0 : _hit$fields$eventDat2[0]) !== null && _hit$fields$eventDat !== void 0 ? _hit$fields$eventDat : '',
        message: (_hit$fields$message$ = (_hit$fields$message = hit.fields.message) === null || _hit$fields$message === void 0 ? void 0 : _hit$fields$message[0]) !== null && _hit$fields$message$ !== void 0 ? _hit$fields$message$ : '',
        timestamp: hit.sort[0],
        tiebreaker: hit.sort[1],
        context: getContextFromFields(hit.fields)
      };
    }),
    timing: {
      spans: [esSearchSpan]
    }
  };
}

const parseCategoryId = rawCategoryId => parseInt(rawCategoryId, 10);

const getContextFromFields = fields => {
  var _fields$containerId, _fields$hostName, _fields$logFilePath;

  const containerId = (_fields$containerId = fields['container.id']) === null || _fields$containerId === void 0 ? void 0 : _fields$containerId[0];
  const hostName = (_fields$hostName = fields['host.name']) === null || _fields$hostName === void 0 ? void 0 : _fields$hostName[0];
  const logFilePath = (_fields$logFilePath = fields['log.file.path']) === null || _fields$logFilePath === void 0 ? void 0 : _fields$logFilePath[0];

  if (typeof containerId === 'string') {
    return {
      'container.id': containerId
    };
  }

  if (typeof hostName === 'string' && typeof logFilePath === 'string') {
    return {
      'host.name': hostName,
      'log.file.path': logFilePath
    };
  }

  return {};
};