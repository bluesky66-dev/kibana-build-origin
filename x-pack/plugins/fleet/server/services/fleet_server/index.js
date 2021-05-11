"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFleetServerSetup = isFleetServerSetup;
exports.awaitIfFleetServerSetupPending = awaitIfFleetServerSetupPending;
exports.startFleetServerSetup = startFleetServerSetup;

var _operators = require("rxjs/operators");

var _app_context = require("../app_context");

var _license = require("../license");

var _elastic_index = require("./elastic_index");

var _saved_object_migrations = require("./saved_object_migrations");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


let _isFleetServerSetup = false;
let _isPending = false;

let _status;

let _onResolve;

function isFleetServerSetup() {
  return _isFleetServerSetup;
}

function awaitIfFleetServerSetupPending() {
  if (!_isPending) {
    return;
  }

  return _status;
}

async function startFleetServerSetup() {
  _isPending = true;
  _status = new Promise(resolve => {
    _onResolve = resolve;
  });

  const logger = _app_context.appContextService.getLogger();

  if (!_app_context.appContextService.hasSecurity()) {
    // Fleet will not work if security is not enabled
    logger === null || logger === void 0 ? void 0 : logger.warn('Fleet requires the security plugin to be enabled.');
    return;
  }

  try {
    var _licenseService$getLi, _licenseService$getLi2; // We need licence to be initialized before using the SO service.


    await ((_licenseService$getLi = _license.licenseService.getLicenseInformation$()) === null || _licenseService$getLi === void 0 ? void 0 : (_licenseService$getLi2 = _licenseService$getLi.pipe((0, _operators.first)())) === null || _licenseService$getLi2 === void 0 ? void 0 : _licenseService$getLi2.toPromise());
    await (0, _elastic_index.setupFleetServerIndexes)();
    await (0, _saved_object_migrations.runFleetServerMigration)();
    _isFleetServerSetup = true;
  } catch (err) {
    logger === null || logger === void 0 ? void 0 : logger.error('Setup for central management of agents failed.');
    logger === null || logger === void 0 ? void 0 : logger.error(err);
  }

  _isPending = false;

  if (_onResolve) {
    _onResolve();
  }
}