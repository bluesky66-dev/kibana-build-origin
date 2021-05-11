"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionListItem = void 0;

var _find_exception_list_items = require("./find_exception_list_items");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findExceptionListItem = async ({
  listId,
  namespaceType,
  savedObjectsClient,
  filter,
  page,
  perPage,
  sortField,
  sortOrder
}) => {
  return (0, _find_exception_list_items.findExceptionListsItem)({
    filter: filter != null ? [filter] : [],
    listId: [listId],
    namespaceType: [namespaceType],
    page,
    perPage,
    savedObjectsClient,
    sortField,
    sortOrder
  });
};

exports.findExceptionListItem = findExceptionListItem;