"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGotoRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _std = require("@kbn/std");

var _short_url_assert_valid = require("./lib/short_url_assert_valid");

var _short_url_routes = require("../../common/short_url_routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createGotoRoute = ({
  router,
  shortUrlLookup,
  http
}) => {
  http.resources.register({
    path: (0, _short_url_routes.getGotoPath)('{urlId}'),
    validate: {
      params: _configSchema.schema.object({
        urlId: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async function (context, request, response) {
    const url = await shortUrlLookup.getUrl(request.params.urlId, {
      savedObjects: context.core.savedObjects.client
    });
    (0, _short_url_assert_valid.shortUrlAssertValid)(url);
    const uiSettings = context.core.uiSettings.client;
    const stateStoreInSessionStorage = await uiSettings.get('state:storeInSessionStorage');

    if (!stateStoreInSessionStorage) {
      const basePath = http.basePath.get(request);
      const prependedUrl = (0, _std.modifyUrl)(url, parts => {
        if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
          parts.pathname = `${basePath}${parts.pathname}`;
        }
      });
      return response.redirected({
        headers: {
          location: prependedUrl
        }
      });
    }

    return response.renderCoreApp();
  }));
};

exports.createGotoRoute = createGotoRoute;