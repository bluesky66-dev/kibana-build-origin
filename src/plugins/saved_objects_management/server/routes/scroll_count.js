"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerScrollForCountRoute = void 0;

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
const registerScrollForCountRoute = router => {
  router.post({
    path: '/api/kibana/management/saved_objects/scroll/counts',
    validate: {
      body: _configSchema.schema.object({
        typesToInclude: _configSchema.schema.arrayOf(_configSchema.schema.string()),
        searchString: _configSchema.schema.maybe(_configSchema.schema.string()),
        references: _configSchema.schema.maybe(_configSchema.schema.arrayOf(_configSchema.schema.object({
          type: _configSchema.schema.string(),
          id: _configSchema.schema.string()
        })))
      })
    }
  }, router.handleLegacyErrors(async (context, req, res) => {
    const {
      getClient,
      typeRegistry
    } = context.core.savedObjects;
    const {
      typesToInclude,
      searchString,
      references
    } = req.body;
    const includedHiddenTypes = (0, _lodash.chain)(typesToInclude).uniq().filter(type => typeRegistry.isHidden(type) && typeRegistry.isImportableAndExportable(type)).value();
    const client = getClient({
      includedHiddenTypes
    });
    const findOptions = {
      type: typesToInclude,
      perPage: 1000
    };

    if (searchString) {
      findOptions.search = `${searchString}*`;
      findOptions.searchFields = ['title'];
    }

    if (references) {
      findOptions.hasReference = references;
      findOptions.hasReferenceOperator = 'OR';
    }

    const objects = await (0, _lib.findAll)(client, findOptions);
    const counts = objects.reduce((accum, result) => {
      const type = result.type;
      accum[type] = accum[type] || 0;
      accum[type]++;
      return accum;
    }, {});

    for (const type of typesToInclude) {
      if (!counts[type]) {
        counts[type] = 0;
      }
    }

    return res.ok({
      body: counts
    });
  }));
};

exports.registerScrollForCountRoute = registerScrollForCountRoute;