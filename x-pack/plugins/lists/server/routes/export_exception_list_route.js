"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getExport = exports.exportExceptionListRoute = void 0;

var _constants = require("../../common/constants");

var _siem_server_deps = require("../siem_server_deps");

var _schemas = require("../../common/schemas");

var _utils = require("./utils");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const exportExceptionListRoute = router => {
  router.get({
    options: {
      tags: ['access:lists-read']
    },
    path: `${_constants.EXCEPTION_LIST_URL}/_export`,
    validate: {
      query: (0, _siem_server_deps.buildRouteValidation)(_schemas.exportExceptionListQuerySchema)
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
      const exceptionList = await exceptionLists.getExceptionList({
        id,
        listId,
        namespaceType
      });

      if (exceptionList == null) {
        return siemResponse.error({
          body: `list_id: ${listId} does not exist`,
          statusCode: 400
        });
      } else {
        var _listItems$data;

        const {
          exportData: exportList
        } = getExport([exceptionList]);
        const listItems = await exceptionLists.findExceptionListItem({
          filter: undefined,
          listId,
          namespaceType,
          page: 1,
          perPage: 10000,
          sortField: 'exception-list.created_at',
          sortOrder: 'desc'
        });
        const {
          exportData: exportListItems,
          exportDetails
        } = getExport((_listItems$data = listItems === null || listItems === void 0 ? void 0 : listItems.data) !== null && _listItems$data !== void 0 ? _listItems$data : []);
        const responseBody = [exportList, exportListItems, {
          exception_list_items_details: exportDetails
        }]; // TODO: Allow the API to override the name of the file to export

        const fileName = exceptionList.list_id;
        return response.ok({
          body: transformDataToNdjson(responseBody),
          headers: {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': 'application/ndjson'
          }
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

exports.exportExceptionListRoute = exportExceptionListRoute;

const transformDataToNdjson = data => {
  if (data.length !== 0) {
    const dataString = data.map(dataItem => JSON.stringify(dataItem)).join('\n');
    return `${dataString}\n`;
  } else {
    return '';
  }
};

const getExport = data => {
  const ndjson = transformDataToNdjson(data);
  const exportDetails = JSON.stringify({
    exported_count: data.length
  });
  return {
    exportData: ndjson,
    exportDetails: `${exportDetails}\n`
  };
};

exports.getExport = getExport;