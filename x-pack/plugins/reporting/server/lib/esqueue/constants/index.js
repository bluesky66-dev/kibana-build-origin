"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constants = void 0;

var _statuses = require("../../statuses");

var _default_settings = require("./default_settings");

var _events = require("./events");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const constants = { ..._events.events,
  ..._statuses.statuses,
  ..._default_settings.defaultSettings
};
exports.constants = constants;