"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteExceptionListItemById = exports.deleteExceptionListItem = void 0;

var _utils = require("./utils");

var _get_exception_list_item = require("./get_exception_list_item");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteExceptionListItem = async ({
  itemId,
  id,
  namespaceType,
  savedObjectsClient
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  const exceptionListItem = await (0, _get_exception_list_item.getExceptionListItem)({
    id,
    itemId,
    namespaceType,
    savedObjectsClient
  });

  if (exceptionListItem == null) {
    return null;
  } else {
    await savedObjectsClient.delete(savedObjectType, exceptionListItem.id);
    return exceptionListItem;
  }
};

exports.deleteExceptionListItem = deleteExceptionListItem;

const deleteExceptionListItemById = async ({
  id,
  namespaceType,
  savedObjectsClient
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  await savedObjectsClient.delete(savedObjectType, id);
};

exports.deleteExceptionListItemById = deleteExceptionListItemById;