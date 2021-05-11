"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findListItemRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _shared_imports = require("../../common/shared_imports");

var _schemas = require("../../common/schemas");

var _utils = require("../services/utils");

var _utils2 = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findListItemRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_constants.LIST_ITEM_URL}/_find`,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.findListItemSchema)
    }
  }, async (context, request, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const lists = (0, _utils2.getListClient)(context);
      const {
        cursor,
        filter: filterOrUndefined,
        list_id: listId,
        page: pageOrUndefined,
        per_page: perPageOrUndefined,
        sort_field: sortField,
        sort_order: sortOrder
      } = request.query;
      const page = pageOrUndefined !== null && pageOrUndefined !== void 0 ? pageOrUndefined : 1;
      const perPage = perPageOrUndefined !== null && perPageOrUndefined !== void 0 ? perPageOrUndefined : 20;
      const filter = filterOrUndefined !== null && filterOrUndefined !== void 0 ? filterOrUndefined : '';
      const {
        isValid,
        errorMessage,
        cursor: [currentIndexPosition, searchAfter]
      } = (0, _utils.decodeCursor)({
        cursor,
        page,
        perPage,
        sortField
      });

      if (!isValid) {
        return siemResponse.error({
          body: errorMessage,
          statusCode: 400
        });
      } else {
        const exceptionList = await lists.findListItem({
          currentIndexPosition,
          filter,
          listId,
          page,
          perPage,
          searchAfter,
          sortField,
          sortOrder
        });

        if (exceptionList == null) {
          return siemResponse.error({
            body: `list id: "${listId}" does not exist`,
            statusCode: 404
          });
        } else {
          const [validated, errors] = (0, _shared_imports.validate)(exceptionList, _schemas.foundListItemSchema);

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

exports.findListItemRoute = findListItemRoute;