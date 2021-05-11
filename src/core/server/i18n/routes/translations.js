"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerTranslationsRoute = void 0;

var _crypto = require("crypto");

var _i18n = require("@kbn/i18n");

var _configSchema = require("@kbn/config-schema");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const registerTranslationsRoute = (router, locale) => {
  let translationCache;
  router.get({
    path: '/translations/{locale}.json',
    validate: {
      params: _configSchema.schema.object({
        locale: _configSchema.schema.string()
      })
    },
    options: {
      authRequired: false
    }
  }, (ctx, req, res) => {
    if (req.params.locale.toLowerCase() !== locale.toLowerCase()) {
      return res.notFound({
        body: `Unknown locale: ${req.params.locale}`
      });
    }

    if (!translationCache) {
      const translations = JSON.stringify(_i18n.i18n.getTranslation());
      const hash = (0, _crypto.createHash)('sha1').update(translations).digest('hex');
      translationCache = {
        translations,
        hash
      };
    }

    return res.ok({
      headers: {
        'content-type': 'application/json',
        'cache-control': 'must-revalidate',
        etag: translationCache.hash
      },
      body: translationCache.translations
    });
  });
};

exports.registerTranslationsRoute = registerTranslationsRoute;