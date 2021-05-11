"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IEvent", {
  enumerable: true,
  get: function () {
    return _schemas.IEvent;
  }
});
Object.defineProperty(exports, "IValidatedEvent", {
  enumerable: true,
  get: function () {
    return _schemas.IValidatedEvent;
  }
});
Object.defineProperty(exports, "EventSchema", {
  enumerable: true,
  get: function () {
    return _schemas.EventSchema;
  }
});
Object.defineProperty(exports, "ECS_VERSION", {
  enumerable: true,
  get: function () {
    return _schemas.ECS_VERSION;
  }
});
Object.defineProperty(exports, "QueryEventsBySavedObjectResult", {
  enumerable: true,
  get: function () {
    return _cluster_client_adapter.QueryEventsBySavedObjectResult;
  }
});
exports.ConfigSchema = exports.SAVED_OBJECT_REL_PRIMARY = void 0;

var _configSchema = require("@kbn/config-schema");

var _schemas = require("../generated/schemas");

var _cluster_client_adapter = require("./es/cluster_client_adapter");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const SAVED_OBJECT_REL_PRIMARY = 'primary';
exports.SAVED_OBJECT_REL_PRIMARY = SAVED_OBJECT_REL_PRIMARY;

const ConfigSchema = _configSchema.schema.object({
  enabled: _configSchema.schema.boolean({
    defaultValue: true
  }),
  logEntries: _configSchema.schema.boolean({
    defaultValue: false
  }),
  indexEntries: _configSchema.schema.boolean({
    defaultValue: true
  })
});

exports.ConfigSchema = ConfigSchema;