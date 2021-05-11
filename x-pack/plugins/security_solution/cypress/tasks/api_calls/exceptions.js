"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionList = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const createExceptionList = (exceptionList, exceptionListId = 'exception_list_testing') => cy.request({
  method: 'POST',
  url: 'api/exception_lists',
  body: {
    list_id: exceptionListId != null ? exceptionListId : exceptionList.list_id,
    description: exceptionList.description,
    name: exceptionList.name,
    type: exceptionList.type
  },
  headers: {
    'kbn-xsrf': 'cypress-creds'
  },
  failOnStatusCode: false
});

exports.createExceptionList = createExceptionList;