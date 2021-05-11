"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SpacesService = void 0;

var _common = require("../../common");

var _constants = require("../../common/constants");

var _namespace = require("../lib/utils/namespace");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


class SpacesService {
  setup({
    basePath
  }) {
    return {
      getSpaceId: request => {
        return this.getSpaceId(request, basePath);
      },
      spaceIdToNamespace: _namespace.spaceIdToNamespace,
      namespaceToSpaceId: _namespace.namespaceToSpaceId
    };
  }

  start({
    basePath,
    spacesClientService
  }) {
    return {
      getSpaceId: request => {
        return this.getSpaceId(request, basePath);
      },
      getActiveSpace: request => {
        const spaceId = this.getSpaceId(request, basePath);
        return spacesClientService.createSpacesClient(request).get(spaceId);
      },
      isInDefaultSpace: request => {
        const spaceId = this.getSpaceId(request, basePath);
        return spaceId === _constants.DEFAULT_SPACE_ID;
      },
      createSpacesClient: request => spacesClientService.createSpacesClient(request),
      spaceIdToNamespace: _namespace.spaceIdToNamespace,
      namespaceToSpaceId: _namespace.namespaceToSpaceId
    };
  }

  stop() {}

  getSpaceId(request, basePathService) {
    const basePath = basePathService.get(request);
    const {
      spaceId
    } = (0, _common.getSpaceIdFromPath)(basePath, basePathService.serverBasePath);
    return spaceId;
  }

}

exports.SpacesService = SpacesService;