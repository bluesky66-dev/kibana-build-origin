"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initSpacesOnRequestInterceptor = initSpacesOnRequestInterceptor;

var _common = require("../../../common");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function initSpacesOnRequestInterceptor({
  http
}) {
  http.registerOnPreRouting(async function spacesOnPreRoutingHandler(request, response, toolkit) {
    const serverBasePath = http.basePath.serverBasePath;
    const path = request.url.pathname; // If navigating within the context of a space, then we store the Space's URL Context on the request,
    // and rewrite the request to not include the space identifier in the URL.

    const {
      spaceId,
      pathHasExplicitSpaceIdentifier
    } = (0, _common.getSpaceIdFromPath)(path, serverBasePath);

    if (pathHasExplicitSpaceIdentifier) {
      const reqBasePath = `/s/${spaceId}`;
      http.basePath.set(request, reqBasePath);
      const newPathname = path.substr(reqBasePath.length) || '/';
      return toolkit.rewriteUrl(`${newPathname}${request.url.search}`);
    }

    return toolkit.next();
  });
}