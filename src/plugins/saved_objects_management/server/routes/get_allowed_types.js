"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerGetAllowedTypesRoute = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerGetAllowedTypesRoute = router => {
  router.get({
    path: '/api/kibana/management/saved_objects/_allowed_types',
    validate: false
  }, async (context, req, res) => {
    const allowedTypes = context.core.savedObjects.typeRegistry.getImportableAndExportableTypes().map(type => type.name);
    return res.ok({
      body: {
        types: allowedTypes
      }
    });
  });
};

exports.registerGetAllowedTypesRoute = registerGetAllowedTypesRoute;