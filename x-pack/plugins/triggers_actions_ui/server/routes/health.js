"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHealthRoute = createHealthRoute;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function createHealthRoute(logger, router, baseRoute, isAlertsAvailable) {
  const path = `${baseRoute}/_health`;
  logger.debug(`registering triggers_actions_ui health route GET ${path}`);
  router.get({
    path,
    validate: false
  }, handler);

  async function handler(ctx, req, res) {
    const result = {
      isAlertsAvailable
    };
    logger.debug(`route ${path} response: ${JSON.stringify(result)}`);
    return res.ok({
      body: result
    });
  }
}