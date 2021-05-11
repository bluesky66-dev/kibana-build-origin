"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHttpServer = exports.createCoreContext = void 0;

var _rxjs = require("rxjs");

var _devUtils = require("@kbn/dev-utils");

var _configSchema = require("@kbn/config-schema");

var _config = require("../config");

var _http_service = require("./http_service");

var _mocks = require("../config/mocks");

var _logging_system = require("../logging/logging_system.mock");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const coreId = Symbol('core');

const env = _config.Env.createDefault(_devUtils.REPO_ROOT, (0, _mocks.getEnvOptions)());

const logger = _logging_system.loggingSystemMock.create();

const configService = _mocks.configServiceMock.create();

configService.atPath.mockImplementation(path => {
  if (path === 'server') {
    return new _rxjs.BehaviorSubject({
      hosts: ['localhost'],
      maxPayload: new _configSchema.ByteSizeValue(1024),
      autoListen: true,
      ssl: {
        enabled: false
      },
      cors: {
        enabled: false
      },
      compression: {
        enabled: true
      },
      xsrf: {
        disableProtection: true,
        allowlist: []
      },
      customResponseHeaders: {},
      requestId: {
        allowFromAnyIp: true,
        ipAllowlist: []
      },
      keepaliveTimeout: 120_000,
      socketTimeout: 120_000
    });
  }

  if (path === 'externalUrl') {
    return new _rxjs.BehaviorSubject({
      policy: []
    });
  }

  if (path === 'csp') {
    return new _rxjs.BehaviorSubject({});
  }

  throw new Error(`Unexpected config path: ${path}`);
});
const defaultContext = {
  coreId,
  env,
  logger,
  configService
};

const createCoreContext = (overrides = {}) => ({ ...defaultContext,
  ...overrides
});
/**
 * Creates a concrete HttpServer with a mocked context.
 */


exports.createCoreContext = createCoreContext;

const createHttpServer = (overrides = {}) => {
  return new _http_service.HttpService(createCoreContext(overrides));
};

exports.createHttpServer = createHttpServer;