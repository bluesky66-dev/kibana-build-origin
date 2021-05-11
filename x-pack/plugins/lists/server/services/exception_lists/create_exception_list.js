"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionList = void 0;

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


const createExceptionList = async ({
  listId,
  immutable,
  savedObjectsClient,
  namespaceType,
  name,
  description,
  meta,
  user,
  tags,
  tieBreaker,
  type,
  version
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });
  const dateNow = new Date().toISOString();
  const savedObject = await savedObjectsClient.create(savedObjectType, {
    comments: undefined,
    created_at: dateNow,
    created_by: user,
    description,
    entries: undefined,
    immutable,
    item_id: undefined,
    list_id: listId,
    list_type: 'list',
    meta,
    name,
    os_types: [],
    tags,
    tie_breaker_id: tieBreaker !== null && tieBreaker !== void 0 ? tieBreaker : _uuid.default.v4(),
    type,
    updated_by: user,
    version
  });
  return (0, _utils.transformSavedObjectToExceptionList)({
    savedObject
  });
};

exports.createExceptionList = createExceptionList;