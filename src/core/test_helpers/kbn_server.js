"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRootWithSettings = createRootWithSettings;
exports.getSupertest = getSupertest;
exports.createRoot = createRoot;
exports.createRootWithCorePlugins = createRootWithCorePlugins;
exports.getKbnServer = getKbnServer;
exports.createTestServers = createTestServers;
exports.request = void 0;

var _devUtils = require("@kbn/dev-utils");

var _test = require("@kbn/test");

var _lodash = require("lodash");

var _path = require("path");

var _rxjs = require("rxjs");

var _supertest = _interopRequireDefault(require("supertest"));

var _config = require("../server/config");

var _root = require("../server/root");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const DEFAULTS_SETTINGS = {
  server: {
    autoListen: true,
    // Use the ephemeral port to make sure that tests use the first available
    // port and aren't affected by the timing issues in test environment.
    port: 0,
    xsrf: {
      disableProtection: true
    }
  },
  logging: {
    silent: true
  },
  plugins: {},
  migrations: {
    skip: false
  }
};
const DEFAULT_SETTINGS_WITH_CORE_PLUGINS = {
  plugins: {
    scanDirs: [(0, _path.resolve)(__dirname, '../../legacy/core_plugins')]
  },
  elasticsearch: {
    hosts: [_test.esTestConfig.getUrl()],
    username: _test.kibanaServerTestUser.username,
    password: _test.kibanaServerTestUser.password
  }
};

function createRootWithSettings(settings, cliArgs = {}) {
  const env = _config.Env.createDefault(_devUtils.REPO_ROOT, {
    configs: [],
    cliArgs: {
      dev: false,
      quiet: false,
      silent: false,
      watch: false,
      basePath: false,
      runExamples: false,
      oss: true,
      disableOptimizer: true,
      cache: true,
      dist: false,
      ...cliArgs
    },
    isDevCliParent: false
  });

  return new _root.Root({
    getConfig$: () => new _rxjs.BehaviorSubject((0, _lodash.defaultsDeep)({}, settings, DEFAULTS_SETTINGS))
  }, env);
}
/**
 * Returns supertest request attached to the core's internal native Node server.
 * @param root
 * @param method
 * @param path
 */


function getSupertest(root, method, path) {
  const testUserCredentials = Buffer.from(`${_test.kibanaTestUser.username}:${_test.kibanaTestUser.password}`);
  return (0, _supertest.default)(root.server.http.httpServer.server.listener)[method](path).set('Authorization', `Basic ${testUserCredentials.toString('base64')}`);
}
/**
 * Creates an instance of Root with default configuration
 * tailored for unit tests.
 *
 * @param {Object} [settings={}] Any config overrides for this instance.
 * @returns {Root}
 */


function createRoot(settings = {}, cliArgs = {}) {
  return createRootWithSettings(settings, cliArgs);
}
/**
 *  Creates an instance of Root, including all of the core plugins,
 *  with default configuration tailored for unit tests.
 *
 *  @param {Object} [settings={}] Any config overrides for this instance.
 *  @returns {Root}
 */


function createRootWithCorePlugins(settings = {}, cliArgs = {}) {
  return createRootWithSettings((0, _lodash.defaultsDeep)({}, settings, DEFAULT_SETTINGS_WITH_CORE_PLUGINS), cliArgs);
}
/**
 * Returns `kbnServer` instance used in the "legacy" Kibana.
 * @param root
 */


function getKbnServer(root) {
  return root.server.legacy.kbnServer;
}

const request = {
  delete: (root, path) => getSupertest(root, 'delete', path),
  get: (root, path) => getSupertest(root, 'get', path),
  head: (root, path) => getSupertest(root, 'head', path),
  post: (root, path) => getSupertest(root, 'post', path),
  put: (root, path) => getSupertest(root, 'put', path)
};
exports.request = request;

/**
 * Creates an instance of the Root, including all of the core "legacy" plugins,
 * with default configuration tailored for unit tests, and starts es.
 *
 * @param options
 * @prop settings Any config overrides for this instance.
 * @prop adjustTimeout A function(t) => this.timeout(t) that adjust the timeout of a
 * test, ensuring the test properly waits for the server to boot without timing out.
 */
function createTestServers({
  adjustTimeout,
  settings = {}
}) {
  if (!adjustTimeout) {
    throw new Error('adjustTimeout is required in order to avoid flaky tests');
  }

  const license = (0, _lodash.get)(settings, 'es.license', 'basic');
  const usersToBeAdded = (0, _lodash.get)(settings, 'users', []);

  if (usersToBeAdded.length > 0) {
    if (license !== 'trial') {
      throw new Error('Adding users is only supported by createTestServers when using a trial license');
    }
  }

  const log = new _devUtils.ToolingLog({
    level: 'debug',
    writeTo: process.stdout
  });
  log.indent(6);
  log.info('starting elasticsearch');
  log.indent(4);
  const es = (0, _test.createLegacyEsTestCluster)((0, _lodash.defaultsDeep)({}, (0, _lodash.get)(settings, 'es', {}), {
    log,
    license,
    password: license === 'trial' ? _test.DEFAULT_SUPERUSER_PASS : undefined
  }));
  log.indent(-4); // Add time for KBN and adding users

  adjustTimeout(es.getStartTimeout() + 100000);
  const kbnSettings = (0, _lodash.get)(settings, 'kbn', {});
  return {
    startES: async () => {
      await es.start((0, _lodash.get)(settings, 'es.esArgs', []));

      if (['gold', 'trial'].includes(license)) {
        await (0, _test.setupUsers)({
          log,
          esPort: _test.esTestConfig.getUrlParts().port,
          updates: [...usersToBeAdded, // user elastic
          _test.esTestConfig.getUrlParts(), // user kibana
          _test.kbnTestConfig.getUrlParts()]
        }); // Override provided configs, we know what the elastic user is now

        kbnSettings.elasticsearch = {
          hosts: [_test.esTestConfig.getUrl()],
          username: _test.kibanaServerTestUser.username,
          password: _test.kibanaServerTestUser.password
        };
      }

      return {
        stop: async () => await es.cleanup(),
        es,
        hosts: [_test.esTestConfig.getUrl()],
        username: _test.kibanaServerTestUser.username,
        password: _test.kibanaServerTestUser.password
      };
    },
    startKibana: async () => {
      const root = createRootWithCorePlugins(kbnSettings);
      await root.setup();
      const coreStart = await root.start();
      const kbnServer = getKbnServer(root);
      return {
        root,
        kbnServer,
        coreStart,
        stop: async () => await root.shutdown()
      };
    }
  };
}