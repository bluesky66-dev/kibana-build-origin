"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerDeleteRoute = registerDeleteRoute;

var _configSchema = require("@kbn/config-schema");

var _index = require("../index");

var _helpers = require("../../helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const bodySchema = _configSchema.schema.object({
  dataStreams: _configSchema.schema.arrayOf(_configSchema.schema.string())
});

function registerDeleteRoute({
  router,
  license
}) {
  router.post({
    path: (0, _index.addBasePath)('/delete_data_streams'),
    validate: {
      body: bodySchema
    }
  }, license.guardApiRoute(async (ctx, req, res) => {
    const {
      callAsCurrentUser
    } = ctx.dataManagement.client;
    const {
      dataStreams
    } = req.body;
    const response = {
      dataStreamsDeleted: [],
      errors: []
    };
    await Promise.all(dataStreams.map(async name => {
      try {
        await callAsCurrentUser('dataManagement.deleteDataStream', {
          name
        });
        return response.dataStreamsDeleted.push(name);
      } catch (e) {
        return response.errors.push({
          name,
          error: (0, _helpers.wrapEsError)(e)
        });
      }
    }));
    return res.ok({
      body: response
    });
  }));
}