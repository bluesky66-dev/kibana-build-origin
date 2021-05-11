"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plugin = plugin;
Object.defineProperty(exports, "Plugin", {
  enumerable: true,
  get: function () {
    return _plugin.DataServerPlugin;
  }
});
Object.defineProperty(exports, "PluginSetup", {
  enumerable: true,
  get: function () {
    return _plugin.DataPluginSetup;
  }
});
Object.defineProperty(exports, "PluginStart", {
  enumerable: true,
  get: function () {
    return _plugin.DataPluginStart;
  }
});
Object.defineProperty(exports, "EsQueryConfig", {
  enumerable: true,
  get: function () {
    return _common.EsQueryConfig;
  }
});
Object.defineProperty(exports, "KueryNode", {
  enumerable: true,
  get: function () {
    return _common.KueryNode;
  }
});
Object.defineProperty(exports, "IFieldFormatsRegistry", {
  enumerable: true,
  get: function () {
    return _common.IFieldFormatsRegistry;
  }
});
Object.defineProperty(exports, "FieldFormatsGetConfigFn", {
  enumerable: true,
  get: function () {
    return _common.FieldFormatsGetConfigFn;
  }
});
Object.defineProperty(exports, "FieldFormatConfig", {
  enumerable: true,
  get: function () {
    return _common.FieldFormatConfig;
  }
});
Object.defineProperty(exports, "IFieldType", {
  enumerable: true,
  get: function () {
    return _common.IFieldType;
  }
});
Object.defineProperty(exports, "IFieldSubType", {
  enumerable: true,
  get: function () {
    return _common.IFieldSubType;
  }
});
Object.defineProperty(exports, "ES_FIELD_TYPES", {
  enumerable: true,
  get: function () {
    return _common.ES_FIELD_TYPES;
  }
});
Object.defineProperty(exports, "KBN_FIELD_TYPES", {
  enumerable: true,
  get: function () {
    return _common.KBN_FIELD_TYPES;
  }
});
Object.defineProperty(exports, "IndexPatternAttributes", {
  enumerable: true,
  get: function () {
    return _common.IndexPatternAttributes;
  }
});
Object.defineProperty(exports, "UI_SETTINGS", {
  enumerable: true,
  get: function () {
    return _common.UI_SETTINGS;
  }
});
Object.defineProperty(exports, "IndexPattern", {
  enumerable: true,
  get: function () {
    return _common.IndexPattern;
  }
});
Object.defineProperty(exports, "IndexPatternLoadExpressionFunctionDefinition", {
  enumerable: true,
  get: function () {
    return _common.IndexPatternLoadExpressionFunctionDefinition;
  }
});
Object.defineProperty(exports, "IndexPatternsService", {
  enumerable: true,
  get: function () {
    return _common.IndexPatternsService;
  }
});
Object.defineProperty(exports, "IndexPatternsCommonService", {
  enumerable: true,
  get: function () {
    return _common.IndexPatternsService;
  }
});
Object.defineProperty(exports, "AggGroupLabels", {
  enumerable: true,
  get: function () {
    return _common.AggGroupLabels;
  }
});
Object.defineProperty(exports, "AggGroupName", {
  enumerable: true,
  get: function () {
    return _common.AggGroupName;
  }
});
Object.defineProperty(exports, "AggGroupNames", {
  enumerable: true,
  get: function () {
    return _common.AggGroupNames;
  }
});
Object.defineProperty(exports, "AggFunctionsMapping", {
  enumerable: true,
  get: function () {
    return _common.AggFunctionsMapping;
  }
});
Object.defineProperty(exports, "AggParam", {
  enumerable: true,
  get: function () {
    return _common.AggParam;
  }
});
Object.defineProperty(exports, "AggParamOption", {
  enumerable: true,
  get: function () {
    return _common.AggParamOption;
  }
});
Object.defineProperty(exports, "AggParamType", {
  enumerable: true,
  get: function () {
    return _common.AggParamType;
  }
});
Object.defineProperty(exports, "AggConfigOptions", {
  enumerable: true,
  get: function () {
    return _common.AggConfigOptions;
  }
});
Object.defineProperty(exports, "BUCKET_TYPES", {
  enumerable: true,
  get: function () {
    return _common.BUCKET_TYPES;
  }
});
Object.defineProperty(exports, "EsaggsExpressionFunctionDefinition", {
  enumerable: true,
  get: function () {
    return _common.EsaggsExpressionFunctionDefinition;
  }
});
Object.defineProperty(exports, "IAggConfig", {
  enumerable: true,
  get: function () {
    return _common.IAggConfig;
  }
});
Object.defineProperty(exports, "IAggConfigs", {
  enumerable: true,
  get: function () {
    return _common.IAggConfigs;
  }
});
Object.defineProperty(exports, "IAggType", {
  enumerable: true,
  get: function () {
    return _common.IAggType;
  }
});
Object.defineProperty(exports, "IFieldParamType", {
  enumerable: true,
  get: function () {
    return _common.IFieldParamType;
  }
});
Object.defineProperty(exports, "IMetricAggType", {
  enumerable: true,
  get: function () {
    return _common.IMetricAggType;
  }
});
Object.defineProperty(exports, "METRIC_TYPES", {
  enumerable: true,
  get: function () {
    return _common.METRIC_TYPES;
  }
});
Object.defineProperty(exports, "OptionedParamType", {
  enumerable: true,
  get: function () {
    return _common.OptionedParamType;
  }
});
Object.defineProperty(exports, "OptionedValueProp", {
  enumerable: true,
  get: function () {
    return _common.OptionedValueProp;
  }
});
Object.defineProperty(exports, "ParsedInterval", {
  enumerable: true,
  get: function () {
    return _common.ParsedInterval;
  }
});
Object.defineProperty(exports, "ExecutionContextSearch", {
  enumerable: true,
  get: function () {
    return _common.ExecutionContextSearch;
  }
});
Object.defineProperty(exports, "ExpressionFunctionKibana", {
  enumerable: true,
  get: function () {
    return _common.ExpressionFunctionKibana;
  }
});
Object.defineProperty(exports, "ExpressionFunctionKibanaContext", {
  enumerable: true,
  get: function () {
    return _common.ExpressionFunctionKibanaContext;
  }
});
Object.defineProperty(exports, "ExpressionValueSearchContext", {
  enumerable: true,
  get: function () {
    return _common.ExpressionValueSearchContext;
  }
});
Object.defineProperty(exports, "KibanaContext", {
  enumerable: true,
  get: function () {
    return _common.KibanaContext;
  }
});
Object.defineProperty(exports, "ISearchOptions", {
  enumerable: true,
  get: function () {
    return _common.ISearchOptions;
  }
});
Object.defineProperty(exports, "IEsSearchRequest", {
  enumerable: true,
  get: function () {
    return _common.IEsSearchRequest;
  }
});
Object.defineProperty(exports, "IEsSearchResponse", {
  enumerable: true,
  get: function () {
    return _common.IEsSearchResponse;
  }
});
Object.defineProperty(exports, "ES_SEARCH_STRATEGY", {
  enumerable: true,
  get: function () {
    return _common.ES_SEARCH_STRATEGY;
  }
});
Object.defineProperty(exports, "castEsToKbnFieldTypeName", {
  enumerable: true,
  get: function () {
    return _common.castEsToKbnFieldTypeName;
  }
});
Object.defineProperty(exports, "Filter", {
  enumerable: true,
  get: function () {
    return _common.Filter;
  }
});
Object.defineProperty(exports, "getTime", {
  enumerable: true,
  get: function () {
    return _common.getTime;
  }
});
Object.defineProperty(exports, "Query", {
  enumerable: true,
  get: function () {
    return _common.Query;
  }
});
Object.defineProperty(exports, "RefreshInterval", {
  enumerable: true,
  get: function () {
    return _common.RefreshInterval;
  }
});
Object.defineProperty(exports, "TimeRange", {
  enumerable: true,
  get: function () {
    return _common.TimeRange;
  }
});
Object.defineProperty(exports, "parseInterval", {
  enumerable: true,
  get: function () {
    return _common.parseInterval;
  }
});
Object.defineProperty(exports, "IndexPatternsFetcher", {
  enumerable: true,
  get: function () {
    return _index_patterns.IndexPatternsFetcher;
  }
});
Object.defineProperty(exports, "IndexPatternFieldDescriptor", {
  enumerable: true,
  get: function () {
    return _index_patterns.FieldDescriptor;
  }
});
Object.defineProperty(exports, "shouldReadFieldFromDocValues", {
  enumerable: true,
  get: function () {
    return _index_patterns.shouldReadFieldFromDocValues;
  }
});
Object.defineProperty(exports, "FieldDescriptor", {
  enumerable: true,
  get: function () {
    return _index_patterns.FieldDescriptor;
  }
});
Object.defineProperty(exports, "mergeCapabilitiesWithFields", {
  enumerable: true,
  get: function () {
    return _index_patterns.mergeCapabilitiesWithFields;
  }
});
Object.defineProperty(exports, "getCapabilitiesForRollupIndices", {
  enumerable: true,
  get: function () {
    return _index_patterns.getCapabilitiesForRollupIndices;
  }
});
Object.defineProperty(exports, "ISearchStrategy", {
  enumerable: true,
  get: function () {
    return _search.ISearchStrategy;
  }
});
Object.defineProperty(exports, "ISearchSetup", {
  enumerable: true,
  get: function () {
    return _search.ISearchSetup;
  }
});
Object.defineProperty(exports, "ISearchStart", {
  enumerable: true,
  get: function () {
    return _search.ISearchStart;
  }
});
Object.defineProperty(exports, "SearchStrategyDependencies", {
  enumerable: true,
  get: function () {
    return _search.SearchStrategyDependencies;
  }
});
Object.defineProperty(exports, "getDefaultSearchParams", {
  enumerable: true,
  get: function () {
    return _search.getDefaultSearchParams;
  }
});
Object.defineProperty(exports, "getShardTimeout", {
  enumerable: true,
  get: function () {
    return _search.getShardTimeout;
  }
});
Object.defineProperty(exports, "getTotalLoaded", {
  enumerable: true,
  get: function () {
    return _search.getTotalLoaded;
  }
});
Object.defineProperty(exports, "toKibanaSearchResponse", {
  enumerable: true,
  get: function () {
    return _search.toKibanaSearchResponse;
  }
});
Object.defineProperty(exports, "shimHitsTotal", {
  enumerable: true,
  get: function () {
    return _search.shimHitsTotal;
  }
});
Object.defineProperty(exports, "usageProvider", {
  enumerable: true,
  get: function () {
    return _search.usageProvider;
  }
});
Object.defineProperty(exports, "searchUsageObserver", {
  enumerable: true,
  get: function () {
    return _search.searchUsageObserver;
  }
});
Object.defineProperty(exports, "shimAbortSignal", {
  enumerable: true,
  get: function () {
    return _search.shimAbortSignal;
  }
});
Object.defineProperty(exports, "SearchUsage", {
  enumerable: true,
  get: function () {
    return _search.SearchUsage;
  }
});
Object.defineProperty(exports, "SearchSessionService", {
  enumerable: true,
  get: function () {
    return _search.SearchSessionService;
  }
});
Object.defineProperty(exports, "ISearchSessionService", {
  enumerable: true,
  get: function () {
    return _search.ISearchSessionService;
  }
});
Object.defineProperty(exports, "SearchRequestHandlerContext", {
  enumerable: true,
  get: function () {
    return _search.SearchRequestHandlerContext;
  }
});
Object.defineProperty(exports, "DataRequestHandlerContext", {
  enumerable: true,
  get: function () {
    return _search.DataRequestHandlerContext;
  }
});
exports.config = exports.search = exports.indexPatterns = exports.fieldFormats = exports.esQuery = exports.esKuery = exports.exporters = exports.esFilters = void 0;

