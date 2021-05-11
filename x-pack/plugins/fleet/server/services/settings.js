"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSettings = getSettings;
exports.saveSettings = saveSettings;
exports.createDefaultSettings = createDefaultSettings;

var _boom = _interopRequireDefault(require("@hapi/boom"));

var _url = _interopRequireDefault(require("url"));

var _common = require("../../common");

var _app_context = require("./app_context");

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


async function getSettings(soClient) {
  const res = await soClient.find({
    type: _common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE
  });

  if (res.total === 0) {
    throw _boom.default.notFound('Global settings not found');
  }

  const settingsSo = res.saved_objects[0];
  return {
    id: settingsSo.id,
    ...settingsSo.attributes
  };
}

async function saveSettings(soClient, newData) {
  try {
    const settings = await getSettings(soClient);
    const res = await soClient.update(_common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, settings.id, newData);
    return {
      id: settings.id,
      ...res.attributes
    };
  } catch (e) {
    if (e.isBoom && e.output.statusCode === 404) {
      const defaultSettings = createDefaultSettings();
      const res = await soClient.create(_common.GLOBAL_SETTINGS_SAVED_OBJECT_TYPE, { ...defaultSettings,
        ...newData
      });
      return {
        id: res.id,
        ...res.attributes
      };
    }

    throw e;
  }
}

function createDefaultSettings() {
  var _decodeCloudId, _appContextService$ge, _appContextService$ge2, _appContextService$ge3;

  const http = _app_context.appContextService.getHttpSetup();

  const serverInfo = http.getServerInfo();
  const basePath = http.basePath;

  const cloud = _app_context.appContextService.getCloud();

  const cloudId = (cloud === null || cloud === void 0 ? void 0 : cloud.isCloudEnabled) && cloud.cloudId;
  const cloudUrl = cloudId && ((_decodeCloudId = (0, _common.decodeCloudId)(cloudId)) === null || _decodeCloudId === void 0 ? void 0 : _decodeCloudId.kibanaUrl);
  const flagsUrl = (_appContextService$ge = _app_context.appContextService.getConfig()) === null || _appContextService$ge === void 0 ? void 0 : (_appContextService$ge2 = _appContextService$ge.agents) === null || _appContextService$ge2 === void 0 ? void 0 : (_appContextService$ge3 = _appContextService$ge2.kibana) === null || _appContextService$ge3 === void 0 ? void 0 : _appContextService$ge3.host;

  const defaultUrl = _url.default.format({
    protocol: serverInfo.protocol,
    hostname: serverInfo.hostname,
    port: serverInfo.port,
    pathname: basePath.serverBasePath
  });

  return {
    agent_auto_upgrade: true,
    package_auto_upgrade: true,
    kibana_urls: [cloudUrl || flagsUrl || defaultUrl].flat()
  };
}