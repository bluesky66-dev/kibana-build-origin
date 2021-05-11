"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findValueListExceptionListItems = exports.getExceptionListsItemFilter = exports.findExceptionListsItem = void 0;

var _types = require("../../../common/types");

var _escape_query = require("../utils/escape_query");

var _utils = require("./utils");

var _get_exception_list = require("./get_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findExceptionListsItem = async ({
  listId,
  namespaceType,
  savedObjectsClient,
  filter,
  page,
  perPage,
  sortField,
  sortOrder
}) => {
  const savedObjectType = (0, _utils.getSavedObjectTypes)({
    namespaceType
  });
  const exceptionLists = (await Promise.all(listId.map((singleListId, index) => {
    return (0, _get_exception_list.getExceptionList)({
      id: undefined,
      listId: singleListId,
      namespaceType: namespaceType[index],
      savedObjectsClient
    });
  }))).filter(list => list != null);

  if (exceptionLists.length === 0) {
    return null;
  } else {
    const savedObjectsFindResponse = await savedObjectsClient.find({
      filter: getExceptionListsItemFilter({
        filter,
        listId,
        savedObjectType
      }),
      page,
      perPage,
      sortField,
      sortOrder,
      type: savedObjectType
    });
    return (0, _utils.transformSavedObjectsToFoundExceptionListItem)({
      savedObjectsFindResponse
    });
  }
};

exports.findExceptionListsItem = findExceptionListsItem;

const getExceptionListsItemFilter = ({
  filter,
  listId,
  savedObjectType
}) => {
  return listId.reduce((accum, singleListId, index) => {
    const escapedListId = (0, _escape_query.escapeQuotes)(singleListId);
    const listItemAppend = `(${savedObjectType[index]}.attributes.list_type: item AND ${savedObjectType[index]}.attributes.list_id: "${escapedListId}")`;
    const listItemAppendWithFilter = filter[index] != null ? `(${listItemAppend} AND ${filter[index]})` : listItemAppend;

    if (accum === '') {
      return listItemAppendWithFilter;
    } else {
      return `${accum} OR ${listItemAppendWithFilter}`;
    }
  }, '');
};

exports.getExceptionListsItemFilter = getExceptionListsItemFilter;

const findValueListExceptionListItems = async ({
  valueListId,
  savedObjectsClient,
  page,
  perPage,
  sortField,
  sortOrder
}) => {
  const escapedValueListId = (0, _escape_query.escapeQuotes)(valueListId);
  const savedObjectsFindResponse = await savedObjectsClient.find({
    filter: `(exception-list.attributes.list_type: item AND exception-list.attributes.entries.list.id:"${escapedValueListId}") OR (exception-list-agnostic.attributes.list_type: item AND exception-list-agnostic.attributes.entries.list.id:"${escapedValueListId}") `,
    page,
    perPage,
    sortField,
    sortOrder,
    type: [_types.exceptionListSavedObjectType, _types.exceptionListAgnosticSavedObjectType]
  });
  return (0, _utils.transformSavedObjectsToFoundExceptionListItem)({
    savedObjectsFindResponse
  });
};

exports.findValueListExceptionListItems = findValueListExceptionListItems;