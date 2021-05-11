"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultHeaders = exports.defaultColumnHeaderType = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const defaultColumnHeaderType = 'not-filtered';
exports.defaultColumnHeaderType = defaultColumnHeaderType;
const defaultHeaders = [{
  columnHeaderType: defaultColumnHeaderType,
  id: '@timestamp'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'message'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'event.category'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'event.action'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'host.name'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'source.ip'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'destination.ip'
}, {
  columnHeaderType: defaultColumnHeaderType,
  id: 'user.name'
}];
exports.defaultHeaders = defaultHeaders;