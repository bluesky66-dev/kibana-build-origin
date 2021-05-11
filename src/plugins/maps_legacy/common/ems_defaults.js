"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_EMS_FONT_LIBRARY_URL = exports.DEFAULT_EMS_LANDING_PAGE_URL = exports.DEFAULT_EMS_TILE_API_URL = exports.DEFAULT_EMS_FILE_API_URL = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// Default config for the elastic hosted EMS endpoints
const DEFAULT_EMS_FILE_API_URL = 'https://vector.maps.elastic.co';
exports.DEFAULT_EMS_FILE_API_URL = DEFAULT_EMS_FILE_API_URL;
const DEFAULT_EMS_TILE_API_URL = 'https://tiles.maps.elastic.co';
exports.DEFAULT_EMS_TILE_API_URL = DEFAULT_EMS_TILE_API_URL;
const DEFAULT_EMS_LANDING_PAGE_URL = 'https://maps.elastic.co/v7.12';
exports.DEFAULT_EMS_LANDING_PAGE_URL = DEFAULT_EMS_LANDING_PAGE_URL;
const DEFAULT_EMS_FONT_LIBRARY_URL = 'https://tiles.maps.elastic.co/fonts/{fontstack}/{range}.pbf';
exports.DEFAULT_EMS_FONT_LIBRARY_URL = DEFAULT_EMS_FONT_LIBRARY_URL;