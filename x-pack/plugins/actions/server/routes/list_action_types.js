"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listActionTypesRoute = void 0;

var _lib = require("../lib");

var _common = require("../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const listActionTypesRoute = (router, licenseState) => {
  router.get({
    path: `${_common.BASE_ACTION_API_PATH}/list_action_types`,
    validate: {}
  }, router.handleLegacyErrors(async function (context, req, res) {
    (0, _lib.verifyApiAccess)(licenseState);

    if (!context.actions) {
      return res.badRequest({
        body: 'RouteHandlerContext is not registered for actions'
      });
    }

    const actionsClient = context.actions.getActionsClient();
    return res.ok({
      body: await actionsClient.listTypes()
    });
  }));
};

exports.listActionTypesRoute = listActionTypesRoute;