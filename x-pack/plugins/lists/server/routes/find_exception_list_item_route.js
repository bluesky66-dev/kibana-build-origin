"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionListItemRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findExceptionListItemRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_constants.EXCEPTION_LIST_ITEM_URL}/_find`,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.findExceptionListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const exceptionLists = (0, _utils.getExceptionListClient)(context);
      const {
        filter,
        list_id: listId,
        namespace_type: namespaceType,
        page,
        per_page: perPage,
        sort_field: sortField,
        sort_order: sortOrder
      } = request.query;

      if (listId.length !== namespaceType.length) {
        return siemResponse.error({
          body: `list_id and namespace_id need to have the same comma separated number of values. Expected list_id length: ${listId.length} to equal namespace_type length: ${namespaceType.length}`,
          statusCode: 400
        });
      } else {
        const exceptionListItems = await exceptionLists.findExceptionListsItem({
          filter,
          listId,
          namespaceType,
          page,
          perPage,
          sortField,
          sortOrder
        });

        if (exceptionListItems == null) {
          return siemResponse.error({
            body: `exception list id: "${listId}" does not exist`,
            statusCode: 404
          });
        }

        const [validated, errors] = (0, _shared_imports.validate)(exceptionListItems, _schemas.foundExceptionListItemSchema);

        if (errors != null) {
          return siemResponse.error({
            body: errors,
            statusCode: 500
          });
        } else {
          return response.ok({
            body: validated !== null && validated !== void 0 ? validated : {}
          });
        }
      }
    } catch (err) {
      const error = (0, _siem_server_deps.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.findExceptionListItemRoute = findExceptionListItemRoute;