"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findExceptionListRoute = void 0;

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


const findExceptionListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_constants.EXCEPTION_LIST_URL}/_find`,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.findExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const exceptionLists = (0, _utils.getExceptionListClient)(context);
      const {
        filter,
        page,
        namespace_type: namespaceType,
        per_page: perPage,
        sort_field: sortField,
        sort_order: sortOrder
      } = request.query;
      const exceptionListItems = await exceptionLists.findExceptionList({
        filter,
        namespaceType,
        page,
        perPage,
        sortField,
        sortOrder
      });
      const [validated, errors] = (0, _shared_imports.validate)(exceptionListItems, _schemas.foundExceptionListSchema);

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
    } catch (err) {
      const error = (0, _siem_server_deps.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.findExceptionListRoute = findExceptionListRoute;