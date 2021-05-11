"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSpaceIdFromPath = getSpaceIdFromPath;
exports.addSpaceIdToPath = addSpaceIdToPath;

var _constants = require("../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const spaceContextRegex = /^\/s\/([a-z0-9_\-]+)/;

function getSpaceIdFromPath(requestBasePath, serverBasePath) {
  if (requestBasePath == null) requestBasePath = '/';
  if (serverBasePath == null) serverBasePath = '/';
  const pathToCheck = stripServerBasePath(requestBasePath, serverBasePath); // Look for `/s/space-url-context` in the base path

  const matchResult = pathToCheck.match(spaceContextRegex);

  if (!matchResult || matchResult.length === 0) {
    return {
      spaceId: _constants.DEFAULT_SPACE_ID,
      pathHasExplicitSpaceIdentifier: false
    };
  } // Ignoring first result, we only want the capture group result at index 1


  const [, spaceId] = matchResult;

  if (!spaceId) {
    throw new Error(`Unable to determine Space ID from request path: ${requestBasePath}`);
  }

  return {
    spaceId,
    pathHasExplicitSpaceIdentifier: true
  };
}

function addSpaceIdToPath(basePath = '/', spaceId = '', requestedPath = '') {
  if (requestedPath && !requestedPath.startsWith('/')) {
    throw new Error(`path must start with a /`);
  }

  const normalizedBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;

  if (spaceId && spaceId !== _constants.DEFAULT_SPACE_ID) {
    return `${normalizedBasePath}/s/${spaceId}${requestedPath}`;
  }

  return `${normalizedBasePath}${requestedPath}` || '/';
}

function stripServerBasePath(requestBasePath, serverBasePath) {
  if (serverBasePath && serverBasePath !== '/' && requestBasePath.startsWith(serverBasePath)) {
    return requestBasePath.substr(serverBasePath.length);
  }

  return requestBasePath;
}