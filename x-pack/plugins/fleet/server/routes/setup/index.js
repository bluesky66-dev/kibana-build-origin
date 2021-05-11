"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = exports.registerGetFleetStatusRoute = exports.registerCreateFleetSetupRoute = exports.registerFleetSetupRoute = void 0;

var _constants = require("../../constants");

var _handlers = require("./handlers");

var _types = require("../../types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const registerFleetSetupRoute = router => {
  router.post({
    path: _constants.SETUP_API_ROUTE,
    validate: false,
    // if this route is set to `-all`, a read-only user get a 404 for this route
    // and will see `Unable to initialize Ingest Manager` in the UI
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.FleetSetupHandler);
};

exports.registerFleetSetupRoute = registerFleetSetupRoute;

const registerCreateFleetSetupRoute = router => {
  router.post({
    path: _constants.AGENTS_SETUP_API_ROUTES.CREATE_PATTERN,
    validate: _types.PostFleetSetupRequestSchema,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-all`]
    }
  }, _handlers.createFleetSetupHandler);
};

exports.registerCreateFleetSetupRoute = registerCreateFleetSetupRoute;

const registerGetFleetStatusRoute = router => {
  router.get({
    path: _constants.AGENTS_SETUP_API_ROUTES.INFO_PATTERN,
    validate: false,
    options: {
      tags: [`access:${_constants.PLUGIN_ID}-read`]
    }
  }, _handlers.getFleetStatusHandler);
};

exports.registerGetFleetStatusRoute = registerGetFleetStatusRoute;

const registerRoutes = (router, config) => {
  // Ingest manager setup
  registerFleetSetupRoute(router);

  if (!config.agents.enabled) {
    return;
  } // Get Fleet setup


  registerGetFleetStatusRoute(router); // Create Fleet setup

  registerCreateFleetSetupRoute(router);
};

exports.registerRoutes = registerRoutes;