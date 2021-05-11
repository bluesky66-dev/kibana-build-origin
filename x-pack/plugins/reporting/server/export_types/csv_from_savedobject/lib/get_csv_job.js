"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getGenerateCsvParams = exports.getEsQueryConfig = void 0;

var _server = require("../../../../../../../src/plugins/data/server");

var _get_data_source = require("./get_data_source");

var _get_filters = require("./get_filters");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getEsQueryConfig = async config => {
  const configs = await Promise.all([config.get('query:allowLeadingWildcards'), config.get('query:queryString:options'), config.get('courier:ignoreFilterIfFieldNotInIndex')]);
  const [allowLeadingWildcards, queryStringOptions, ignoreFilterIfFieldNotInIndex] = configs;
  return {
    allowLeadingWildcards,
    queryStringOptions,
    ignoreFilterIfFieldNotInIndex
  };
};
/*
 * Create a CSV Job object for CSV From SavedObject to use as a job parameter
 * for generateCsv
 */


exports.getEsQueryConfig = getEsQueryConfig;

const getGenerateCsvParams = async (jobParams, panel, savedObjectsClient, uiConfig, logger) => {
  var _jobParams$post, _timerange;

  let timerange;

  if ((_jobParams$post = jobParams.post) !== null && _jobParams$post !== void 0 && _jobParams$post.timerange) {
    var _jobParams$post2;

    timerange = (_jobParams$post2 = jobParams.post) === null || _jobParams$post2 === void 0 ? void 0 : _jobParams$post2.timerange;
  } else {
    timerange = panel.timerange || null;
  }

  const {
    indexPatternSavedObjectId
  } = panel;
  const savedSearchObjectAttr = panel.attributes;
  const {
    indexPatternSavedObject
  } = await (0, _get_data_source.getDataSource)(savedObjectsClient, indexPatternSavedObjectId);
  const esQueryConfig = await getEsQueryConfig(uiConfig);
  const {
    kibanaSavedObjectMeta: {
      searchSource: {
        filter: [searchSourceFilter],
        query: searchSourceQuery
      }
    }
  } = savedSearchObjectAttr;
  const {
    timeFieldName: indexPatternTimeField,
    title: esIndex,
    fields: indexPatternFields
  } = indexPatternSavedObject;

  if (!indexPatternFields || indexPatternFields.length === 0) {
    logger.error(new Error(`No fields are selected in the saved search! Please select fields as columns in the saved search and try again.`));
  }

  let payloadQuery;
  let payloadSort = [];
  let docValueFields;

  if (jobParams.post && jobParams.post.state) {
    ({
      post: {
        state: {
          query: payloadQuery,
          sort: payloadSort = [],
          docvalue_fields: docValueFields
        }
      }
    } = jobParams);
  }

  const {
    includes,
    combinedFilter
  } = (0, _get_filters.getFilters)(indexPatternSavedObjectId, indexPatternTimeField, timerange, savedSearchObjectAttr, searchSourceFilter, payloadQuery);
  const savedSortConfigs = savedSearchObjectAttr.sort;
  const sortConfig = [...payloadSort];
  savedSortConfigs.forEach(([savedSortField, savedSortOrder]) => {
    sortConfig.push({
      [savedSortField]: {
        order: savedSortOrder
      }
    });
  });
  const scriptFieldsConfig = indexPatternFields && indexPatternFields.filter(f => f.scripted).reduce((accum, curr) => {
    return { ...accum,
      [curr.name]: {
        script: {
          source: curr.script,
          lang: curr.lang
        }
      }
    };
  }, {});
  const searchRequest = {
    index: esIndex,
    body: {
      _source: {
        includes
      },
      docvalue_fields: docValueFields,
      query: _server.esQuery.buildEsQuery( // compromise made while factoring out IIndexPattern type
      // @ts-expect-error
      indexPatternSavedObject, searchSourceQuery, combinedFilter, esQueryConfig),
      script_fields: scriptFieldsConfig,
      sort: sortConfig
    }
  };
  return {
    browserTimezone: (_timerange = timerange) === null || _timerange === void 0 ? void 0 : _timerange.timezone,
    indexPatternSavedObject,
    searchRequest,
    fields: includes,
    metaFields: [],
    conflictedTypesFields: []
  };
};

exports.getGenerateCsvParams = getGenerateCsvParams;