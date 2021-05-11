"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spacesUtilsProvider = spacesUtilsProvider;

var _server = require("../../../../../src/core/server");

var _app = require("../../common/constants/app");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function spacesUtilsProvider(getSpacesPlugin, request) {
  async function isMlEnabledInSpace() {
    if (getSpacesPlugin === undefined) {
      // if spaces is disabled force isMlEnabledInSpace to be true
      return true;
    }

    const space = await (await getSpacesPlugin()).spacesService.getActiveSpace(request instanceof _server.KibanaRequest ? request : _server.KibanaRequest.from(request));
    return space.disabledFeatures.includes(_app.PLUGIN_ID) === false;
  }

  async function getAllSpaces() {
    if (getSpacesPlugin === undefined) {
      return null;
    }

    const client = (await getSpacesPlugin()).spacesService.createSpacesClient(request instanceof _server.KibanaRequest ? request : _server.KibanaRequest.from(request));
    return await client.getAll();
  }

  async function getAllSpaceIds() {
    const spaces = await getAllSpaces();

    if (spaces === null) {
      return null;
    }

    return spaces.map(s => s.id);
  }

  async function getMlSpaceIds() {
    const spaces = await getAllSpaces();

    if (spaces === null) {
      return null;
    }

    return spaces.filter(s => s.disabledFeatures.includes(_app.PLUGIN_ID) === false).map(s => s.id);
  }

  async function getCurrentSpaceId() {
    if (getSpacesPlugin === undefined) {
      // if spaces is disabled force isMlEnabledInSpace to be true
      return null;
    }

    const space = await (await getSpacesPlugin()).spacesService.getActiveSpace(request instanceof _server.KibanaRequest ? request : _server.KibanaRequest.from(request));
    return space.id;
  }

  return {
    isMlEnabledInSpace,
    getAllSpaces,
    getAllSpaceIds,
    getMlSpaceIds,
    getCurrentSpaceId
  };
}