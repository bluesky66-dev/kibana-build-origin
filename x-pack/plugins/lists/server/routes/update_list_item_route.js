"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateListItemRoute = void 0;

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


const updateListItemRoute = router => {
  router.put({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.LIST_ITEM_URL,
    validate: {
      body: (0, _siem_server_deps.buildRouteValidation)(_schemas.updateListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        value,
        id,
        meta,
        _version
      } = request.body;
      const lists = (0, _.getListClient)(context);
      const listItem = await lists.updateListItem({
        _version,
        id,
        meta,
        value
      });

      if (listItem == null) {
        return siemResponse.error({
          body: `list item id: "${id}" not found`,
          statusCode: 404
        });
      } else {
        const [validated, errors] = (0, _shared_imports.validate)(listItem, _schemas.listItemSchema);

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

exports.updateListItemRoute = updateListItemRoute;