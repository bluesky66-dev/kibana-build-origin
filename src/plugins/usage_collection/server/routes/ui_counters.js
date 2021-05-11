"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUiCountersRoute = registerUiCountersRoute;

var _configSchema = require("@kbn/config-schema");

var _report = require("../report");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
function registerUiCountersRoute(router, getSavedObjects) {
  router.post({
    path: '/api/ui_counters/_report',
    validate: {
      body: _configSchema.schema.object({
        report: _report.reportSchema
      })
    }
  }, async (context, req, res) => {
    const {
      report
    } = req.body;

    try {
      const internalRepository = getSavedObjects();

      if (!internalRepository) {
        throw Error(`The saved objects client hasn't been initialised yet`);
      }

      await (0, _report.storeReport)(internalRepository, report);
      return res.ok({
        body: {
          status: 'ok'
        }
      });
    } catch (error) {
      return res.ok({
        body: {
          status: 'fail'
        }
      });
    }
  });
}