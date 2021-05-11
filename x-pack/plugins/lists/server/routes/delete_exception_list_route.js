"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteExceptionListRoute = void 0;

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


const deleteExceptionListRoute = router => {
  router.delete({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.EXCEPTION_LIST_URL,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.deleteExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const exceptionLists = (0, _utils.getExceptionListClient)(context);
      const {
        list_id: listId,
        id,
        namespace_type: namespaceType
      } = request.query;

      if (listId == null && id == null) {
        return siemResponse.error({
          body: 'Either "list_id" or "id" needs to be defined in the request',
          statusCode: 400
        });
      } else {
        const deleted = await exceptionLists.deleteExceptionList({
          id,
          listId,
          namespaceType
        });

        if (deleted == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _shared_imports.validate)(deleted, _schemas.exceptionListSchema);

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

exports.deleteExceptionListRoute = deleteExceptionListRoute;