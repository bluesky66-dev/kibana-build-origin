"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformCreateCommentsToComments = exports.transformUpdateCommentsToComments = exports.transformSavedObjectsToFoundExceptionList = exports.transformSavedObjectsToFoundExceptionListItem = exports.transformSavedObjectUpdateToExceptionListItem = exports.transformSavedObjectToExceptionListItem = exports.transformSavedObjectUpdateToExceptionList = exports.transformSavedObjectToExceptionList = exports.getSavedObjectTypes = exports.getExceptionListType = exports.getSavedObjectType = void 0;

var _uuid = _interopRequireDefault(require("uuid"));

var _types = require("../../../common/types");

var _schemas = require("../../../common/schemas");

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


const getSavedObjectType = ({
  namespaceType
}) => {
  if (namespaceType === 'agnostic') {
    return _types.exceptionListAgnosticSavedObjectType;
  } else {
    return _types.exceptionListSavedObjectType;
  }
};

exports.getSavedObjectType = getSavedObjectType;

const getExceptionListType = ({
  savedObjectType
}) => {
  if (savedObjectType === _types.exceptionListAgnosticSavedObjectType) {
    return 'agnostic';
  } else {
    return 'single';
  }
};

exports.getExceptionListType = getExceptionListType;

const getSavedObjectTypes = ({
  namespaceType
}) => {
  return namespaceType.map(singleNamespaceType => getSavedObjectType({
    namespaceType: singleNamespaceType
  }));
};

exports.getSavedObjectTypes = getSavedObjectTypes;

const transformSavedObjectToExceptionList = ({
  savedObject
}) => {
  const dateNow = new Date().toISOString();
  const {
    version: _version,
    attributes: {
      /* eslint-disable @typescript-eslint/naming-convention */
      created_at,
      created_by,
      description,
      immutable,
      list_id,
      meta,
      name,
      os_types,
      tags,
      tie_breaker_id,
      type,
      updated_by,
      version
      /* eslint-enable @typescript-eslint/naming-convention */

    },
    id,
    updated_at: updatedAt
  } = savedObject; // TODO: Change this to do a decode and throw if the saved object is not as expected.
  // TODO: Do a throw if after the decode this is not the correct "list_type: list"

  return {
    _version,
    created_at,
    created_by,
    description,
    id,
    immutable: immutable !== null && immutable !== void 0 ? immutable : false,
    // This should never be undefined for a list (only a list item)
    list_id,
    meta,
    name,
    namespace_type: getExceptionListType({
      savedObjectType: savedObject.type
    }),
    os_types,
    tags,
    tie_breaker_id,
    type: _schemas.exceptionListType.is(type) ? type : 'detection',
    updated_at: updatedAt !== null && updatedAt !== void 0 ? updatedAt : dateNow,
    updated_by,
    version: version !== null && version !== void 0 ? version : 1 // This should never be undefined for a list (only a list item)

  };
};

exports.transformSavedObjectToExceptionList = transformSavedObjectToExceptionList;

const transformSavedObjectUpdateToExceptionList = ({
  exceptionList,
  savedObject
}) => {
  const dateNow = new Date().toISOString();
  const {
    version: _version,
    attributes: {
      description,
      immutable,
      meta,
      name,
      os_types: osTypes,
      tags,
      type,
      updated_by: updatedBy,
      version
    },
    id,
    updated_at: updatedAt
  } = savedObject; // TODO: Change this to do a decode and throw if the saved object is not as expected.
  // TODO: Do a throw if after the decode this is not the correct "list_type: list"

  return {
    _version,
    created_at: exceptionList.created_at,
    created_by: exceptionList.created_by,
    description: description !== null && description !== void 0 ? description : exceptionList.description,
    id,
    immutable: immutable !== null && immutable !== void 0 ? immutable : exceptionList.immutable,
    list_id: exceptionList.list_id,
    meta: meta !== null && meta !== void 0 ? meta : exceptionList.meta,
    name: name !== null && name !== void 0 ? name : exceptionList.name,
    namespace_type: getExceptionListType({
      savedObjectType: savedObject.type
    }),
    os_types: osTypes !== null && osTypes !== void 0 ? osTypes : exceptionList.os_types,
    tags: tags !== null && tags !== void 0 ? tags : exceptionList.tags,
    tie_breaker_id: exceptionList.tie_breaker_id,
    type: _schemas.exceptionListType.is(type) ? type : exceptionList.type,
    updated_at: updatedAt !== null && updatedAt !== void 0 ? updatedAt : dateNow,
    updated_by: updatedBy !== null && updatedBy !== void 0 ? updatedBy : exceptionList.updated_by,
    version: version !== null && version !== void 0 ? version : exceptionList.version
  };
};

exports.transformSavedObjectUpdateToExceptionList = transformSavedObjectUpdateToExceptionList;

