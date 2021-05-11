"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authorizationModeFactory = authorizationModeFactory;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

function authorizationModeFactory(license) {
  const useRbacForRequestCache = new WeakMap();
  return {
    useRbacForRequest(request) {
      if (!useRbacForRequestCache.has(request)) {
        useRbacForRequestCache.set(request, license.getFeatures().allowRbac);
      }

      return useRbacForRequestCache.get(request);
    }

  };
}