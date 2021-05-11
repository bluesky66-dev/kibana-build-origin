"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBasePath = getBasePath;
exports.getEditPath = getEditPath;
exports.getFullPath = getFullPath;
exports.LENS_EDIT_BY_VALUE = exports.BASE_API_URL = exports.NOT_INTERNATIONALIZED_PRODUCT_NAME = exports.DOC_TYPE = exports.LENS_EMBEDDABLE_TYPE = exports.APP_ID = exports.PLUGIN_ID = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const PLUGIN_ID = 'lens';
exports.PLUGIN_ID = PLUGIN_ID;
const APP_ID = 'lens';
exports.APP_ID = APP_ID;
const LENS_EMBEDDABLE_TYPE = 'lens';
exports.LENS_EMBEDDABLE_TYPE = LENS_EMBEDDABLE_TYPE;
const DOC_TYPE = 'lens';
exports.DOC_TYPE = DOC_TYPE;
const NOT_INTERNATIONALIZED_PRODUCT_NAME = 'Lens Visualizations';
exports.NOT_INTERNATIONALIZED_PRODUCT_NAME = NOT_INTERNATIONALIZED_PRODUCT_NAME;
const BASE_API_URL = '/api/lens';
exports.BASE_API_URL = BASE_API_URL;
const LENS_EDIT_BY_VALUE = 'edit_by_value';
exports.LENS_EDIT_BY_VALUE = LENS_EDIT_BY_VALUE;

function getBasePath() {
  return `#/`;
}

function getEditPath(id) {
  return id ? `#/edit/${encodeURIComponent(id)}` : `#/${LENS_EDIT_BY_VALUE}`;
}

function getFullPath(id) {
  return `/app/${PLUGIN_ID}${id ? getEditPath(id) : getBasePath()}`;
}