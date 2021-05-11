"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "spacesClientMock", {
  enumerable: true,
  get: function () {
    return _spaces_client.spacesClientMock;
  }
});
exports.spacesMock = void 0;

var _spaces_client_service = require("./spaces_client/spaces_client_service.mock");

var _spaces_service = require("./spaces_service/spaces_service.mock");

var _spaces_client = require("./spaces_client/spaces_client.mock");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function createSetupMock() {
  return {
    spacesService: _spaces_service.spacesServiceMock.createSetupContract(),
    spacesClient: _spaces_client_service.spacesClientServiceMock.createSetup()
  };
}

function createStartMock() {
  return {
    spacesService: _spaces_service.spacesServiceMock.createStartContract()
  };
}

const spacesMock = {
  createSetup: createSetupMock,
  createStart: createStartMock
};
exports.spacesMock = spacesMock;