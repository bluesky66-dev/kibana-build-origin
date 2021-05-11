"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createShortenUrlRoute = void 0;

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
const createShortenUrlRoute = ({
  shortUrlLookup,
  router
}) => {
  router.post({
    path: _short_url_routes.CREATE_PATH,
    validate: {
      body: _configSchema.schema.object({
        url: _configSchema.schema.string()
      })
    }
  }, router.handleLegacyErrors(async function (context, request, response) {
    (0, _short_url_assert_valid.shortUrlAssertValid)(request.body.url);
    const urlId = await shortUrlLookup.generateUrlId(request.body.url, {
      savedObjects: context.core.savedObjects.client
    });
    return response.ok({
      body: {
        urlId
      }
    });
  }));
};

exports.createShortenUrlRoute = createShortenUrlRoute;