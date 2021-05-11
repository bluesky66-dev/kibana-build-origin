"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerScrollForExportRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _lodash = require("lodash");

var _lib = require("../lib");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerScrollForExportRoute = router => {
  router.post({
    path: '/api/kibana/management/saved_objects/scroll/export',
    validate: {
      body: _configSchema.schema.object({
        typesToInclude: _configSchema.schema.arrayOf(_configSchema.schema.string())
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const {
      typesToInclude
    } = req.body;
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const includedHiddenTypes = (0, _lodash.chain)(typesToInclude).uniq().filter(type => typeRegistry.isHidden(type) && typeRegistry.isImportableAndExportable(type)).value();
    const client = getClient({
      includedHiddenTypes
    });
    const objects = await (0, _lib.findAll)(client, {
      perPage: 1000,
      type: typesToInclude
    });
    return res.ok({
      body: objects.map(hit => {
        return {
          _id: hit.id,
          _type: hit.type,
          _source: hit.attributes,
          _meta: {
            savedObjectVersion: 2
          },
          _migrationVersion: hit.migrationVersion,
          _references: hit.references || []
        };
      })
    });
  }));
};

exports.registerScrollForExportRoute = registerScrollForExportRoute;