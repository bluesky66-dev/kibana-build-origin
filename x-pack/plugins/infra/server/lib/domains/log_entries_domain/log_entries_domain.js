"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InfraLogEntriesDomain = exports.LOG_ENTRIES_PAGE_SIZE = void 0;

var _sources = require("../../sources");

var _builtin_rules = require("../../../services/log_entries/message/builtin_rules");

var _message = require("../../../services/log_entries/message/message");

var _runtime_types = require("../../../../common/runtime_types");

var _log_entry_datasets = require("./queries/log_entry_datasets");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const LOG_ENTRIES_PAGE_SIZE = 200;
exports.LOG_ENTRIES_PAGE_SIZE = LOG_ENTRIES_PAGE_SIZE;
const FIELDS_FROM_CONTEXT = ['log.file.path', 'host.name', 'container.id'];
const COMPOSITE_AGGREGATION_BATCH_SIZE = 1000;

class InfraLogEntriesDomain {
  constructor(adapter, libs) {
    this.adapter = adapter;
    this.libs = libs;
  }

  async getLogEntriesAround(requestContext, sourceId, params, columnOverrides) {
    const {
      startTimestamp,
      endTimestamp,
      center,
      query,
      size,
      highlightTerm
    } = params;
    /*
     * For odd sizes we will round this value down for the first half, and up
     * for the second. This keeps the center cursor right in the center.
     *
     * For even sizes the half before is one entry bigger than the half after.
     * [1, 2, 3, 4, 5, *6*, 7, 8, 9, 10]
     *  | 5 entries |       |4 entries|
     */

    const halfSize = (size || LOG_ENTRIES_PAGE_SIZE) / 2;
    const {
      entries: entriesBefore,
      hasMoreBefore
    } = await this.getLogEntries(requestContext, sourceId, {
      startTimestamp,
      endTimestamp,
      query,
      cursor: {
        before: center
      },
      size: Math.floor(halfSize),
      highlightTerm
    }, columnOverrides);
    /*
     * Elasticsearch's `search_after` returns documents after the specified cursor.
     * - If we have documents before the center, we search after the last of
     *   those. The first document of the new group is the center.
     * - If there were no documents, we search one milisecond before the
     *   center. It then becomes the first document.
     */

    const cursorAfter = entriesBefore.length > 0 ? entriesBefore[entriesBefore.length - 1].cursor : {
      time: center.time - 1,
      tiebreaker: 0
    };
    const {
      entries: entriesAfter,
      hasMoreAfter
    } = await this.getLogEntries(requestContext, sourceId, {
      startTimestamp,
      endTimestamp,
      query,
      cursor: {
        after: cursorAfter
      },
      size: Math.ceil(halfSize),
      highlightTerm
    });
    return {
      entries: [...entriesBefore, ...entriesAfter],
      hasMoreBefore,
      hasMoreAfter
    };
  }

  async getLogEntries(requestContext, sourceId, params, columnOverrides) {
    const {
      configuration
    } = await this.libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
    const columnDefinitions = columnOverrides !== null && columnOverrides !== void 0 ? columnOverrides : configuration.logColumns;
    const messageFormattingRules = (0, _message.compileFormattingRules)((0, _builtin_rules.getBuiltinRules)(configuration.fields.message));
    const requiredFields = getRequiredFields(configuration, messageFormattingRules);
    const {
      documents,
      hasMoreBefore,
      hasMoreAfter
    } = await this.adapter.getLogEntries(requestContext, configuration, requiredFields, params);
    const entries = documents.map(doc => {
      return {
        id: doc.id,
        index: doc.index,
        cursor: doc.cursor,
        columns: columnDefinitions.map(column => {
          if ('timestampColumn' in column) {
            return {
              columnId: column.timestampColumn.id,
              timestamp: doc.cursor.time
            };
          } else if ('messageColumn' in column) {
            return {
              columnId: column.messageColumn.id,
              message: messageFormattingRules.format(doc.fields, doc.highlights)
            };
          } else {
            var _doc$fields$column$fi, _doc$highlights$colum;

            return {
              columnId: column.fieldColumn.id,
              field: column.fieldColumn.field,
              value: (_doc$fields$column$fi = doc.fields[column.fieldColumn.field]) !== null && _doc$fields$column$fi !== void 0 ? _doc$fields$column$fi : [],
              highlights: (_doc$highlights$colum = doc.highlights[column.fieldColumn.field]) !== null && _doc$highlights$colum !== void 0 ? _doc$highlights$colum : []
            };
          }
        }),
        context: getContextFromDoc(doc)
      };
    });
    return {
      entries,
      hasMoreBefore,
      hasMoreAfter
    };
  }

