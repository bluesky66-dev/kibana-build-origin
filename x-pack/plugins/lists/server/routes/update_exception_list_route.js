"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateExceptionListRoute = void 0;

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


const updateExceptionListRoute = router => {
  router.put({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.EXCEPTION_LIST_URL,
    validate: {
      body: (0, _siem_server_deps.buildRouteValidation)(_schemas.updateExceptionListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        _version,
        tags,
        name,
        description,
        id,
        list_id: listId,
        meta,
        namespace_type: namespaceType,
        os_types: osTypes,
        type,
        version
      } = request.body;
      const exceptionLists = (0, _utils.getExceptionListClient)(context);

      if (id == null && listId == null) {
        return siemResponse.error({
          body: 'either id or list_id need to be defined',
          statusCode: 404
        });
      } else {
        const list = await exceptionLists.updateExceptionList({
          _version,
          description,
          id,
          listId,
          meta,
          name,
          namespaceType,
          osTypes,
          tags,
          type,
          version
        });

        if (list == null) {
          return siemResponse.error({
            body: (0, _utils.getErrorMessageExceptionList)({
              id,
              listId
            }),
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _shared_imports.validate)(list, _schemas.exceptionListSchema);

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

exports.updateExceptionListRoute = updateExceptionListRoute;