"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getScript = getScript;

var _app_context = require("../app_context");

var _macos = require("./install_templates/macos");

var _linux = require("./install_templates/linux");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getScript(osType, kibanaUrl) {
  const variables = {
    kibanaUrl,
    kibanaVersion: _app_context.appContextService.getKibanaVersion()
  };

  switch (osType) {
    case 'macos':
      return (0, _macos.macosInstallTemplate)(variables);

    case 'linux':
      return (0, _linux.linuxInstallTemplate)(variables);

    default:
      throw new Error(`${osType} is not supported.`);
  }
}