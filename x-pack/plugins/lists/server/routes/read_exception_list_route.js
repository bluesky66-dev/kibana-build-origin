"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readExceptionListRoute = void 0;

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


const readExceptionListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _constants.EXCEPTION_LIST_URL,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.readExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        id,
        list_id: listId,
        namespace_type: namespaceType
      } = request.query;
      const exceptionLists = (0, _utils.getExceptionListClient)(context);

      if (id != null || listId != null) {
        const exceptionList = await exceptionLists.getExceptionList({
          id,
          listId,
          namespaceType
        });

        if (exceptionList == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _shared_imports.validate)(exceptionList, _schemas.exceptionListSchema);

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
      } else {
        return siemResponse.error({
          body: 'id or list_id required',
          statusCode: 400
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

exports.readExceptionListRoute = readExceptionListRoute;