"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = require("lodash");

var _legacyLogging = require("@kbn/legacy-logging");

var _utils = require("../../core/server/utils");

var _config = require("./config");

var _http = _interopRequireDefault(require("./http"));

var _core = require("./core");

var _logging = require("./logging");

var _warnings = _interopRequireDefault(require("./warnings"));

var _complete = _interopRequireDefault(require("./config/complete"));

var _optimize = require("../../optimize");

var _ui = require("../ui");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
// eslint-disable-next-line @kbn/eslint/no-restricted-paths

/**
 * @typedef {import('./kbn_server').KibanaConfig} KibanaConfig
 * @typedef {import('./kbn_server').KibanaCore} KibanaCore
 * @typedef {import('./kbn_server').LegacyPlugins} LegacyPlugins
 */
const rootDir = (0, _utils.fromRoot)('.');

class KbnServer {
  /**
   * @param {Record<string, any>} settings
   * @param {KibanaConfig} config
   * @param {KibanaCore} core
   */
  constructor(settings, config, core) {
    this.name = _utils.pkg.name;
    this.version = _utils.pkg.version;
    this.build = _utils.pkg.build || false;
    this.rootDir = rootDir;
    this.settings = settings || {};
    this.config = config;
    const {
      setupDeps,
      startDeps,
      logger,
      __internals,
      env
    } = core;
    this.server = __internals.hapiServer;
    this.newPlatform = {
      env: {
        mode: env.mode,
        packageInfo: env.packageInfo
      },
      __internals,
      coreContext: {
        logger
      },
      setup: setupDeps,
      start: startDeps,
      stop: null
    };
    this.ready = (0, _lodash.constant)(this.mixin( // Sets global HTTP behaviors
    _http.default, _core.coreMixin, _logging.loggingMixin, _warnings.default, // tell the config we are done loading plugins
    _complete.default, _ui.uiMixin, // setup routes that serve the @kbn/optimizer output
    _optimize.optimizeMixin));
    this.listen = (0, _lodash.once)(this.listen);
  }
  /**
   * Extend the KbnServer outside of the constraints of a plugin. This allows access
   * to APIs that are not exposed (intentionally) to the plugins and should only
   * be used when the code will be kept up to date with Kibana.
   *
   * @param {...function} - functions that should be called to mixin functionality.
   *                         They are called with the arguments (kibana, server, config)
   *                         and can return a promise to delay execution of the next mixin
   * @return {Promise} - promise that is resolved when the final mixin completes.
   */


  async mixin(...fns) {
    for (const fn of (0, _lodash.compact)((0, _lodash.flatten)(fns))) {
      await fn.call(this, this, this.server, this.config);
    }
  }
  /**
   * Tell the server to listen for incoming requests, or get
   * a promise that will be resolved once the server is listening.
   *
   * @return undefined
   */


  async listen() {
    await this.ready();
    const {
      server,
      config
    } = this;

    if (process.env.isDevCliChild) {
      // help parent process know when we are ready
      process.send(['SERVER_LISTENING']);
    }

    server.log(['listening', 'info'], `Server running at ${server.info.uri}${config.get('server.rewriteBasePath') ? config.get('server.basePath') : ''}`);
    return server;
  }

  async close() {
    if (!this.server) {
      return;
    }

    await this.server.stop();
  }

  async inject(opts) {
    if (!this.server) {
      await this.ready();
    }

    return await this.server.inject(opts);
  }

  applyLoggingConfiguration(settings) {
    const config = _config.Config.withDefaultSchema(settings);

    const loggingConfig = config.get('logging');
    const opsConfig = config.get('ops');
    const subset = {
      ops: opsConfig,
      logging: loggingConfig
    };
    const plain = JSON.stringify(subset, null, 2);
    this.server.log(['info', 'config'], 'New logging configuration:\n' + plain);
    (0, _legacyLogging.reconfigureLogging)(this.server, loggingConfig, opsConfig.interval);
  }

}

exports.default = KbnServer;
module.exports = exports.default;