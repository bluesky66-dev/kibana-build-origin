"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getErrorMessageExceptionList = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const getErrorMessageExceptionList = ({
  id,
  listId
}) => {
  if (id != null) {
    return `exception list id: "${id}" does not exist`;
  } else if (listId != null) {
    return `exception list list_id: "${listId}" does not exist`;
  } else {
    return 'exception list does not exist';
  }
};

exports.getErrorMessageExceptionList = getErrorMessageExceptionList;