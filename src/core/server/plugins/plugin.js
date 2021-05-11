"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginWrapper = void 0;

var _path = require("path");

var _typeDetect = _interopRequireDefault(require("type-detect"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _configSchema = require("@kbn/config-schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Lightweight wrapper around discovered plugin that is responsible for instantiating
 * plugin and dispatching proper context and dependencies into plugin's lifecycle hooks.
 *
 * @internal
 */
class PluginWrapper {
  constructor(params) {
    this.params = params;

    _defineProperty(this, "path", void 0);

    _defineProperty(this, "manifest", void 0);

    _defineProperty(this, "opaqueId", void 0);

    _defineProperty(this, "name", void 0);

    _defineProperty(this, "configPath", void 0);

    _defineProperty(this, "requiredPlugins", void 0);

    _defineProperty(this, "optionalPlugins", void 0);

    _defineProperty(this, "requiredBundles", void 0);

    _defineProperty(this, "includesServerPlugin", void 0);

    _defineProperty(this, "includesUiPlugin", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "initializerContext", void 0);

    _defineProperty(this, "instance", void 0);

    _defineProperty(this, "startDependencies$", new _rxjs.Subject());

    _defineProperty(this, "startDependencies", this.startDependencies$.pipe((0, _operators.first)()).toPromise());

    this.path = params.path;
    this.manifest = params.manifest;
    this.opaqueId = params.opaqueId;
    this.initializerContext = params.initializerContext;
    this.log = params.initializerContext.logger.get();
    this.name = params.manifest.id;
    this.configPath = params.manifest.configPath;
    this.requiredPlugins = params.manifest.requiredPlugins;
    this.optionalPlugins = params.manifest.optionalPlugins;
    this.requiredBundles = params.manifest.requiredBundles;
    this.includesServerPlugin = params.manifest.server;
    this.includesUiPlugin = params.manifest.ui;
  }
  /**
   * Instantiates plugin and calls `setup` function exposed by the plugin initializer.
   * @param setupContext Context that consists of various core services tailored specifically
   * for the `setup` lifecycle event.
   * @param plugins The dictionary where the key is the dependency name and the value
   * is the contract returned by the dependency's `setup` function.
   */


  setup(setupContext, plugins) {
    this.instance = this.createPluginInstance();
    return this.instance.setup(setupContext, plugins);
  }
  /**
   * Calls `start` function exposed by the initialized plugin.
   * @param startContext Context that consists of various core services tailored specifically
   * for the `start` lifecycle event.
   * @param plugins The dictionary where the key is the dependency name and the value
   * is the contract returned by the dependency's `start` function.
   */


  start(startContext, plugins) {
    if (this.instance === undefined) {
      throw new Error(`Plugin "${this.name}" can't be started since it isn't set up.`);
    }

    const startContract = this.instance.start(startContext, plugins);

    if ((0, _std.isPromise)(startContract)) {
      return startContract.then(resolvedContract => {
        this.startDependencies$.next([startContext, plugins, resolvedContract]);
        return resolvedContract;
      });
    } else {
      this.startDependencies$.next([startContext, plugins, startContract]);
      return startContract;
    }
  }
  /**
   * Calls optional `stop` function exposed by the plugin initializer.
   */


  async stop() {
    if (this.instance === undefined) {
      throw new Error(`Plugin "${this.name}" can't be stopped since it isn't set up.`);
    }

    if (typeof this.instance.stop === 'function') {
      await this.instance.stop();
    }

    this.instance = undefined;
  }

  getConfigDescriptor() {
    if (!this.manifest.server) {
      return null;
    }

    const pluginPathServer = (0, _path.join)(this.path, 'server'); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const pluginDefinition = require(pluginPathServer);

    if (!('config' in pluginDefinition)) {
      this.log.debug(`"${pluginPathServer}" does not export "config".`);
      return null;
    }

    const configDescriptor = pluginDefinition.config;

    if (!(0, _configSchema.isConfigSchema)(configDescriptor.schema)) {
      throw new Error('Configuration schema expected to be an instance of Type');
    }

    return configDescriptor;
  }

  createPluginInstance() {
    this.log.debug('Initializing plugin'); // eslint-disable-next-line @typescript-eslint/no-var-requires

    const pluginDefinition = require((0, _path.join)(this.path, 'server'));

    if (!('plugin' in pluginDefinition)) {
      throw new Error(`Plugin "${this.name}" does not export "plugin" definition (${this.path}).`);
    }

    const {
      plugin: initializer
    } = pluginDefinition;

    if (!initializer || typeof initializer !== 'function') {
      throw new Error(`Definition of plugin "${this.name}" should be a function (${this.path}).`);
    }

    const instance = initializer(this.initializerContext);

    if (!instance || typeof instance !== 'object') {
      throw new Error(`Initializer for plugin "${this.manifest.id}" is expected to return plugin instance, but returned "${(0, _typeDetect.default)(instance)}".`);
    }

    if (typeof instance.setup !== 'function') {
      throw new Error(`Instance of plugin "${this.name}" does not define "setup" function.`);
    }

    return instance;
  }

}

exports.PluginWrapper = PluginWrapper;