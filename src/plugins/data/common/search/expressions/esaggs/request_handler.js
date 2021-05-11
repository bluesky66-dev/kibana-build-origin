"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleRequest = void 0;

var _i18n = require("@kbn/i18n");

var _common = require("../../../../common");

var _tabify = require("../../tabify");

var _utils = require("../utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const handleRequest = async ({
  abortSignal,
  aggs,
  filters,
  indexPattern,
  inspectorAdapters,
  metricsAtAllLevels,
  partialRows,
  query,
  searchSessionId,
  searchSourceService,
  timeFields,
  timeRange,
  getNow
}) => {
  var _indexPattern$getTime;

  const forceNow = getNow === null || getNow === void 0 ? void 0 : getNow();
  const searchSource = await searchSourceService.create();
  searchSource.setField('index', indexPattern);
  searchSource.setField('size', 0); // Create a new search source that inherits the original search source
  // but has the appropriate timeRange applied via a filter.
  // This is a temporary solution until we properly pass down all required
  // information for the request to the request handler (https://github.com/elastic/kibana/issues/16641).
  // Using callParentStartHandlers: true we make sure, that the parent searchSource
  // onSearchRequestStart will be called properly even though we use an inherited
  // search source.

  const timeFilterSearchSource = searchSource.createChild({
    callParentStartHandlers: true
  });
  const requestSearchSource = timeFilterSearchSource.createChild({
    callParentStartHandlers: true
  });
  aggs.setTimeRange(timeRange); // For now we need to mirror the history of the passed search source, since
  // the request inspector wouldn't work otherwise.

  Object.defineProperty(requestSearchSource, 'history', {
    get() {
      return searchSource.history;
    },

    set(history) {
      return searchSource.history = history;
    }

  });
  requestSearchSource.setField('aggs', function () {
    return aggs.toDsl(metricsAtAllLevels);
  });
  requestSearchSource.onRequestStart((paramSearchSource, options) => {
    return aggs.onSearchRequestStart(paramSearchSource, options);
  }); // If timeFields have been specified, use the specified ones, otherwise use primary time field of index
  // pattern if it's available.

  const defaultTimeField = indexPattern === null || indexPattern === void 0 ? void 0 : (_indexPattern$getTime = indexPattern.getTimeField) === null || _indexPattern$getTime === void 0 ? void 0 : _indexPattern$getTime.call(indexPattern);
  const defaultTimeFields = defaultTimeField ? [defaultTimeField.name] : [];
  const allTimeFields = timeFields && timeFields.length > 0 ? timeFields : defaultTimeFields; // If a timeRange has been specified and we had at least one timeField available, create range
  // filters for that those time fields

  if (timeRange && allTimeFields.length > 0) {
    timeFilterSearchSource.setField('filter', () => {
      return allTimeFields.map(fieldName => (0, _common.getTime)(indexPattern, timeRange, {
        fieldName,
        forceNow
      })).filter(_common.isRangeFilter);
    });
  }

  requestSearchSource.setField('filter', filters);
  requestSearchSource.setField('query', query);
  let request;

  if (inspectorAdapters.requests) {
    inspectorAdapters.requests.reset();
    request = inspectorAdapters.requests.start(_i18n.i18n.translate('data.functions.esaggs.inspector.dataRequest.title', {
      defaultMessage: 'Data'
    }), {
      description: _i18n.i18n.translate('data.functions.esaggs.inspector.dataRequest.description', {
        defaultMessage: 'This request queries Elasticsearch to fetch the data for the visualization.'
      }),
      searchSessionId
    });
    request.stats((0, _utils.getRequestInspectorStats)(requestSearchSource));
  }

  try {
    const response = await requestSearchSource.fetch({
      abortSignal,
      sessionId: searchSessionId
    });

    if (request) {
      request.stats((0, _utils.getResponseInspectorStats)(response, searchSource)).ok({
        json: response
      });
    }

    searchSource.rawResponse = response;
  } catch (e) {
    // Log any error during request to the inspector
    if (request) {
      request.error({
        json: e
      });
    }

    throw e;
  } finally {
    // Add the request body no matter if things went fine or not
    if (request) {
      request.json(await requestSearchSource.getSearchRequestBody());
    }
  } // Note that rawResponse is not deeply cloned here, so downstream applications using courier
  // must take care not to mutate it, or it could have unintended side effects, e.g. displaying
  // response data incorrectly in the inspector.


  let response = searchSource.rawResponse;

  for (const agg of aggs.aggs) {
    if (agg.enabled && typeof agg.type.postFlightRequest === 'function') {
      response = await agg.type.postFlightRequest(response, aggs, agg, requestSearchSource, inspectorAdapters.requests, abortSignal, searchSessionId);
    }
  }

  const parsedTimeRange = timeRange ? (0, _common.calculateBounds)(timeRange, {
    forceNow
  }) : null;
  const tabifyParams = {
    metricsAtAllLevels,
    partialRows,
    timeRange: parsedTimeRange ? {
      from: parsedTimeRange.min,
      to: parsedTimeRange.max,
      timeFields: allTimeFields
    } : undefined
  };
  const tabifiedResponse = (0, _tabify.tabifyAggResponse)(aggs, response, tabifyParams);
  return tabifiedResponse;
};

exports.handleRequest = handleRequest;