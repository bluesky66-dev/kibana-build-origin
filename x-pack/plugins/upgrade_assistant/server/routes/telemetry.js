"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTelemetryRoutes = registerTelemetryRoutes;

var _configSchema = require("@kbn/config-schema");

var _es_ui_open_apis = require("../lib/telemetry/es_ui_open_apis");

var _es_ui_reindex_apis = require("../lib/telemetry/es_ui_reindex_apis");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function registerTelemetryRoutes({
  router,
  getSavedObjectsService
}) {
  router.put({
    path: '/api/upgrade_assistant/stats/ui_open',
    validate: {
      body: _configSchema.schema.object({
        overview: _configSchema.schema.boolean({
          defaultValue: false
        }),
        cluster: _configSchema.schema.boolean({
          defaultValue: false
        }),
        indices: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, async (ctx, request, response) => {
    const {
      cluster,
      indices,
      overview
    } = request.body;

    try {
      return response.ok({
        body: await (0, _es_ui_open_apis.upsertUIOpenOption)({
          savedObjects: getSavedObjectsService(),
          cluster,
          indices,
          overview
        })
      });
    } catch (e) {
      return response.internalError({
        body: e
      });
    }
  });
  router.put({
    path: '/api/upgrade_assistant/stats/ui_reindex',
    validate: {
      body: _configSchema.schema.object({
        close: _configSchema.schema.boolean({
          defaultValue: false
        }),
        open: _configSchema.schema.boolean({
          defaultValue: false
        }),
        start: _configSchema.schema.boolean({
          defaultValue: false
        }),
        stop: _configSchema.schema.boolean({
          defaultValue: false
        })
      })
    }
  }, async (ctx, request, response) => {
    const {
      close,
      open,
      start,
      stop
    } = request.body;

    try {
      return response.ok({
        body: await (0, _es_ui_reindex_apis.upsertUIReindexOption)({
          savedObjects: getSavedObjectsService(),
          close,
          open,
          start,
          stop
        })
      });
    } catch (e) {
      return response.internalError({
        body: e
      });
    }
  });
}