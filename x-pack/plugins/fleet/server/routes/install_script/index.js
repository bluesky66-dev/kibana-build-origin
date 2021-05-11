"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerRoutes = void 0;

var _url = _interopRequireDefault(require("url"));

var _constants = require("../../constants");

var _install_script = require("../../services/install_script");

var _types = require("../../types");

var _services = require("../../services");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function getInternalUserSOClient(request) {
  // soClient as kibana internal users, be carefull on how you use it, security is not enabled
  return _services.appContextService.getSavedObjects().getScopedClient(request, {
    excludedWrappers: ['security']
  });
}

const registerRoutes = ({
  router
}) => {
  router.get({
    path: _constants.INSTALL_SCRIPT_API_ROUTES,
    validate: _types.InstallScriptRequestSchema,
    options: {
      tags: [],
      authRequired: false
    }
  }, async function getInstallScriptHandler(context, request, response) {
    const soClient = getInternalUserSOClient(request);

    const http = _services.appContextService.getHttpSetup();

    const serverInfo = http.getServerInfo();
    const basePath = http.basePath;
    const kibanaUrls = (await _services.settingsService.getSettings(soClient)).kibana_urls || [_url.default.format({
      protocol: serverInfo.protocol,
      hostname: serverInfo.hostname,
      port: serverInfo.port,
      pathname: basePath.serverBasePath
    })];
    const script = (0, _install_script.getScript)(request.params.osType, kibanaUrls[0]);
    return response.ok({
      body: script
    });
  });
};

exports.registerRoutes = registerRoutes;