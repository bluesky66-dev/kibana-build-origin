"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "XJsonMode", {
  enumerable: true,
  get: function () {
    return _ace.XJsonMode;
  }
});
exports.expandLiteralStrings = exports.collapseLiteralStrings = void 0;

var _public = require("../../../src/plugins/es_ui_shared/public");

var _ace = require("@kbn/ace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  collapseLiteralStrings,
  expandLiteralStrings
} = _public.XJson;
exports.expandLiteralStrings = expandLiteralStrings;
exports.collapseLiteralStrings = collapseLiteralStrings;