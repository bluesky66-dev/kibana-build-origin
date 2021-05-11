"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createListItemRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _schemas = require("../../common/schemas");

var _shared_imports = require("../../common/shared_imports");

var _ = require(".");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createListItemRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.LIST_ITEM_URL,
    validate: {
      body: (0, _siem_server_deps.buildRouteValidation)(_schemas.createListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        id,
        list_id: listId,
        value,
        meta
      } = request.body;
      const lists = (0, _.getListClient)(context);
      const list = await lists.getList({
        id: listId
      });

      if (list == null) {
        return siemResponse.error({
          body: `list id: "${listId}" does not exist`,
          statusCode: 404
        });
      } else {
        if (id != null) {
          const listItem = await lists.getListItem({
            id
          });

          if (listItem != null) {
            return siemResponse.error({
              body: `list item id: "${id}" already exists`,
              statusCode: 409
            });
          }
        }

        const createdListItem = await lists.createListItem({
          deserializer: list.deserializer,
          id,
          listId,
          meta,
          serializer: list.serializer,
          type: list.type,
          value
        });

        if (createdListItem != null) {
          const [validated, errors] = (0, _shared_imports.validate)(createdListItem, _schemas.listItemSchema);

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
        } else {
          return siemResponse.error({
            body: 'list item invalid',
            statusCode: 400
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

exports.createListItemRoute = createListItemRoute;