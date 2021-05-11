"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExceptionListFilter = exports.findExceptionList = void 0;

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findExceptionList = async ({
  namespaceType,
  savedObjectsClient,
  filter,
  page,
  perPage,
  sortField,
  sortOrder
}) => {
  const savedObjectTypes = (0, _utils.getSavedObjectTypes)({
    namespaceType
  });
  const savedObjectsFindResponse = await savedObjectsClient.find({
    filter: getExceptionListFilter({
      filter,
      savedObjectTypes
    }),
    page,
    perPage,
    sortField,
    sortOrder,
    type: savedObjectTypes
  });
  return (0, _utils.transformSavedObjectsToFoundExceptionList)({
    savedObjectsFindResponse
  });
};

exports.findExceptionList = findExceptionList;

const getExceptionListFilter = ({
  filter,
  savedObjectTypes
}) => {
  const listTypesFilter = savedObjectTypes.map(type => `${type}.attributes.list_type: list`).join(' OR ');

  if (filter != null) {
    return `(${listTypesFilter}) AND ${filter}`;
  } else return `(${listTypesFilter})`;
};

exports.getExceptionListFilter = getExceptionListFilter;