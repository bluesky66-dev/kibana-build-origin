"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSimulateRoute = registerSimulateRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({}, {
  unknowns: 'allow'
});

function registerSimulateRoute({
  router,
  license,
  lib
}) {
  router.post({
    path: (0, _index.addBasePath)('/index_templates/simulate'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const template = req.body;

    try {
      const templatePreview = await callAsCurrentUser('dataManagement.simulateTemplate', {
        body: template
      });
      return res.ok({
        body: templatePreview
      });
    } catch (e) {
      if (lib.isEsError(e)) {
        const error = lib.parseEsError(e.response);
        return res.customError({
          statusCode: e.statusCode,
          body: {
            message: error.message,
            attributes: error
          }
        });
      } // Case: default


      return res.internalError({
        body: e
      });
    }
  }));
}