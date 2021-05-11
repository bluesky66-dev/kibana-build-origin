"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _handler = require("./handler");

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  router.get({
    path: _constants.OUTPUT_API_ROUTES.LIST_PATTERN,
    validate: _types.GetOutputsRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handler.getOutputsHandler);
  router.get({
    path: _constants.OUTPUT_API_ROUTES.INFO_PATTERN,
    validate: _types.GetOneOutputRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handler.getOneOuputHandler);
  router.put({
    path: _constants.OUTPUT_API_ROUTES.UPDATE_PATTERN,
    validate: _types.PutOutputRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handler.putOuputHandler);
};

exports.registerRoutes = registerRoutes;