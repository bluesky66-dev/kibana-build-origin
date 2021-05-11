"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stubIndexPatternWithFields = exports.stubIndexPattern = void 0;

var _field = require("./field.stub");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const stubIndexPattern = {
  id: 'logstash-*',
  fields: _field.stubFields,
  title: 'logstash-*',
  timeFieldName: '@timestamp',
  getTimeField: () => ({
    name: '@timestamp',
    type: 'date'
  })
};
exports.stubIndexPattern = stubIndexPattern;
const stubIndexPatternWithFields = {
  id: '1234',
  title: 'logstash-*',
  fields: [{
    name: 'response',
    type: 'number',
    esTypes: ['integer'],
    aggregatable: true,
    filterable: true,
    searchable: true
  }]
};
exports.stubIndexPatternWithFields = stubIndexPatternWithFields;