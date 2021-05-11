"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spacesSavedObjectsClientWrapperFactory = spacesSavedObjectsClientWrapperFactory;

var _spaces_saved_objects_client = require("./spaces_saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function spacesSavedObjectsClientWrapperFactory(getSpacesService) {
  return options => new _spaces_saved_objects_client.SpacesSavedObjectsClient({
    baseClient: options.client,
    request: options.request,
    getSpacesService,
    typeRegistry: options.typeRegistry
  });
}