  async getLogSummaryBucketsBetween(requestContext, sourceId, start, end, bucketSize, filterQuery) {
    const {
      configuration
    } = await this.libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
    const dateRangeBuckets = await this.adapter.getContainedLogSummaryBuckets(requestContext, configuration, start, end, bucketSize, filterQuery);
    return dateRangeBuckets;
  }

  async getLogSummaryHighlightBucketsBetween(requestContext, sourceId, startTimestamp, endTimestamp, bucketSize, highlightQueries, filterQuery) {
    const {
      configuration
    } = await this.libs.sources.getSourceConfiguration(requestContext.core.savedObjects.client, sourceId);
    const messageFormattingRules = (0, _message.compileFormattingRules)((0, _builtin_rules.getBuiltinRules)(configuration.fields.message));
    const requiredFields = getRequiredFields(configuration, messageFormattingRules);
    const summaries = await Promise.all(highlightQueries.map(async highlightQueryPhrase => {
      const highlightQuery = createHighlightQueryDsl(highlightQueryPhrase, requiredFields);
      const query = filterQuery ? {
        bool: {
          must: [filterQuery, highlightQuery]
        }
      } : highlightQuery;
      const summaryBuckets = await this.adapter.getContainedLogSummaryBuckets(requestContext, configuration, startTimestamp, endTimestamp, bucketSize, query);
      const summaryHighlightBuckets = summaryBuckets.filter(logSummaryBucketHasEntries).map(convertLogSummaryBucketToSummaryHighlightBucket);
      return summaryHighlightBuckets;
    }));
    return summaries;
  }

  async getLogEntryDatasets(requestContext, timestampField, indexName, startTime, endTime) {
    let datasetBuckets = [];
    let afterLatestBatchKey;

    while (true) {
      const datasetsReponse = await this.libs.framework.callWithRequest(requestContext, 'search', (0, _log_entry_datasets.createLogEntryDatasetsQuery)(indexName, timestampField, startTime, endTime, COMPOSITE_AGGREGATION_BATCH_SIZE, afterLatestBatchKey));
      const {
        after_key: afterKey,
        buckets: latestBatchBuckets
      } = (0, _runtime_types.decodeOrThrow)(_log_entry_datasets.logEntryDatasetsResponseRT)(datasetsReponse).aggregations.dataset_buckets;
      datasetBuckets = [...datasetBuckets, ...latestBatchBuckets];
      afterLatestBatchKey = afterKey;

      if (latestBatchBuckets.length < COMPOSITE_AGGREGATION_BATCH_SIZE) {
        break;
      }
    }

    return datasetBuckets.map(({
      key: {
        dataset
      }
    }) => dataset);
  }

}

exports.InfraLogEntriesDomain = InfraLogEntriesDomain;

const logSummaryBucketHasEntries = bucket => bucket.entriesCount > 0 && bucket.topEntryKeys.length > 0;

const convertLogSummaryBucketToSummaryHighlightBucket = bucket => ({
  entriesCount: bucket.entriesCount,
  start: bucket.start,
  end: bucket.end,
  representativeKey: bucket.topEntryKeys[0]
});

const getRequiredFields = (configuration, messageFormattingRules) => {
  const fieldsFromCustomColumns = configuration.logColumns.reduce((accumulatedFields, logColumn) => {
    if (_sources.SavedSourceConfigurationFieldColumnRuntimeType.is(logColumn)) {
      return [...accumulatedFields, logColumn.fieldColumn.field];
    }

    return accumulatedFields;
  }, []);
  const fieldsFromFormattingRules = messageFormattingRules.requiredFields;
  return Array.from(new Set([...fieldsFromCustomColumns, ...fieldsFromFormattingRules, ...FIELDS_FROM_CONTEXT]));
};

const createHighlightQueryDsl = (phrase, fields) => ({
  multi_match: {
    fields,
    lenient: true,
    query: phrase,
    type: 'phrase'
  }
});

const getContextFromDoc = doc => {
  var _doc$fields$container, _doc$fields$hostName, _doc$fields$logFile; // Get all context fields, then test for the presence and type of the ones that go together


  const containerId = (_doc$fields$container = doc.fields['container.id']) === null || _doc$fields$container === void 0 ? void 0 : _doc$fields$container[0];
  const hostName = (_doc$fields$hostName = doc.fields['host.name']) === null || _doc$fields$hostName === void 0 ? void 0 : _doc$fields$hostName[0];
  const logFilePath = (_doc$fields$logFile = doc.fields['log.file.path']) === null || _doc$fields$logFile === void 0 ? void 0 : _doc$fields$logFile[0];

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