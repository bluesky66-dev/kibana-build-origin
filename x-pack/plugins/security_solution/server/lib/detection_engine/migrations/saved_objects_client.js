"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signalsMigrationSOClient = void 0;

var _saved_objects = require("./saved_objects");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const signalsMigrationSOClient = savedObjectsClient => ({
  bulkGet: (objects, options) => savedObjectsClient.bulkGet(objects.map(o => ({ ...o,
    type: _saved_objects.signalsMigrationType
  })), options),
  find: options => savedObjectsClient.find({ ...options,
    type: _saved_objects.signalsMigrationType
  }),
  create: attributes => savedObjectsClient.create(_saved_objects.signalsMigrationType, attributes),
  update: (id, attributes) => savedObjectsClient.update(_saved_objects.signalsMigrationType, id, attributes),
  delete: id => savedObjectsClient.delete(_saved_objects.signalsMigrationType, id)
});

exports.signalsMigrationSOClient = signalsMigrationSOClient;