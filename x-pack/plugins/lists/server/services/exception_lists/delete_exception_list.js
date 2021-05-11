"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteExceptionList = void 0;

var _utils = require("./utils");

var _get_exception_list = require("./get_exception_list");

var _delete_exception_list_items_by_list = require("./delete_exception_list_items_by_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteExceptionList = async ({
  listId,
  id,
  namespaceType,
  savedObjectsClient
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  const exceptionList = await (0, _get_exception_list.getExceptionList)({
    id,
    listId,
    namespaceType,
    savedObjectsClient
  });

  if (exceptionList == null) {
    return null;
  } else {
    await (0, _delete_exception_list_items_by_list.deleteExceptionListItemByList)({
      listId: exceptionList.list_id,
      namespaceType,
      savedObjectsClient
    });
    await savedObjectsClient.delete(savedObjectType, exceptionList.id);
    return exceptionList;
  }
};

exports.deleteExceptionList = deleteExceptionList;