"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerMigrateRoute = void 0;

var _utils = require("./utils");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerMigrateRoute = (router, migratorPromise) => {
  router.post({
    path: '/_migrate',
    validate: false,
    options: {
      tags: ['access:migrateSavedObjects']
    }
  }, (0, _utils.catchAndReturnBoomErrors)(async (context, req, res) => {
    const migrator = await migratorPromise;
    await migrator.runMigrations({
      rerun: true
    });
    return res.ok({
      body: {
        success: true
      }
    });
  }));
};

exports.registerMigrateRoute = registerMigrateRoute;