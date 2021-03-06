"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stackManagementSchema = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stackManagementSchema = {
  // sensitive
  'timelion:quandl.key': {
    type: 'keyword'
  },
  'securitySolution:defaultIndex': {
    type: 'keyword'
  },
  'securitySolution:newsFeedUrl': {
    type: 'keyword'
  },
  'xpackReporting:customPdfLogo': {
    type: 'keyword'
  },
  'notifications:banner': {
    type: 'keyword'
  },
  'timelion:graphite.url': {
    type: 'keyword'
  },
  'xpackDashboardMode:roles': {
    type: 'keyword'
  },
  'securitySolution:ipReputationLinks': {
    type: 'keyword'
  },
  'xPack:defaultAdminEmail': {
    type: 'keyword'
  },
  // non-sensitive
  'visualize:enableLabs': {
    type: 'boolean'
  },
  'visualization:heatmap:maxBuckets': {
    type: 'long'
  },
  'visualization:colorMapping': {
    type: 'text'
  },
  'visualization:regionmap:showWarnings': {
    type: 'boolean'
  },
  'visualization:dimmingOpacity': {
    type: 'float'
  },
  'visualization:tileMap:maxPrecision': {
    type: 'long'
  },
  'csv:separator': {
    type: 'keyword'
  },
  'visualization:tileMap:WMSdefaults': {
    type: 'text'
  },
  'timelion:target_buckets': {
    type: 'long'
  },
  'timelion:max_buckets': {
    type: 'long'
  },
  'timelion:es.timefield': {
    type: 'keyword'
  },
  'timelion:min_interval': {
    type: 'keyword'
  },
  'timelion:default_rows': {
    type: 'long'
  },
  'timelion:default_columns': {
    type: 'long'
  },
  'timelion:es.default_index': {
    type: 'keyword'
  },
  'timelion:showTutorial': {
    type: 'boolean'
  },
  'securitySolution:timeDefaults': {
    type: 'keyword'
  },
  'securitySolution:defaultAnomalyScore': {
    type: 'long'
  },
  'securitySolution:refreshIntervalDefaults': {
    type: 'keyword'
  },
  'securitySolution:enableNewsFeed': {
    type: 'boolean'
  },
  'search:includeFrozen': {
    type: 'boolean'
  },
  'courier:maxConcurrentShardRequests': {
    type: 'long'
  },
  'courier:batchSearches': {
    type: 'boolean'
  },
  'courier:setRequestPreference': {
    type: 'keyword'
  },
  'courier:customRequestPreference': {
    type: 'keyword'
  },
  'courier:ignoreFilterIfFieldNotInIndex': {
    type: 'boolean'
  },
  'rollups:enableIndexPatterns': {
    type: 'boolean'
  },
  'notifications:lifetime:warning': {
    type: 'long'
  },
  'notifications:lifetime:banner': {
    type: 'long'
  },
  'notifications:lifetime:info': {
    type: 'long'
  },
  'notifications:lifetime:error': {
    type: 'long'
  },
  'doc_table:highlight': {
    type: 'boolean'
  },
  'discover:searchOnPageLoad': {
    type: 'boolean'
  },
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'doc_table:hideTimeColumn': {
    type: 'boolean'
  },
  'discover:sampleSize': {
    type: 'long'
  },
  defaultColumns: {
    type: 'array',
    items: {
      type: 'keyword'
    }
  },
  'context:defaultSize': {
    type: 'long'
  },
  'discover:aggs:terms:size': {
    type: 'long'
  },
  'context:tieBreakerFields': {
    type: 'array',
    items: {
      type: 'keyword'
    }
  },
  'discover:sort:defaultOrder': {
    type: 'keyword'
  },
  'context:step': {
    type: 'long'
  },
  'accessibility:disableAnimations': {
    type: 'boolean'
  },
  'ml:fileDataVisualizerMaxFileSize': {
    type: 'keyword'
  },
  'ml:anomalyDetection:results:enableTimeDefaults': {
    type: 'boolean'
  },
  'ml:anomalyDetection:results:timeDefaults': {
    type: 'keyword'
  },
  'truncate:maxHeight': {
    type: 'long'
  },
  'timepicker:timeDefaults': {
    type: 'keyword'
  },
  'timepicker:refreshIntervalDefaults': {
    type: 'keyword'
  },
  'timepicker:quickRanges': {
    type: 'keyword'
  },
  'theme:version': {
    type: 'keyword'
  },
  'theme:darkMode': {
    type: 'boolean'
  },
  'state:storeInSessionStorage': {
    type: 'boolean'
  },
  'savedObjects:perPage': {
    type: 'long'
  },
  'search:queryLanguage': {
    type: 'keyword'
  },
  'shortDots:enable': {
    type: 'boolean'
  },
  'sort:options': {
    type: 'keyword'
  },
  'savedObjects:listingLimit': {
    type: 'long'
  },
  'query:queryString:options': {
    type: 'keyword'
  },
  'metrics:max_buckets': {
    type: 'long'
  },
  'query:allowLeadingWildcards': {
    type: 'boolean'
  },
  metaFields: {
    type: 'array',
    items: {
      type: 'keyword'
    }
  },
  'indexPattern:placeholder': {
    type: 'keyword'
  },
  'histogram:barTarget': {
    type: 'long'
  },
  'histogram:maxBars': {
    type: 'long'
  },
  'format:number:defaultLocale': {
    type: 'keyword'
  },
  'format:percent:defaultPattern': {
    type: 'keyword'
  },
  'format:number:defaultPattern': {
    type: 'keyword'
  },
  'history:limit': {
    type: 'long'
  },
  'format:defaultTypeMap': {
    type: 'keyword'
  },
  'format:currency:defaultPattern': {
    type: 'keyword'
  },
  defaultIndex: {
    type: 'keyword'
  },
  'format:bytes:defaultPattern': {
    type: 'keyword'
  },
  'filters:pinnedByDefault': {
    type: 'boolean'
  },
  'filterEditor:suggestValues': {
    type: 'boolean'
  },
  'fields:popularLimit': {
    type: 'long'
  },
  dateNanosFormat: {
    type: 'keyword'
  },
  defaultRoute: {
    type: 'keyword'
  },
  'dateFormat:tz': {
    type: 'keyword'
  },
  'dateFormat:scaled': {
    type: 'keyword'
  },
  'csv:quoteValues': {
    type: 'boolean'
  },
  'dateFormat:dow': {
    type: 'keyword'
  },
  dateFormat: {
    type: 'keyword'
  },
  'autocomplete:useTimeRange': {
    type: 'boolean'
  },
  'search:timeout': {
    type: 'long'
  },
  'visualization:visualize:legacyChartsLibrary': {
    type: 'boolean'
  },
  'doc_table:legacy': {
    type: 'boolean'
  },
  'discover:modifyColumnsOnSwitch': {
    type: 'boolean'
  },
  'discover:searchFieldsFromSource': {
    type: 'boolean'
  },
  'securitySolution:rulesTableRefresh': {
    type: 'text'
  },
  'apm:enableSignificantTerms': {
    type: 'boolean'
  },
  'apm:enableServiceOverview': {
    type: 'boolean'
  }
};
exports.stackManagementSchema = stackManagementSchema;