var _config = require("../config");

var _plugin = require("./plugin");

var _common = require("../common");

var _field_formats = require("../common/field_formats");

var _index_patterns = require("./index_patterns");

var _search = require("./search");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/*
 * Filter helper namespace:
 */
const esFilters = {
  buildQueryFilter: _common.buildQueryFilter,
  buildCustomFilter: _common.buildCustomFilter,
  buildEmptyFilter: _common.buildEmptyFilter,
  buildExistsFilter: _common.buildExistsFilter,
  buildFilter: _common.buildFilter,
  buildPhraseFilter: _common.buildPhraseFilter,
  buildPhrasesFilter: _common.buildPhrasesFilter,
  buildRangeFilter: _common.buildRangeFilter,
  isFilterDisabled: _common.isFilterDisabled
};
/**
 * Exporters (CSV)
 */

exports.esFilters = esFilters;
const exporters = {
  datatableToCSV: _common.datatableToCSV,
  CSV_MIME_TYPE: _common.CSV_MIME_TYPE
};
/*
 * esQuery and esKuery:
 */

exports.exporters = exporters;
const esKuery = {
  nodeTypes: _common.nodeTypes,
  fromKueryExpression: _common.fromKueryExpression,
  toElasticsearchQuery: _common.toElasticsearchQuery
};
exports.esKuery = esKuery;
const esQuery = {
  buildQueryFromFilters: _common.buildQueryFromFilters,
  getEsQueryConfig: _common.getEsQueryConfig,
  buildEsQuery: _common.buildEsQuery
};
exports.esQuery = esQuery;
const fieldFormats = {
  FieldFormatsRegistry: _field_formats.FieldFormatsRegistry,
  FieldFormat: _field_formats.FieldFormat,
  BoolFormat: _field_formats.BoolFormat,
  BytesFormat: _field_formats.BytesFormat,
  ColorFormat: _field_formats.ColorFormat,
  DurationFormat: _field_formats.DurationFormat,
  IpFormat: _field_formats.IpFormat,
  NumberFormat: _field_formats.NumberFormat,
  PercentFormat: _field_formats.PercentFormat,
  RelativeDateFormat: _field_formats.RelativeDateFormat,
  SourceFormat: _field_formats.SourceFormat,
  StaticLookupFormat: _field_formats.StaticLookupFormat,
  UrlFormat: _field_formats.UrlFormat,
  StringFormat: _field_formats.StringFormat,
  TruncateFormat: _field_formats.TruncateFormat
};
exports.fieldFormats = fieldFormats;
const indexPatterns = {
  isFilterable: _common.isFilterable,
  isNestedField: _common.isNestedField
};
exports.indexPatterns = indexPatterns;
// Search namespace
const search = {
  aggs: {
    CidrMask: _common.CidrMask,
    dateHistogramInterval: _common.dateHistogramInterval,
    intervalOptions: _common.intervalOptions,
    InvalidEsCalendarIntervalError: _common.InvalidEsCalendarIntervalError,
    InvalidEsIntervalFormatError: _common.InvalidEsIntervalFormatError,
    Ipv4Address: _common.Ipv4Address,
    isNumberType: _common.isNumberType,
    isStringType: _common.isStringType,
    isType: _common.isType,
    isValidEsInterval: _common.isValidEsInterval,
    isValidInterval: _common.isValidInterval,
    parentPipelineType: _common.parentPipelineType,
    parseEsInterval: _common.parseEsInterval,
    parseInterval: _common.parseInterval,
    propFilter: _common.propFilter,
    siblingPipelineType: _common.siblingPipelineType,
    termsAggFilter: _common.termsAggFilter,
    toAbsoluteDates: _common.toAbsoluteDates,
    calcAutoIntervalLessThan: _common.calcAutoIntervalLessThan
  },
  getRequestInspectorStats: _common.getRequestInspectorStats,
  getResponseInspectorStats: _common.getResponseInspectorStats,
  tabifyAggResponse: _common.tabifyAggResponse,
  tabifyGetColumns: _common.tabifyGetColumns
};
/**
 * Types to be shared externally
 * @public
 */

exports.search = search;

/**
 * Static code to be shared externally
 * @public
 */
function plugin(initializerContext) {
  return new _plugin.DataServerPlugin(initializerContext);
}

const config = {
  exposeToBrowser: {
    autocomplete: true,
    search: true
  },
  schema: _config.configSchema
};
exports.config = config;