"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "IEventLogService", {
  enumerable: true,
  get: function () {
    return _types.IEventLogService;
  }
});
Object.defineProperty(exports, "IEventLogger", {
  enumerable: true,
  get: function () {
    return _types.IEventLogger;
  }
});
Object.defineProperty(exports, "IEventLogClientService", {
  enumerable: true,
  get: function () {
    return _types.IEventLogClientService;
  }
});
Object.defineProperty(exports, "IEvent", {
  enumerable: true,
  get: function () {
    return _types.IEvent;
  }
});
Object.defineProperty(exports, "IValidatedEvent", {
  enumerable: true,
  get: function () {
    return _types.IValidatedEvent;
  }
});
Object.defineProperty(exports, "IEventLogClient", {
  enumerable: true,
  get: function () {
    return _types.IEventLogClient;
  }
});
Object.defineProperty(exports, "QueryEventsBySavedObjectResult", {
  enumerable: true,
  get: function () {
    return _types.QueryEventsBySavedObjectResult;
  }
});
Object.defineProperty(exports, "SAVED_OBJECT_REL_PRIMARY", {
  enumerable: true,
  get: function () {
    return _types.SAVED_OBJECT_REL_PRIMARY;
  }
});
exports.plugin = exports.config = void 0;

var _types = require("./types");

var _plugin = require("./plugin");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _types.ConfigSchema
};
exports.config = config;

const plugin = context => new _plugin.Plugin(context);

exports.plugin = plugin;