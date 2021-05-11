"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMockReportingCore = exports.createMockStartDeps = exports.createMockConfig = exports.createMockConfigSchema = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var Rx = _interopRequireWildcard(require("rxjs"));

var _2 = require("../");

var _mocks = require("../../../features/server/mocks");

var _browsers = require("../browsers");

var _lib = require("../lib");

var _create_mock_levellogger = require("./create_mock_levellogger");

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();

  _getRequireWildcardCache = function () {
    return cache;
  };

  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }

  if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
    return {
      default: obj
    };
  }

  var cache = _getRequireWildcardCache();

  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }

  var newObj = {};
  var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;

      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  newObj.default = obj;

  if (cache) {
    cache.set(obj, newObj);
  }

  return newObj;
}

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


jest.mock('../routes');
jest.mock('../usage');
jest.mock('../browsers');
jest.mock('../lib/create_queue');

_browsers.initializeBrowserDriverFactory.mockImplementation(() => Promise.resolve({}));

_browsers.chromium.createDriverFactory.mockImplementation(() => ({}));

const createMockPluginSetup = (mockReportingCore, setupMock) => {
  return {
    features: _mocks.featuresPluginMock.createSetup(),
    elasticsearch: setupMock.elasticsearch || {
      legacy: {
        client: {}
      }
    },
    basePath: {
      set: jest.fn()
    },
    router: setupMock.router,
    security: setupMock.security,
    licensing: {
      license$: Rx.of({
        isAvailable: true,
        isActive: true,
        type: 'basic'
      })
    }
  };
};

const logger = (0, _create_mock_levellogger.createMockLevelLogger)();

const createMockPluginStart = (mockReportingCore, startMock) => {
  const store = new _lib.ReportingStore(mockReportingCore, logger);
  return {
    browserDriverFactory: startMock.browserDriverFactory,
    esqueue: startMock.esqueue,
    savedObjects: startMock.savedObjects || {
      getScopedClient: jest.fn()
    },
    uiSettings: startMock.uiSettings || {
      asScopedToClient: () => ({
        get: jest.fn()
      })
    },
    store
  };
};

const createMockConfigSchema = (overrides = {}) => {
  // deeply merge the defaults and the provided partial schema
  return {
    index: '.reporting',
    encryptionKey: 'cool-encryption-key-where-did-you-find-it',
    ...overrides,
    kibanaServer: {
      hostname: 'localhost',
      port: 80,
      ...overrides.kibanaServer
    },
    capture: {
      browser: {
        chromium: {
          disableSandbox: true
        }
      },
      ...overrides.capture
    },
    queue: {
      timeout: 120000,
      ...overrides.queue
    },
    csv: { ...overrides.csv
    }
  };
};

exports.createMockConfigSchema = createMockConfigSchema;

const createMockConfig = reportingConfig => {
  const mockConfigGet = jest.fn().mockImplementation((...keys) => {
    return _lodash.default.get(reportingConfig, keys.join('.'));
  });
  return {
    get: mockConfigGet,
    kbnConfig: {
      get: mockConfigGet
    }
  };
};

exports.createMockConfig = createMockConfig;

const createMockStartDeps = startMock => ({
  data: startMock.data
});

exports.createMockStartDeps = createMockStartDeps;

const createMockReportingCore = async (config, setupDepsMock = undefined, startDepsMock = undefined) => {
  const mockReportingCore = {
    getConfig: () => config,
    getElasticsearchService: () => {
      var _setupDepsMock;

      return (_setupDepsMock = setupDepsMock) === null || _setupDepsMock === void 0 ? void 0 : _setupDepsMock.elasticsearch;
    }
  };

  if (!setupDepsMock) {
    setupDepsMock = createMockPluginSetup(mockReportingCore, {});
  }

  if (!startDepsMock) {
    startDepsMock = createMockPluginStart(mockReportingCore, {});
  }

  config = config || {};
  const core = new _2.ReportingCore(logger);
  core.pluginSetup(setupDepsMock);
  core.setConfig(config);
  await core.pluginSetsUp();
  core.pluginStart(startDepsMock);
  await core.pluginStartsUp();
  return core;
};

exports.createMockReportingCore = createMockReportingCore;