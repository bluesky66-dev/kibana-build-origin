"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expectedExportedExceptionList = exports.exception = exports.exceptionList = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const exceptionList = {
  description: 'Test exception list description',
  list_id: 'test_exception_list',
  name: 'Test exception list',
  namespace_type: 'single',
  tags: ['test tag'],
  type: 'detection'
};
exports.exceptionList = exceptionList;
const exception = {
  field: 'host.name',
  operator: 'is',
  values: ['suricata-iowa']
};
exports.exception = exception;

const expectedExportedExceptionList = exceptionListResponse => {
  const jsonrule = exceptionListResponse.body;
  return `{"_version":"${jsonrule._version}","created_at":"${jsonrule.created_at}","created_by":"elastic","description":"${jsonrule.description}","id":"${jsonrule.id}","immutable":false,"list_id":"test_exception_list","name":"Test exception list","namespace_type":"single","os_types":[],"tags":[],"tie_breaker_id":"${jsonrule.tie_breaker_id}","type":"detection","updated_at":"${jsonrule.updated_at}","updated_by":"elastic","version":1}\n"\n""\n{"exception_list_items_details":"{"exported_count":0}\n"}`;
};

exports.expectedExportedExceptionList = expectedExportedExceptionList;