const transformSavedObjectToExceptionListItem = ({
  savedObject
}) => {
  const dateNow = new Date().toISOString();
  const {
    version: _version,
    attributes: {
      /* eslint-disable @typescript-eslint/naming-convention */
      comments,
      created_at,
      created_by,
      description,
      entries,
      item_id: itemId,
      list_id,
      meta,
      name,
      os_types,
      tags,
      tie_breaker_id,
      type,
      updated_by
      /* eslint-enable @typescript-eslint/naming-convention */

    },
    id,
    updated_at: updatedAt
  } = savedObject; // TODO: Change this to do a decode and throw if the saved object is not as expected.
  // TODO: Do a throw if after the decode this is not the correct "list_type: item"
  // TODO: Do a throw if item_id or entries is not defined.

  return {
    _version,
    comments: comments !== null && comments !== void 0 ? comments : [],
    created_at,
    created_by,
    description,
    entries: entries !== null && entries !== void 0 ? entries : [],
    id,
    item_id: itemId !== null && itemId !== void 0 ? itemId : '(unknown)',
    list_id,
    meta,
    name,
    namespace_type: getExceptionListType({
      savedObjectType: savedObject.type
    }),
    os_types,
    tags,
    tie_breaker_id,
    type: _schemas.exceptionListItemType.is(type) ? type : 'simple',
    updated_at: updatedAt !== null && updatedAt !== void 0 ? updatedAt : dateNow,
    updated_by
  };
};

exports.transformSavedObjectToExceptionListItem = transformSavedObjectToExceptionListItem;

const transformSavedObjectUpdateToExceptionListItem = ({
  exceptionListItem,
  savedObject
}) => {
  const dateNow = new Date().toISOString();
  const {
    version: _version,
    attributes: {
      comments,
      description,
      entries,
      meta,
      name,
      os_types: osTypes,
      tags,
      type,
      updated_by: updatedBy
    },
    id,
    updated_at: updatedAt
  } = savedObject; // TODO: Change this to do a decode and throw if the saved object is not as expected.
  // TODO: Do a throw if after the decode this is not the correct "list_type: list"
  // TODO: Update exception list and item types (perhaps separating out) so as to avoid
  // defaulting

  return {
    _version,
    comments: comments !== null && comments !== void 0 ? comments : exceptionListItem.comments,
    created_at: exceptionListItem.created_at,
    created_by: exceptionListItem.created_by,
    description: description !== null && description !== void 0 ? description : exceptionListItem.description,
    entries: entries !== null && entries !== void 0 ? entries : exceptionListItem.entries,
    id,
    item_id: exceptionListItem.item_id,
    list_id: exceptionListItem.list_id,
    meta: meta !== null && meta !== void 0 ? meta : exceptionListItem.meta,
    name: name !== null && name !== void 0 ? name : exceptionListItem.name,
    namespace_type: getExceptionListType({
      savedObjectType: savedObject.type
    }),
    os_types: osTypes !== null && osTypes !== void 0 ? osTypes : exceptionListItem.os_types,
    tags: tags !== null && tags !== void 0 ? tags : exceptionListItem.tags,
    tie_breaker_id: exceptionListItem.tie_breaker_id,
    type: _schemas.exceptionListItemType.is(type) ? type : exceptionListItem.type,
    updated_at: updatedAt !== null && updatedAt !== void 0 ? updatedAt : dateNow,
    updated_by: updatedBy !== null && updatedBy !== void 0 ? updatedBy : exceptionListItem.updated_by
  };
};

exports.transformSavedObjectUpdateToExceptionListItem = transformSavedObjectUpdateToExceptionListItem;

const transformSavedObjectsToFoundExceptionListItem = ({
  savedObjectsFindResponse
}) => {
  return {
    data: savedObjectsFindResponse.saved_objects.map(savedObject => transformSavedObjectToExceptionListItem({
      savedObject
    })),
    page: savedObjectsFindResponse.page,
    per_page: savedObjectsFindResponse.per_page,
    total: savedObjectsFindResponse.total
  };
};

exports.transformSavedObjectsToFoundExceptionListItem = transformSavedObjectsToFoundExceptionListItem;

const transformSavedObjectsToFoundExceptionList = ({
  savedObjectsFindResponse
}) => {
  return {
    data: savedObjectsFindResponse.saved_objects.map(savedObject => transformSavedObjectToExceptionList({
      savedObject
    })),
    page: savedObjectsFindResponse.page,
    per_page: savedObjectsFindResponse.per_page,
    total: savedObjectsFindResponse.total
  };
};

exports.transformSavedObjectsToFoundExceptionList = transformSavedObjectsToFoundExceptionList;

const transformUpdateCommentsToComments = ({
  comments,
  existingComments,
  user
}) => {
  const incomingComments = comments !== null && comments !== void 0 ? comments : [];
  const newComments = incomingComments.filter(comment => comment.id == null);
  const newCommentsFormatted = transformCreateCommentsToComments({
    incomingComments: newComments,
    user
  });
  return [...existingComments, ...newCommentsFormatted];
};

exports.transformUpdateCommentsToComments = transformUpdateCommentsToComments;

const transformCreateCommentsToComments = ({
  incomingComments,
  user
}) => {
  const dateNow = new Date().toISOString();
  return incomingComments.map(comment => ({
    comment: comment.comment,
    created_at: dateNow,
    created_by: user,
    id: _uuid.default.v4()
  }));
};

exports.transformCreateCommentsToComments = transformCreateCommentsToComments;