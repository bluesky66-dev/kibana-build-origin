"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FILTER_OPTIONS = void 0;

var _elasticsearch_fieldnames = require("../elasticsearch_fieldnames");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const FILTER_OPTIONS = [_elasticsearch_fieldnames.SERVICE_NAME, _elasticsearch_fieldnames.SERVICE_ENVIRONMENT, _elasticsearch_fieldnames.TRANSACTION_TYPE, _elasticsearch_fieldnames.TRANSACTION_NAME];
exports.FILTER_OPTIONS = FILTER_OPTIONS;