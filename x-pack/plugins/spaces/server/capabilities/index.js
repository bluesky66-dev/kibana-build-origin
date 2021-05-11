"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setupCapabilities = void 0;

var _capabilities_provider = require("./capabilities_provider");

var _capabilities_switcher = require("./capabilities_switcher");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const setupCapabilities = (core, getSpacesService, logger) => {
  core.capabilities.registerProvider(_capabilities_provider.capabilitiesProvider);
  core.capabilities.registerSwitcher((0, _capabilities_switcher.setupCapabilitiesSwitcher)(core, getSpacesService, logger));
};

exports.setupCapabilities = setupCapabilities;