"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.INDEX_META_DATA_CREATED_BY = exports.FILE_SIZE_DISPLAY_FORMAT = exports.ABSOLUTE_MAX_FILE_SIZE_BYTES = exports.MAX_FILE_SIZE_BYTES = exports.MAX_FILE_SIZE = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const MAX_FILE_SIZE = '100MB';
exports.MAX_FILE_SIZE = MAX_FILE_SIZE;
const MAX_FILE_SIZE_BYTES = 104857600; // 100MB

exports.MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_BYTES;
const ABSOLUTE_MAX_FILE_SIZE_BYTES = 1073741274; // 1GB

exports.ABSOLUTE_MAX_FILE_SIZE_BYTES = ABSOLUTE_MAX_FILE_SIZE_BYTES;
const FILE_SIZE_DISPLAY_FORMAT = '0,0.[0] b'; // Value to use in the Elasticsearch index mapping meta data to identify the
// index as having been created by the ML File Data Visualizer.

exports.FILE_SIZE_DISPLAY_FORMAT = FILE_SIZE_DISPLAY_FORMAT;
const INDEX_META_DATA_CREATED_BY = 'ml-file-data-visualizer';
exports.INDEX_META_DATA_CREATED_BY = INDEX_META_DATA_CREATED_BY;