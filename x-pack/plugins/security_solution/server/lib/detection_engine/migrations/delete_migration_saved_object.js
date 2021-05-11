"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteMigrationSavedObject = void 0;

var _saved_objects_client = require("./saved_objects_client");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const deleteMigrationSavedObject = async ({
  id,
  soClient
}) => (0, _saved_objects_client.signalsMigrationSOClient)(soClient).delete(id);

exports.deleteMigrationSavedObject = deleteMigrationSavedObject;