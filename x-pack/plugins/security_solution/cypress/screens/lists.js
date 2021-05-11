"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VALUE_LIST_EXPORT_BUTTON = exports.VALUE_LIST_CLOSE_BUTTON = exports.VALUE_LIST_FILES = exports.VALUE_LIST_DELETE_BUTTON = exports.VALUE_LIST_TYPE_SELECTOR = exports.VALUE_LIST_FILE_UPLOAD_BUTTON = exports.VALUE_LIST_FILE_PICKER = exports.VALUE_LISTS_ROW = exports.VALUE_LISTS_TABLE = exports.VALUE_LISTS_MODAL_ACTIVATOR = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const VALUE_LISTS_MODAL_ACTIVATOR = '[data-test-subj="open-value-lists-modal-button"]';
exports.VALUE_LISTS_MODAL_ACTIVATOR = VALUE_LISTS_MODAL_ACTIVATOR;
const VALUE_LISTS_TABLE = '[data-test-subj="value-lists-table"]';
exports.VALUE_LISTS_TABLE = VALUE_LISTS_TABLE;
const VALUE_LISTS_ROW = '.euiTableRow';
exports.VALUE_LISTS_ROW = VALUE_LISTS_ROW;
const VALUE_LIST_FILE_PICKER = '[data-test-subj="value-list-file-picker"]';
exports.VALUE_LIST_FILE_PICKER = VALUE_LIST_FILE_PICKER;
const VALUE_LIST_FILE_UPLOAD_BUTTON = '[data-test-subj="value-lists-form-import-action"]';
exports.VALUE_LIST_FILE_UPLOAD_BUTTON = VALUE_LIST_FILE_UPLOAD_BUTTON;
const VALUE_LIST_TYPE_SELECTOR = '[data-test-subj="value-lists-form-select-type-action"]';
exports.VALUE_LIST_TYPE_SELECTOR = VALUE_LIST_TYPE_SELECTOR;

const VALUE_LIST_DELETE_BUTTON = name => `[data-test-subj="action-delete-value-list-${name}"]`;

exports.VALUE_LIST_DELETE_BUTTON = VALUE_LIST_DELETE_BUTTON;
const VALUE_LIST_FILES = '[data-test-subj*="action-delete-value-list-"]';
exports.VALUE_LIST_FILES = VALUE_LIST_FILES;
const VALUE_LIST_CLOSE_BUTTON = '[data-test-subj="value-lists-modal-close-action"]';
exports.VALUE_LIST_CLOSE_BUTTON = VALUE_LIST_CLOSE_BUTTON;
const VALUE_LIST_EXPORT_BUTTON = '[data-test-subj="action-export-value-list"]';
exports.VALUE_LIST_EXPORT_BUTTON = VALUE_LIST_EXPORT_BUTTON;