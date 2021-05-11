"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteFoundExceptionListItems = exports.getExceptionListItemIds = exports.deleteExceptionListItemByList = void 0;

var _find_exception_list_item = require("./find_exception_list_item");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const PER_PAGE = 100;

const deleteExceptionListItemByList = async ({
  listId,
  savedObjectsClient,
  namespaceType
}) => {
  const ids = await getExceptionListItemIds({
    listId,
    namespaceType,
    savedObjectsClient
  });
  await deleteFoundExceptionListItems({
    ids,
    namespaceType,
    savedObjectsClient
  });
};

exports.deleteExceptionListItemByList = deleteExceptionListItemByList;

const getExceptionListItemIds = async ({
  listId,
  savedObjectsClient,
  namespaceType
}) => {
  let page = 1;
  let ids = [];
  let foundExceptionListItems = await (0, _find_exception_list_item.findExceptionListItem)({
    filter: undefined,
    listId,
    namespaceType,
    page,
    perPage: PER_PAGE,
    savedObjectsClient,
    sortField: 'tie_breaker_id',
    sortOrder: 'desc'
  });

  while (foundExceptionListItems != null && foundExceptionListItems.data.length > 0) {
    ids = [...ids, ...foundExceptionListItems.data.map(exceptionListItem => exceptionListItem.id)];
    page += 1;
    foundExceptionListItems = await (0, _find_exception_list_item.findExceptionListItem)({
      filter: undefined,
      listId,
      namespaceType,
      page,
      perPage: PER_PAGE,
      savedObjectsClient,
      sortField: 'tie_breaker_id',
      sortOrder: 'desc'
    });
  }

  return ids;
};
/**
 * NOTE: This is slow and terrible as we are deleting everything one at a time.
 * TODO: Replace this with a bulk call or a delete by query would be more useful
 */


exports.getExceptionListItemIds = getExceptionListItemIds;

const deleteFoundExceptionListItems = async ({
  ids,
  savedObjectsClient,
  namespaceType
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  ids.forEach(async id => {
    try {
      await savedObjectsClient.delete(savedObjectType, id);
    } catch (err) {// This can happen from race conditions or networking issues so deleting the id's
      // like this is considered "best effort" and it is possible to get dangling pieces
      // of data sitting around in which case the user has to manually clean up the data
      // I am very hopeful this does not happen often or at all.
    }
  });
};

exports.deleteFoundExceptionListItems = deleteFoundExceptionListItems;