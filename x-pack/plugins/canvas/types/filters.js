"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FilterType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

let FilterType;
exports.FilterType = FilterType;

(function (FilterType) {
  FilterType["luceneQueryString"] = "luceneQueryString";
  FilterType["time"] = "time";
  FilterType["exactly"] = "exactly";
})(FilterType || (exports.FilterType = FilterType = {}));