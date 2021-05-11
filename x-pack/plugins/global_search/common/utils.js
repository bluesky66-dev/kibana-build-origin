"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertResultUrl = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
// interface matching both the server and client-side implementation of IBasePath for our needs
// used to avoid duplicating `convertResultUrl` in server and client code due to different signatures.

/**
 * Convert a {@link GlobalSearchProviderResultUrl | provider result's url} to an absolute or relative url
 * usable in {@link GlobalSearchResult | service results}
 */

const convertResultUrl = (url, basePath) => {
  if (typeof url === 'string') {
    // relative path
    if (url.startsWith('/')) {
      return basePath.prepend(url);
    } // absolute url


    return url;
  }

  if (url.prependBasePath) {
    return basePath.prepend(url.path);
  }

  return url.path;
};

exports.convertResultUrl = convertResultUrl;