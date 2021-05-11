"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "LegacyAuditLogger", {
  enumerable: true,
  get: function () {
    return _audit.LegacyAuditLogger;
  }
});
Object.defineProperty(exports, "AuditLogger", {
  enumerable: true,
  get: function () {
    return _audit.AuditLogger;
  }
});
Object.defineProperty(exports, "AuditEvent", {
  enumerable: true,
  get: function () {
    return _audit.AuditEvent;
  }
});
Object.defineProperty(exports, "EventCategory", {
  enumerable: true,
  get: function () {
    return _audit.EventCategory;
  }
});
Object.defineProperty(exports, "EventType", {
  enumerable: true,
  get: function () {
    return _audit.EventType;
  }
});
Object.defineProperty(exports, "EventOutcome", {
  enumerable: true,
  get: function () {
    return _audit.EventOutcome;
  }
});
exports.plugin = exports.config = void 0;

var _config = require("./config");

var _config_deprecations = require("./config_deprecations");

var _plugin = require("./plugin");

var _audit = require("./audit");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const config = {
  schema: _config.ConfigSchema,
  deprecations: _config_deprecations.securityConfigDeprecationProvider,
  exposeToBrowser: {
    loginAssistanceMessage: true
  }
};
exports.config = config;

const plugin = initializerContext => new _plugin.SecurityPlugin(initializerContext);

exports.plugin = plugin;