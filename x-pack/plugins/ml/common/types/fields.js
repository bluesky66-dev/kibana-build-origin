"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mlCategory = exports.METRIC_AGG_TYPE = exports.EVENT_RATE_FIELD_ID = void 0;

var _common = require("../../../../../src/plugins/data/common");

var _field_types = require("../constants/field_types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const EVENT_RATE_FIELD_ID = '__ml_event_rate_count__';
exports.EVENT_RATE_FIELD_ID = EVENT_RATE_FIELD_ID;
const METRIC_AGG_TYPE = 'metrics';
exports.METRIC_AGG_TYPE = METRIC_AGG_TYPE;
const mlCategory = {
  id: _field_types.MLCATEGORY,
  name: _field_types.MLCATEGORY,
  type: _common.ES_FIELD_TYPES.KEYWORD,
  aggregatable: false
};
exports.mlCategory = mlCategory; // Replace this with import once #88995 is merged

const RUNTIME_FIELD_TYPES = ['keyword', 'long', 'double', 'date', 'ip', 'boolean'];