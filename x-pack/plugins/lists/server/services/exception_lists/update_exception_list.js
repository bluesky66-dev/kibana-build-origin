"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionList = void 0;

var _utils = require("./utils");

var _get_exception_list = require("./get_exception_list");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateExceptionList = async ({
  _version,
  id,
  savedObjectsClient,
  namespaceType,
  name,
  description,
  listId,
  meta,
  user,
  tags,
  type,
  version
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
    const calculatedVersion = version == null ? exceptionList.version + 1 : version;
    const savedObject = await savedObjectsClient.update(savedObjectType, exceptionList.id, {
      description,
      meta,
      name,
      tags,
      type,
      updated_by: user,
      version: calculatedVersion
    }, {
      version: _version
    });
    return (0, _utils.transformSavedObjectUpdateToExceptionList)({
      exceptionList,
      savedObject
    });
  }
};

exports.updateExceptionList = updateExceptionList;