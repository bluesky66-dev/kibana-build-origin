"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readListRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const readListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: _constants.LIST_URL,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.readListSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        id
      } = request.query;
      const lists = (0, _.getListClient)(context);
      const list = await lists.getList({
        id
      });

      if (list == null) {
        return siemResponse.error({
          body: `list id: "${id}" does not exist`,
          statusCode: 404
        });
      } else {
        const [validated, errors] = (0, _shared_imports.validate)(list, _schemas.listSchema);

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

exports.readListRoute = readListRoute;