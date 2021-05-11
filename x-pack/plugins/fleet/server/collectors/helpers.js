"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getInternalClients = getInternalClients;

var _server = require("../../../../../src/core/server");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


async function getInternalClients(core) {
  return core.getStartServices().then(async ([coreStart]) => {
    const savedObjectsRepo = coreStart.savedObjects.createInternalRepository();
    const esClient = coreStart.elasticsearch.client.asInternalUser;
    return [new _server.SavedObjectsClient(savedObjectsRepo), esClient];
  });
}