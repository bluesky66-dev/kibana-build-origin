"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchProvider = fetchProvider;

var _lodash = require("lodash");

var _common = require("../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const defaultSearchQueryLanguageSetting = _common.DEFAULT_QUERY_LANGUAGE;

function fetchProvider(index) {
  return async ({
    esClient
  }) => {
    const [{
      body: response
    }, {
      body: config
    }] = await Promise.all([esClient.get({
      index,
      id: 'kql-telemetry:kql-telemetry'
    }, {
      ignore: [404]
    }), esClient.search({
      index,
      body: {
        query: {
          term: {
            type: 'config'
          }
        }
      }
    }, {
      ignore: [404]
    })]);
    const queryLanguageConfigValue = (0, _lodash.get)(config, `hits.hits[0]._source.config.${_common.UI_SETTINGS.SEARCH_QUERY_LANGUAGE}`); // search:queryLanguage can potentially be in four states in the .kibana index:
    // 1. undefined: this means the user has never touched this setting
    // 2. null: this means the user has touched the setting, but the current value matches the default
    // 3. 'kuery' or 'lucene': this means the user has explicitly selected the given non-default language
    //
    // It's nice to know if the user has never touched the setting or if they tried kuery then
    // went back to the default, so I preserve this info by prefixing the language name with
    // 'default-' when the value in .kibana is undefined (case #1).

    let defaultLanguage;

    if (queryLanguageConfigValue === undefined) {
      defaultLanguage = `default-${defaultSearchQueryLanguageSetting}`;
    } else if (queryLanguageConfigValue === null) {
      defaultLanguage = defaultSearchQueryLanguageSetting;
    } else {
      defaultLanguage = queryLanguageConfigValue;
    }

    const kqlTelemetryDoc = {
      optInCount: 0,
      optOutCount: 0,
      ...(0, _lodash.get)(response, '_source.kql-telemetry', {})
    };
    return { ...kqlTelemetryDoc,
      defaultQueryLanguage: defaultLanguage
    };
  };
}