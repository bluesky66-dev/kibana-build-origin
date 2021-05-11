"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createExceptionListItemRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _get_exception_list_client = require("./utils/get_exception_list_client");

var _endpoint_disallowed_fields = require("./endpoint_disallowed_fields");

var _validate = require("./validate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const createExceptionListItemRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.EXCEPTION_LIST_ITEM_URL,
    validate: {
      body: (0, _siem_server_deps.buildRouteValidation)(_schemas.createExceptionListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const {
        namespace_type: namespaceType,
        name,
        tags,
        meta,
        comments,
        description,
        entries,
        item_id: itemId,
        list_id: listId,
        os_types: osTypes,
        type
      } = request.body;
      const exceptionLists = (0, _get_exception_list_client.getExceptionListClient)(context);
      const exceptionList = await exceptionLists.getExceptionList({
        id: undefined,
        listId,
        namespaceType
      });

      if (exceptionList == null) {
        return siemResponse.error({
          body: `exception list id: "${listId}" does not exist`,
          statusCode: 404
        });
      } else {
        const exceptionListItem = await exceptionLists.getExceptionListItem({
          id: undefined,
          itemId,
          namespaceType
        });

        if (exceptionListItem != null) {
          return siemResponse.error({
            body: `exception list item id: "${itemId}" already exists`,
            statusCode: 409
          });
        } else {
          if (exceptionList.type === 'endpoint') {
            const error = (0, _validate.validateEndpointExceptionItemEntries)(request.body.entries);

            if (error != null) {
              return siemResponse.error(error);
            }

            for (const entry of entries) {
              if (_endpoint_disallowed_fields.endpointDisallowedFields.includes(entry.field)) {
                return siemResponse.error({
                  body: `cannot add endpoint exception item on field ${entry.field}`,
                  statusCode: 400
                });
              }
            }
          }

          const createdList = await exceptionLists.createExceptionListItem({
            comments,
            description,
            entries,
            itemId,
            listId,
            meta,
            name,
            namespaceType,
            osTypes,
            tags,
            type
          });
          const [validated, errors] = (0, _shared_imports.validate)(createdList, _schemas.exceptionListItemSchema);

          if (errors != null) {
            return siemResponse.error({
              body: errors,
              statusCode: 500
            });
          } else {
            const listSizeError = await (0, _validate.validateExceptionListSize)(exceptionLists, listId, namespaceType);

            if (listSizeError != null) {
              await exceptionLists.deleteExceptionListItemById({
                id: createdList.id,
                namespaceType
              });
              return siemResponse.error(listSizeError);
            }

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

exports.createExceptionListItemRoute = createExceptionListItemRoute;