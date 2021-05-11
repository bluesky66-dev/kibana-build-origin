"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FleetSetupHandler = exports.createFleetSetupHandler = exports.getFleetStatusHandler = void 0;

var _services = require("../../services");

var _setup = require("../../services/setup");

var _errors = require("../../errors");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const getFleetStatusHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;

  try {
    var _appContextService$ge, _appContextService$ge2, _appContextService$ge3, _appContextService$ge4, _appContextService$ge5, _appContextService$ge6;

    const isAdminUserSetup = (await _services.outputService.getAdminUser(soClient)) !== null;
    const isApiKeysEnabled = await _services.appContextService.getSecurity().authc.apiKeys.areAPIKeysEnabled();
    const isTLSEnabled = _services.appContextService.getHttpSetup().getServerInfo().protocol === 'https';

    const isProductionMode = _services.appContextService.getIsProductionMode();

    const isCloud = (_appContextService$ge = (_appContextService$ge2 = _services.appContextService.getCloud()) === null || _appContextService$ge2 === void 0 ? void 0 : _appContextService$ge2.isCloudEnabled) !== null && _appContextService$ge !== void 0 ? _appContextService$ge : false;
    const isTLSCheckDisabled = (_appContextService$ge3 = (_appContextService$ge4 = _services.appContextService.getConfig()) === null || _appContextService$ge4 === void 0 ? void 0 : (_appContextService$ge5 = _appContextService$ge4.agents) === null || _appContextService$ge5 === void 0 ? void 0 : _appContextService$ge5.tlsCheckDisabled) !== null && _appContextService$ge3 !== void 0 ? _appContextService$ge3 : false;
    const canEncrypt = ((_appContextService$ge6 = _services.appContextService.getEncryptedSavedObjectsSetup()) === null || _appContextService$ge6 === void 0 ? void 0 : _appContextService$ge6.canEncrypt) === true;
    const missingRequirements = [];

    if (!isAdminUserSetup) {
      missingRequirements.push('fleet_admin_user');
    }

    if (!isApiKeysEnabled) {
      missingRequirements.push('api_keys');
    }

    if (!isTLSCheckDisabled && !isCloud && isProductionMode && !isTLSEnabled) {
      missingRequirements.push('tls_required');
    }

    if (!canEncrypt) {
      missingRequirements.push('encrypted_saved_object_encryption_key_required');
    }

    const body = {
      isReady: missingRequirements.length === 0,
      missing_requirements: missingRequirements
    };
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.getFleetStatusHandler = getFleetStatusHandler;

const createFleetSetupHandler = async (context, request, response) => {
  try {
    var _request$body$forceRe, _request$body;

    const soClient = context.core.savedObjects.client;
    const esClient = context.core.elasticsearch.client.asCurrentUser;
    const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;
    await (0, _setup.setupIngestManager)(soClient, esClient, callCluster);
    await (0, _setup.setupFleet)(soClient, esClient, callCluster, {
      forceRecreate: (_request$body$forceRe = (_request$body = request.body) === null || _request$body === void 0 ? void 0 : _request$body.forceRecreate) !== null && _request$body$forceRe !== void 0 ? _request$body$forceRe : false
    });
    return response.ok({
      body: {
        isInitialized: true
      }
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.createFleetSetupHandler = createFleetSetupHandler;

const FleetSetupHandler = async (context, request, response) => {
  const soClient = context.core.savedObjects.client;
  const esClient = context.core.elasticsearch.client.asCurrentUser;
  const callCluster = context.core.elasticsearch.legacy.client.callAsCurrentUser;

  try {
    const body = {
      isInitialized: true
    };
    await (0, _setup.setupIngestManager)(soClient, esClient, callCluster);
    return response.ok({
      body
    });
  } catch (error) {
    return (0, _errors.defaultIngestErrorHandler)({
      error,
      response
    });
  }
};

exports.FleetSetupHandler = FleetSetupHandler;