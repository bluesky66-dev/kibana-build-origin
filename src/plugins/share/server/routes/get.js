"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createGetterRoute = void 0;

var _configSchema = require("@kbn/config-schema");

var _short_url_assert_valid = require("./lib/short_url_assert_valid");

var _short_url_routes = require("../../common/short_url_routes");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createGetterRoute = ({
  router,
  shortUrlLookup,
  http
}) => {
  router.get({
    path: (0, _short_url_routes.getUrlPath)('{urlId}'),
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
    return response.ok({
      body: {
        url
      }
    });
  }));
};

exports.createGetterRoute = createGetterRoute;