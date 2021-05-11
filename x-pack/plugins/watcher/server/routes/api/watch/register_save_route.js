"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerSaveRoute = registerSaveRoute;

var _configSchema = require("@kbn/config-schema");

var _i18n = require("@kbn/i18n");

var _constants = require("../../../../common/constants");

var _serialization = require("../../../../common/lib/serialization");

var _shared_imports = require("../../../shared_imports");

var _license_pre_routing_factory = require("../../../lib/license_pre_routing_factory");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const paramsSchema = _configSchema.schema.object({
  id: _configSchema.schema.string()
});

const bodySchema = _configSchema.schema.object({
  type: _configSchema.schema.string(),
  isNew: _configSchema.schema.boolean(),
  isActive: _configSchema.schema.boolean()
}, {
  unknowns: 'allow'
});

function registerSaveRoute(deps) {
  deps.router.put({
    path: '/api/watcher/watch/{id}',
    validate: {
      params: paramsSchema,
      body: bodySchema
    }
  }, (0, _license_pre_routing_factory.licensePreRoutingFactory)(deps, async (ctx, request, response) => {
    const {
      id
    } = request.params;
    const {
      type,
      isNew,
      isActive,
      ...watchConfig
    } = request.body;
    const dataClient = ctx.watcher.client; // For new watches, verify watch with the same ID doesn't already exist

    if (isNew) {
      try {
        const existingWatch = await dataClient.callAsCurrentUser('watcher.getWatch', {
          id
        });

        if (existingWatch.found) {
          return response.conflict({
            body: {
              message: _i18n.i18n.translate('xpack.watcher.saveRoute.duplicateWatchIdErrorMessage', {
                defaultMessage: "There is already a watch with ID '{watchId}'.",
                values: {
                  watchId: id
                }
              })
            }
          });
        }
      } catch (e) {
        const es404 = (0, _shared_imports.isEsError)(e) && e.statusCode === 404;

        if (!es404) {
          return response.internalError({
            body: e
          });
        } // Else continue...

      }
    }

    let serializedWatch;

    switch (type) {
      case _constants.WATCH_TYPES.JSON:
        const {
          name,
          watch
        } = watchConfig;
        serializedWatch = (0, _serialization.serializeJsonWatch)(name, watch);
        break;

      case _constants.WATCH_TYPES.THRESHOLD:
        serializedWatch = (0, _serialization.serializeThresholdWatch)(watchConfig);
        break;
    }

    try {
      // Create new watch
      return response.ok({
        body: await dataClient.callAsCurrentUser('watcher.putWatch', {
          id,
          active: isActive,
          body: serializedWatch
        })
      });
    } catch (e) {
      // Case: Error from Elasticsearch JS client
      if ((0, _shared_imports.isEsError)(e)) {
        return response.customError({
          statusCode: e.statusCode,
          body: e
        });
      } // Case: default


      return response.internalError({
        body: e
      });
    }
  }));
}