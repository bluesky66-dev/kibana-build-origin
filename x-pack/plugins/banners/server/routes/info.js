"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerInfoRoute = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

const registerInfoRoute = (router, config) => {
  router.get({
    path: '/api/banners/info',
    validate: false,
    options: {
      authRequired: false
    }
  }, (ctx, req, res) => {
    const allowed = isValidLicense(ctx.licensing.license);
    return res.ok({
      body: {
        allowed,
        banner: config
      }
    });
  });
};

exports.registerInfoRoute = registerInfoRoute;

const isValidLicense = license => {
  return license.hasAtLeast('gold');
};