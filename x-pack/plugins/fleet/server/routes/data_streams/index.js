"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _constants = require("../../constants");

var _handlers = require("./handlers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerRoutes = router => {
  // List of data streams
  router.get({
    path: _constants.DATA_STREAM_API_ROUTES.LIST_PATTERN,
    validate: false,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getListHandler);
};

exports.registerRoutes = registerRoutes;