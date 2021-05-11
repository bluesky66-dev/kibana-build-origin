"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findMigrationSavedObjects = void 0;

var _Either = require("fp-ts/lib/Either");

var _pipeable = require("fp-ts/lib/pipeable");

var _saved_objects_client = require("./saved_objects_client");

var _saved_objects_schema = require("./saved_objects_schema");

var _validate = require("../../../../common/validate");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const findMigrationSavedObjects = async ({
  options,
  soClient
}) => {
  const client = (0, _saved_objects_client.signalsMigrationSOClient)(soClient);
  return (0, _pipeable.pipe)(await client.find(options), so => (0, _validate.validateEither)(_saved_objects_schema.signalsMigrationSOs, so.saved_objects), (0, _Either.fold)(e => Promise.reject(e), a => Promise.resolve(a)));
};

exports.findMigrationSavedObjects = findMigrationSavedObjects;