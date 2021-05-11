"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ruleStatusSavedObjectsClientFactory = void 0;

var _saved_object_mappings = require("../rules/saved_object_mappings");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const ruleStatusSavedObjectsClientFactory = savedObjectsClient => ({
  find: options => savedObjectsClient.find({ ...options,
    type: _saved_object_mappings.ruleStatusSavedObjectType
  }),
  create: attributes => savedObjectsClient.create(_saved_object_mappings.ruleStatusSavedObjectType, attributes),
  update: (id, attributes) => savedObjectsClient.update(_saved_object_mappings.ruleStatusSavedObjectType, id, attributes),
  delete: id => savedObjectsClient.delete(_saved_object_mappings.ruleStatusSavedObjectType, id)
});

exports.ruleStatusSavedObjectsClientFactory = ruleStatusSavedObjectsClientFactory;