"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerExportRoute = void 0;

var _moment = _interopRequireDefault(require("moment"));

var _configSchema = require("@kbn/config-schema");

var _lib = require("../lib");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerExportRoute = (router, kibanaVersion) => {
  router.get({
    path: '/api/kibana/dashboards/export',
    validate: {
      query: _configSchema.schema.object({
        dashboard: _configSchema.schema.oneOf([_configSchema.schema.string(), _configSchema.schema.arrayOf(_configSchema.schema.string())])
      })
    },
    options: {
      tags: ['api']
    }
  }, async (ctx, req, res) => {
    const ids = Array.isArray(req.query.dashboard) ? req.query.dashboard : [req.query.dashboard];
    const {
      client
    } = ctx.core.savedObjects;
    const exported = await (0, _lib.exportDashboards)(ids, client, kibanaVersion);
    const filename = `kibana-dashboards.${_moment.default.utc().format('YYYY-MM-DD-HH-mm-ss')}.json`;
    const body = JSON.stringify(exported, null, '  ');
    return res.ok({
      body,
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/json',
        'Content-Length': `${Buffer.byteLength(body, 'utf8')}`
      }
    });
  });
};

exports.registerExportRoute = registerExportRoute;