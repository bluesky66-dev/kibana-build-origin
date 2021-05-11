"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildConfig = void 0;

var _lodash = require("lodash");

var _operators = require("rxjs/operators");

var _create_config = require("./create_config");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const buildConfig = async (initContext, core, logger) => {
  const config$ = initContext.config.create();
  const {
    http
  } = core;
  const serverInfo = http.getServerInfo();
  const kbnConfig = {
    path: {
      data: initContext.config.legacy.globalConfig$.pipe((0, _operators.map)(c => c.path.data))
    },
    server: {
      basePath: core.http.basePath.serverBasePath,
      host: serverInfo.hostname,
      name: serverInfo.name,
      port: serverInfo.port,
      uuid: initContext.env.instanceUuid,
      protocol: serverInfo.protocol
    }
  };
  const reportingConfig$ = (0, _create_config.createConfig$)(core, config$, logger);
  const reportingConfig = await reportingConfig$.pipe((0, _operators.first)()).toPromise();
  return {
    get: (...keys) => (0, _lodash.get)(reportingConfig, keys.join('.'), null),
    // spreading arguments as an array allows the return type to be known by the compiler
    kbnConfig: {
      get: (...keys) => (0, _lodash.get)(kbnConfig, keys.join('.'), null)
    }
  };
};

exports.buildConfig = buildConfig;