"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stubbedSavedObjectIndexPattern = stubbedSavedObjectIndexPattern;

var _logstash_fields = _interopRequireDefault(require("./logstash_fields"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// @ts-expect-error
const mockLogstashFields = (0, _logstash_fields.default)();

function stubbedSavedObjectIndexPattern(id = null) {
  return {
    id,
    type: 'index-pattern',
    attributes: {
      timeFieldName: 'timestamp',
      customFormats: {},
      fields: mockLogstashFields,
      title: 'title'
    },
    version: '2'
  };
}