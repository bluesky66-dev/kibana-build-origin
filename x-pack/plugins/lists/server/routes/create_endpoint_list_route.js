"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createEndpointListRoute = void 0;

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

/**
 * This creates the endpoint list if it does not exist. If it does exist,
 * this will conflict but continue. This is intended to be as fast as possible so it tries
 * each and every time it is called to create the endpoint_list and just ignores any
 * conflict so at worse case only one round trip happens per API call. If any error other than conflict
 * happens this will return that error. If the list already exists this will return an empty
 * object.
 * @param router The router to use.
 */


const createEndpointListRoute = router => {
  router.post({
    options: {
      tags: ['access:lists-all']
    },
    path: _constants.ENDPOINT_LIST_URL,
    validate: false
  }, async (context, _, response) => {
    const siemResponse = (0, _siem_server_deps.buildSiemResponse)(response);

    try {
      const exceptionLists = (0, _get_exception_list_client.getExceptionListClient)(context);
      const createdList = await exceptionLists.createEndpointList(); // We always return ok on a create  endpoint list route but with an empty body as
      // an additional fetch of the full list would be slower and the UI has everything hard coded
      // within it to get the list if it needs details about it. Our goal is to be as fast as possible
      // and block the least amount of time with this route since it could end up in various parts of the
      // stack at some point such as repeatedly being called by endpoint agents.

      const body = createdList !== null && createdList !== void 0 ? createdList : {};
      const [validated, errors] = (0, _shared_imports.validate)(body, _schemas.createEndpointListSchema);

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
    } catch (err) {
      const error = (0, _siem_server_deps.transformError)(err);
      return siemResponse.error({
        body: error.message,
        statusCode: error.statusCode
      });
    }
  });
};

exports.createEndpointListRoute = createEndpointListRoute;