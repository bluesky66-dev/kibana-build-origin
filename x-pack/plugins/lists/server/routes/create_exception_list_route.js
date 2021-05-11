"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionListRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _get_exception_list_client = require("./utils/get_exception_list_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createExceptionListRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.EXCEPTION_LIST_URL,
    validate: {
      body: (0, _siem_server_deps.buildRouteValidation)(_schemas.createExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        name,
        tags,
        meta,
        namespace_type: namespaceType,
        description,
        list_id: listId,
        type,
        version
      } = request.body;
      const exceptionLists = (0, _get_exception_list_client.getExceptionListClient)(context);
      const exceptionList = await exceptionLists.getExceptionList({
        id: undefined,
        listId,
        namespaceType
      });

      if (exceptionList != null) {
        return siemResponse.error({
          body: `exception list id: "${listId}" already exists`,
          statusCode: 409
        });
      } else {
        const createdList = await exceptionLists.createExceptionList({
          description,
          immutable: false,
          listId,
          meta,
          name,
          namespaceType,
          tags,
          type,
          version
        });
        const [validated, errors] = (0, _shared_imports.validate)(createdList, _schemas.exceptionListSchema);

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

exports.createExceptionListRoute = createExceptionListRoute;