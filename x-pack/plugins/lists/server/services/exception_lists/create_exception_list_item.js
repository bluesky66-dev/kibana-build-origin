"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionListItem = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _utils = require("./utils");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createExceptionListItem = async ({
  comments,
  entries,
  itemId,
  listId,
  savedObjectsClient,
  namespaceType,
  name,
  osTypes,
  description,
  meta,
  user,
  tags,
  tieBreaker,
  type
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  const dateNow = new Date().toISOString();
  const transformedComments = (0, _utils.transformCreateCommentsToComments)({
    incomingComments: comments,
    user
  });
  const savedObject = await savedObjectsClient.create(savedObjectType, {
    comments: transformedComments,
    created_at: dateNow,
    created_by: user,
    description,
    entries,
    immutable: undefined,
    item_id: itemId,
    list_id: listId,
    list_type: 'item',
    meta,
    name,
    os_types: osTypes,
    tags,
    tie_breaker_id: tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4(),
    type,
    updated_by: user,
    version: undefined
  });
  return (0, _utils.transformSavedObjectToExceptionListItem)({
    savedObject
  });
};

exports.createExceptionListItem = createExceptionListItem;