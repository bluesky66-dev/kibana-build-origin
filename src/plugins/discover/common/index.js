"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SEARCH_FIELDS_FROM_SOURCE = exports.MODIFY_COLUMNS_ON_SWITCH = exports.DOC_TABLE_LEGACY = exports.CONTEXT_TIE_BREAKER_FIELDS_SETTING = exports.CONTEXT_STEP_SETTING = exports.CONTEXT_DEFAULT_SIZE_SETTING = exports.FIELDS_LIMIT_SETTING = exports.DOC_HIDE_TIME_COLUMN_SETTING = exports.SEARCH_ON_PAGE_LOAD_SETTING = exports.SORT_DEFAULT_ORDER_SETTING = exports.AGGS_TERMS_SIZE_SETTING = exports.SAMPLE_SIZE_SETTING = exports.DEFAULT_COLUMNS_SETTING = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULT_COLUMNS_SETTING = 'defaultColumns';
exports.DEFAULT_COLUMNS_SETTING = DEFAULT_COLUMNS_SETTING;
const SAMPLE_SIZE_SETTING = 'discover:sampleSize';
exports.SAMPLE_SIZE_SETTING = SAMPLE_SIZE_SETTING;
const AGGS_TERMS_SIZE_SETTING = 'discover:aggs:terms:size';
exports.AGGS_TERMS_SIZE_SETTING = AGGS_TERMS_SIZE_SETTING;
const SORT_DEFAULT_ORDER_SETTING = 'discover:sort:defaultOrder';
exports.SORT_DEFAULT_ORDER_SETTING = SORT_DEFAULT_ORDER_SETTING;
const SEARCH_ON_PAGE_LOAD_SETTING = 'discover:searchOnPageLoad';
exports.SEARCH_ON_PAGE_LOAD_SETTING = SEARCH_ON_PAGE_LOAD_SETTING;
const DOC_HIDE_TIME_COLUMN_SETTING = 'doc_table:hideTimeColumn';
exports.DOC_HIDE_TIME_COLUMN_SETTING = DOC_HIDE_TIME_COLUMN_SETTING;
const FIELDS_LIMIT_SETTING = 'fields:popularLimit';
exports.FIELDS_LIMIT_SETTING = FIELDS_LIMIT_SETTING;
const CONTEXT_DEFAULT_SIZE_SETTING = 'context:defaultSize';
exports.CONTEXT_DEFAULT_SIZE_SETTING = CONTEXT_DEFAULT_SIZE_SETTING;
const CONTEXT_STEP_SETTING = 'context:step';
exports.CONTEXT_STEP_SETTING = CONTEXT_STEP_SETTING;
const CONTEXT_TIE_BREAKER_FIELDS_SETTING = 'context:tieBreakerFields';
exports.CONTEXT_TIE_BREAKER_FIELDS_SETTING = CONTEXT_TIE_BREAKER_FIELDS_SETTING;
const DOC_TABLE_LEGACY = 'doc_table:legacy';
exports.DOC_TABLE_LEGACY = DOC_TABLE_LEGACY;
const MODIFY_COLUMNS_ON_SWITCH = 'discover:modifyColumnsOnSwitch';
exports.MODIFY_COLUMNS_ON_SWITCH = MODIFY_COLUMNS_ON_SWITCH;
const SEARCH_FIELDS_FROM_SOURCE = 'discover:searchFieldsFromSource';
exports.SEARCH_FIELDS_FROM_SOURCE = SEARCH_FIELDS_FROM_SOURCE;