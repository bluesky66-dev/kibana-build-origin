"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionListItem = void 0;

var _utils = require("./utils");

var _get_exception_list_item = require("./get_exception_list_item");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateExceptionListItem = async ({
  _version,
  comments,
  entries,
  id,
  savedObjectsClient,
  namespaceType,
  name,
  osTypes,
  description,
  itemId,
  meta,
  user,
  tags,
  type
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
    const transformedComments = (0, _utils.transformUpdateCommentsToComments)({
      comments,
      existingComments: exceptionListItem.comments,
      user
    });
    const savedObject = await savedObjectsClient.update(savedObjectType, exceptionListItem.id, {
      comments: transformedComments,
      description,
      entries,
      meta,
      name,
      os_types: osTypes,
      tags,
      type,
      updated_by: user
    }, {
      version: _version
    });
    return (0, _utils.transformSavedObjectUpdateToExceptionListItem)({
      exceptionListItem,
      savedObject
    });
  }
};

exports.updateExceptionListItem = updateExceptionListItem;