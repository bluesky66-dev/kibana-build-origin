"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEndpointExceptionItemEntries = exports.validateExceptionListSize = void 0;

var _pipeable = require("fp-ts/lib/pipeable");

var _Either = require("fp-ts/lib/Either");

var _constants = require("../../common/constants");

var _schemas = require("../../common/schemas");

var _endpoint = require("../../common/schemas/types/endpoint");

var _shared_imports = require("../../common/shared_imports");

var _siem_server_deps = require("../siem_server_deps");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const validateExceptionListSize = async (exceptionLists, listId, namespaceType) => {
  const exceptionListItems = await exceptionLists.findExceptionListItem({
    filter: undefined,
    listId,
    namespaceType,
    page: undefined,
    perPage: undefined,
    sortField: undefined,
    sortOrder: undefined
  });

  if (exceptionListItems == null) {
    // If exceptionListItems is null then we couldn't find the list so it may have been deleted
    return {
      body: `Unable to find list id: ${listId} to verify max exception list size`,
      statusCode: 500
    };
  }

  const [validatedItems, err] = (0, _shared_imports.validate)(exceptionListItems, _schemas.foundExceptionListItemSchema);

  if (err != null) {
    return {
      body: err,
      statusCode: 500
    };
  } // Unnecessary since validatedItems comes from exceptionListItems which is already
  // checked for null, but typescript fails to detect that


  if (validatedItems == null) {
    return {
      body: `Unable to find list id: ${listId} to verify max exception list size`,
      statusCode: 500
    };
  }

  if (validatedItems.total > _constants.MAX_EXCEPTION_LIST_SIZE) {
    return {
      body: `Failed to add exception item, exception list would exceed max size of ${_constants.MAX_EXCEPTION_LIST_SIZE}`,
      statusCode: 400
    };
  }

  return null;
};

exports.validateExceptionListSize = validateExceptionListSize;

const validateEndpointExceptionItemEntries = entries => (0, _pipeable.pipe)(_endpoint.nonEmptyEndpointEntriesArray.decode(entries), decoded => (0, _shared_imports.exactCheck)(entries, decoded), (0, _Either.fold)(errors => {
  return {
    body: (0, _siem_server_deps.formatErrors)(errors),
    statusCode: 400
  };
}, () => null));

exports.validateEndpointExceptionItemEntries = validateEndpointExceptionItemEntries;