"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFields = getFields;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _server = require("../../../data/server");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
async function getFields(requestContext, request, framework, indexPatternString) {
  const getIndexPatternsService = async () => {
    const [, {
      data
    }] = await framework.core.getStartServices();
    return await data.indexPatterns.indexPatternsServiceFactory(requestContext.core.savedObjects.client, requestContext.core.elasticsearch.client.asCurrentUser);
  };

  const indexPatternsService = await getIndexPatternsService(); // NOTE / TODO: This facade has been put in place to make migrating to the New Platform easier. It
  // removes the need to refactor many layers of dependencies on "req", and instead just augments the top
  // level object passed from here. The layers should be refactored fully at some point, but for now
  // this works and we are still using the New Platform services for these vis data portions.

  const reqFacade = {
    requestContext,
    ...request,
    framework,
    payload: {},
    pre: {
      indexPatternsFetcher: new _server.IndexPatternsFetcher(requestContext.core.elasticsearch.client.asCurrentUser)
    },
    getUiSettingsService: () => requestContext.core.uiSettings.client,
    getSavedObjectsClient: () => requestContext.core.savedObjects.client,
    getEsShardTimeout: async () => {
      return await framework.globalConfig$.pipe((0, _operators.first)(), (0, _operators.map)(config => config.elasticsearch.shardTimeout.asMilliseconds())).toPromise();
    },
    getIndexPatternsService: async () => indexPatternsService
  };

  if (!indexPatternString) {
    var _defaultIndexPattern$;

    const defaultIndexPattern = await indexPatternsService.getDefault();
    indexPatternString = (_defaultIndexPattern$ = defaultIndexPattern === null || defaultIndexPattern === void 0 ? void 0 : defaultIndexPattern.title) !== null && _defaultIndexPattern$ !== void 0 ? _defaultIndexPattern$ : '';
  }

  const {
    searchStrategy,
    capabilities
  } = await framework.searchStrategyRegistry.getViableStrategy(reqFacade, indexPatternString);
  const fields = await searchStrategy.getFieldsForWildcard(reqFacade, indexPatternString, capabilities);
  return (0, _lodash.uniqBy)(fields, field => field.name);
}