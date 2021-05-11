"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListItem = void 0;

var _server = require("../../../../../../src/core/server/");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getExceptionListItem = async ({
  id,
  itemId,
  savedObjectsClient,
  namespaceType
}) => {
  const savedObjectType = (0, _utils.getSavedObjectType)({
    namespaceType
  });

  if (id != null) {
    try {
      const savedObject = await savedObjectsClient.get(savedObjectType, id);
      return (0, _utils.transformSavedObjectToExceptionListItem)({
        savedObject
      });
    } catch (err) {
      if (_server.SavedObjectsErrorHelpers.isNotFoundError(err)) {
        return null;
      } else {
        throw err;
      }
    }
  } else if (itemId != null) {
    const savedObject = await savedObjectsClient.find({
      filter: `${savedObjectType}.attributes.list_type: item`,
      perPage: 1,
      search: itemId,
      searchFields: ['item_id'],
      sortField: 'tie_breaker_id',
      sortOrder: 'desc',
      type: savedObjectType
    });

    if (savedObject.saved_objects[0] != null) {
      return (0, _utils.transformSavedObjectToExceptionListItem)({
        savedObject: savedObject.saved_objects[0]
      });
    } else {
      return null;
    }
  } else {
    return null;
  }
};

exports.getExceptionListItem = getExceptionListItem;