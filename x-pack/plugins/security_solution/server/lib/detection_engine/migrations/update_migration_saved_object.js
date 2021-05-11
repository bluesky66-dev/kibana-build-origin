"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMigrationSavedObject = void 0;

var _TaskEither = require("fp-ts/lib/TaskEither");

var _pipeable = require("fp-ts/lib/pipeable");

var _validate = require("../../../../common/validate");

var _fp_utils = require("../../../../common/fp_utils");

var _saved_objects_client = require("./saved_objects_client");

var _saved_objects_schema = require("./saved_objects_schema");

var _helpers = require("./helpers");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const updateMigrationSavedObject = async ({
  attributes,
  id,
  username,
  soClient
}) => {
  const client = (0, _saved_objects_client.signalsMigrationSOClient)(soClient);
  return (0, _pipeable.pipe)(attributes, attrs => (0, _validate.validateTaskEither)(_saved_objects_schema.signalsMigrationSOUpdateAttributes, attrs), (0, _TaskEither.chain)(validAttrs => (0, _TaskEither.tryCatch)(() => client.update(id, { ...validAttrs,
    updated: (0, _helpers.getIsoDateString)(),
    updatedBy: username
  }), _fp_utils.toError)), _fp_utils.toPromise);
};

exports.updateMigrationSavedObject = updateMigrationSavedObject;