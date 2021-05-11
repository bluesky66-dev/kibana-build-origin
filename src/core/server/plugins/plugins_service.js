"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PluginsService = void 0;

var _path = _interopRequireDefault(require("path"));

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _std = require("@kbn/std");

var _discovery = require("./discovery");

var _plugins_config = require("./plugins_config");

var _plugins_system = require("./plugins_system");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** @internal */
class PluginsService {
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "pluginsSystem", void 0);

    _defineProperty(this, "configService", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "pluginConfigDescriptors", new Map());

    _defineProperty(this, "uiPluginInternalInfo", new Map());

    _defineProperty(this, "discoveryDisabled", void 0);

    this.log = coreContext.logger.get('plugins-service');
    this.discoveryDisabled = coreContext.env.isDevCliParent;
    this.pluginsSystem = new _plugins_system.PluginsSystem(coreContext);
    this.configService = coreContext.configService;
    this.config$ = coreContext.configService.atPath('plugins').pipe((0, _operators.map)(rawConfig => new _plugins_config.PluginsConfig(rawConfig, coreContext.env)));
  }

  async discover({
    environment
  }) {
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    const {
      error$,
      plugin$
    } = this.discoveryDisabled ? {
      error$: _rxjs.EMPTY,
      plugin$: _rxjs.EMPTY
    } : (0, _discovery.discover)(config, this.coreContext, {
      uuid: environment.instanceUuid
    });
    await this.handleDiscoveryErrors(error$);
    await this.handleDiscoveredPlugins(plugin$);
    const uiPlugins = this.pluginsSystem.uiPlugins();
    return {
      // Return dependency tree
      pluginTree: this.pluginsSystem.getPluginDependencies(),
      pluginPaths: this.pluginsSystem.getPlugins().map(plugin => plugin.path),
      uiPlugins: {
        internal: this.uiPluginInternalInfo,
        public: uiPlugins,
        browserConfigs: this.generateUiPluginsConfigs(uiPlugins)
      }
    };
  }

  async setup(deps) {
    this.log.debug('Setting up plugins service');
    const config = await this.config$.pipe((0, _operators.first)()).toPromise();
    let contracts = new Map();
    const initialize = config.initialize && !this.coreContext.env.isDevCliParent;

    if (initialize) {
      contracts = await this.pluginsSystem.setupPlugins(deps);
      this.registerPluginStaticDirs(deps);
    } else {
      this.log.info('Plugin initialization disabled.');
    }

    return {
      initialized: initialize,
      contracts
    };
  }

  async start(deps) {
    this.log.debug('Plugins service starts plugins');
    const contracts = await this.pluginsSystem.startPlugins(deps);
    return {
      contracts
    };
  }

  async stop() {
    this.log.debug('Stopping plugins service');
    await this.pluginsSystem.stopPlugins();
  }

  generateUiPluginsConfigs(uiPlugins) {
    return new Map([...uiPlugins].filter(([pluginId, _]) => {
      const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
      return configDescriptor && configDescriptor.exposeToBrowser && Object.values(configDescriptor === null || configDescriptor === void 0 ? void 0 : configDescriptor.exposeToBrowser).some(exposed => exposed);
    }).map(([pluginId, plugin]) => {
      const configDescriptor = this.pluginConfigDescriptors.get(pluginId);
      return [pluginId, this.configService.atPath(plugin.configPath).pipe((0, _operators.map)(config => (0, _std.pick)(config || {}, Object.entries(configDescriptor.exposeToBrowser).filter(([_, exposed]) => exposed).map(([key, _]) => key))))];
    }));
  }

  async handleDiscoveryErrors(error$) {
    // At this stage we report only errors that can occur when new platform plugin
    // manifest is present, otherwise we can't be sure that the plugin is for the new
    // platform and let legacy platform to handle it.
    const errorTypesToReport = [_discovery.PluginDiscoveryErrorType.IncompatibleVersion, _discovery.PluginDiscoveryErrorType.InvalidManifest];
    const errors = await error$.pipe((0, _operators.filter)(error => errorTypesToReport.includes(error.type)), (0, _operators.tap)(pluginError => this.log.error(pluginError)), (0, _operators.toArray)()).toPromise();

    if (errors.length > 0) {
      throw new Error(`Failed to initialize plugins:${errors.map(err => `\n\t${err.message}`).join('')}`);
    }
  }

  async handleDiscoveredPlugins(plugin$) {
    const pluginEnableStatuses = new Map();
    await plugin$.pipe((0, _operators.mergeMap)(async plugin => {
      const configDescriptor = plugin.getConfigDescriptor();

      if (configDescriptor) {
        this.pluginConfigDescriptors.set(plugin.name, configDescriptor);

        if (configDescriptor.deprecations) {
          this.coreContext.configService.addDeprecationProvider(plugin.configPath, configDescriptor.deprecations);
        }

        this.coreContext.configService.setSchema(plugin.configPath, configDescriptor.schema);
      }

      const isEnabled = await this.coreContext.configService.isEnabledAtPath(plugin.configPath);

      if (pluginEnableStatuses.has(plugin.name)) {
        throw new Error(`Plugin with id "${plugin.name}" is already registered!`);
      }

      if (plugin.includesUiPlugin) {
        this.uiPluginInternalInfo.set(plugin.name, {
          requiredBundles: plugin.requiredBundles,
          publicTargetDir: _path.default.resolve(plugin.path, 'target/public'),
          publicAssetsDir: _path.default.resolve(plugin.path, 'public/assets')
        });
      }

      pluginEnableStatuses.set(plugin.name, {
        plugin,
        isEnabled
      });
    })).toPromise();

    for (const [pluginName, {
      plugin,
      isEnabled
    }] of pluginEnableStatuses) {
      // validate that `requiredBundles` ids point to a discovered plugin which `includesUiPlugin`
      for (const requiredBundleId of plugin.requiredBundles) {
        if (!pluginEnableStatuses.has(requiredBundleId)) {
          throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${pluginName}" but it is missing.`);
        }

        if (!pluginEnableStatuses.get(requiredBundleId).plugin.includesUiPlugin) {
          throw new Error(`Plugin bundle with id "${requiredBundleId}" is required by plugin "${pluginName}" but it doesn't have a UI bundle.`);
        }
      }

      const pluginEnablement = this.shouldEnablePlugin(pluginName, pluginEnableStatuses);

      if (pluginEnablement.enabled) {
        this.pluginsSystem.addPlugin(plugin);
      } else if (isEnabled) {
        this.log.info(`Plugin "${pluginName}" has been disabled since the following direct or transitive dependencies are missing or disabled: [${pluginEnablement.missingDependencies.join(', ')}]`);
      } else {
        this.log.info(`Plugin "${pluginName}" is disabled.`);
      }
    }

    this.log.debug(`Discovered ${pluginEnableStatuses.size} plugins.`);
  }

  shouldEnablePlugin(pluginName, pluginEnableStatuses, parents = []) {
    const pluginInfo = pluginEnableStatuses.get(pluginName);

    if (pluginInfo === undefined || !pluginInfo.isEnabled) {
      return {
        enabled: false,
        missingDependencies: []
      };
    }

    const missingDependencies = pluginInfo.plugin.requiredPlugins.filter(dep => !parents.includes(dep)).filter(dependencyName => !this.shouldEnablePlugin(dependencyName, pluginEnableStatuses, [...parents, pluginName]).enabled);

    if (missingDependencies.length === 0) {
      return {
        enabled: true
      };
    }

    return {
      enabled: false,
      missingDependencies
    };
  }

  registerPluginStaticDirs(deps) {
    for (const [pluginName, pluginInfo] of this.uiPluginInternalInfo) {
      deps.http.registerStaticDir(`/plugins/${pluginName}/assets/{path*}`, pluginInfo.publicAssetsDir);
    }
  }

}

exports.PluginsService = PluginsService;