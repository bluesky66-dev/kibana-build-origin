"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Server = void 0;

var _elasticApmNode = _interopRequireDefault(require("elastic-apm-node"));

var _utils = require("@kbn/utils");

var _std = require("@kbn/std");

var _config = require("./config");

var _core_app = require("./core_app");

var _i18n = require("./i18n");

var _elasticsearch = require("./elasticsearch");

var _http = require("./http");

var _http_resources = require("./http_resources");

var _rendering = require("./rendering");

var _legacy = require("./legacy");

var _logging = require("./logging");

var _ui_settings = require("./ui_settings");

var _plugins = require("./plugins");

var _saved_objects = require("./saved_objects");

var _metrics = require("./metrics");

var _capabilities = require("./capabilities");

var _environment = require("./environment");

var _status_service = require("./status/status_service");

var _csp = require("./csp");

var _dev = require("./dev");

var _kibana_config = require("./kibana_config");

var _status = require("./status");

var _context = require("./context");

var _core_usage_data = require("./core_usage_data");

var _core_route_handler_context = require("./core_route_handler_context");

var _external_url = require("./external_url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to set private field on non-instance"); } if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } return value; }

const coreId = Symbol('core');
const rootConfigPath = '';

var _pluginsInitialized = new WeakMap();

class Server {
  constructor(rawConfigProvider, env, loggingSystem) {
    this.env = env;
    this.loggingSystem = loggingSystem;

    _defineProperty(this, "configService", void 0);

    _defineProperty(this, "capabilities", void 0);

    _defineProperty(this, "context", void 0);

    _defineProperty(this, "elasticsearch", void 0);

    _defineProperty(this, "http", void 0);

    _defineProperty(this, "rendering", void 0);

    _defineProperty(this, "legacy", void 0);

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "plugins", void 0);

    _defineProperty(this, "savedObjects", void 0);

    _defineProperty(this, "uiSettings", void 0);

    _defineProperty(this, "environment", void 0);

    _defineProperty(this, "metrics", void 0);

    _defineProperty(this, "httpResources", void 0);

    _defineProperty(this, "status", void 0);

    _defineProperty(this, "logging", void 0);

    _defineProperty(this, "coreApp", void 0);

    _defineProperty(this, "coreUsageData", void 0);

    _defineProperty(this, "i18n", void 0);

    _defineProperty(this, "savedObjectsStartPromise", void 0);

    _defineProperty(this, "resolveSavedObjectsStartPromise", void 0);

    _pluginsInitialized.set(this, {
      writable: true,
      value: void 0
    });

    _defineProperty(this, "coreStart", void 0);

    _defineProperty(this, "logger", void 0);

    this.logger = this.loggingSystem.asLoggerFactory();
    this.log = this.logger.get('server');
    this.configService = new _config.ConfigService(rawConfigProvider, env, this.logger);
    const core = {
      coreId,
      configService: this.configService,
      env,
      logger: this.logger
    };
    this.context = new _context.ContextService(core);
    this.http = new _http.HttpService(core);
    this.rendering = new _rendering.RenderingService(core);
    this.plugins = new _plugins.PluginsService(core);
    this.legacy = new _legacy.LegacyService(core);
    this.elasticsearch = new _elasticsearch.ElasticsearchService(core);
    this.savedObjects = new _saved_objects.SavedObjectsService(core);
    this.uiSettings = new _ui_settings.UiSettingsService(core);
    this.capabilities = new _capabilities.CapabilitiesService(core);
    this.environment = new _environment.EnvironmentService(core);
    this.metrics = new _metrics.MetricsService(core);
    this.status = new _status_service.StatusService(core);
    this.coreApp = new _core_app.CoreApp(core);
    this.httpResources = new _http_resources.HttpResourcesService(core);
    this.logging = new _logging.LoggingService(core);
    this.coreUsageData = new _core_usage_data.CoreUsageDataService(core);
    this.i18n = new _i18n.I18nService(core);
    this.savedObjectsStartPromise = new Promise(resolve => {
      this.resolveSavedObjectsStartPromise = resolve;
    });
  }

  async setup() {
    this.log.debug('setting up server');

    const setupTransaction = _elasticApmNode.default.startTransaction('server_setup', 'kibana_platform');

    const environmentSetup = await this.environment.setup(); // Discover any plugins before continuing. This allows other systems to utilize the plugin dependency graph.

    const {
      pluginTree,
      pluginPaths,
      uiPlugins
    } = await this.plugins.discover({
      environment: environmentSetup
    });
    const legacyConfigSetup = await this.legacy.setupLegacyConfig(); // rely on dev server to validate config, don't validate in the parent process

    if (!this.env.isDevCliParent) {
      // Immediately terminate in case of invalid configuration
      // This needs to be done after plugin discovery
      await this.configService.validate();
      await (0, _legacy.ensureValidConfiguration)(this.configService, legacyConfigSetup);
    }

    const contextServiceSetup = this.context.setup({
      // We inject a fake "legacy plugin" with dependencies on every plugin so that legacy plugins:
      // 1) Can access context from any KP plugin
      // 2) Can register context providers that will only be available to other legacy plugins and will not leak into
      //    New Platform plugins.
      pluginDependencies: new Map([...pluginTree.asOpaqueIds, [this.legacy.legacyId, [...pluginTree.asOpaqueIds.keys()]]])
    });
    const httpSetup = await this.http.setup({
      context: contextServiceSetup
    }); // setup i18n prior to any other service, to have translations ready

    const i18nServiceSetup = await this.i18n.setup({
      http: httpSetup,
      pluginPaths
    });
    const capabilitiesSetup = this.capabilities.setup({
      http: httpSetup
    });
    const elasticsearchServiceSetup = await this.elasticsearch.setup({
      http: httpSetup
    });
    const metricsSetup = await this.metrics.setup({
      http: httpSetup
    });
    const coreUsageDataSetup = this.coreUsageData.setup({
      http: httpSetup,
      metrics: metricsSetup,
      savedObjectsStartPromise: this.savedObjectsStartPromise
    });
    const savedObjectsSetup = await this.savedObjects.setup({
      http: httpSetup,
      elasticsearch: elasticsearchServiceSetup,
      coreUsageData: coreUsageDataSetup
    });
    const uiSettingsSetup = await this.uiSettings.setup({
      http: httpSetup,
      savedObjects: savedObjectsSetup
    });
    const statusSetup = await this.status.setup({
      elasticsearch: elasticsearchServiceSetup,
      pluginDependencies: pluginTree.asNames,
      savedObjects: savedObjectsSetup,
      environment: environmentSetup,
      http: httpSetup,
      metrics: metricsSetup
    });
    const renderingSetup = await this.rendering.setup({
      http: httpSetup,
      status: statusSetup,
      uiPlugins
    });
    const httpResourcesSetup = this.httpResources.setup({
      http: httpSetup,
      rendering: renderingSetup
    });
    const loggingSetup = this.logging.setup({
      loggingSystem: this.loggingSystem
    });
    const coreSetup = {
      capabilities: capabilitiesSetup,
      context: contextServiceSetup,
      elasticsearch: elasticsearchServiceSetup,
      environment: environmentSetup,
      http: httpSetup,
      i18n: i18nServiceSetup,
      savedObjects: savedObjectsSetup,
      status: statusSetup,
      uiSettings: uiSettingsSetup,
      rendering: renderingSetup,
      httpResources: httpResourcesSetup,
      logging: loggingSetup,
      metrics: metricsSetup
    };
    const pluginsSetup = await this.plugins.setup(coreSetup);

    _classPrivateFieldSet(this, _pluginsInitialized, pluginsSetup.initialized);

    await this.legacy.setup({
      core: { ...coreSetup,
        plugins: pluginsSetup,
        rendering: renderingSetup
      },
      plugins: (0, _std.mapToObject)(pluginsSetup.contracts),
      uiPlugins
    });
    this.registerCoreContext(coreSetup);
    this.coreApp.setup(coreSetup);
    setupTransaction === null || setupTransaction === void 0 ? void 0 : setupTransaction.end();
    return coreSetup;
  }

  async start() {
    this.log.debug('starting server');

    const startTransaction = _elasticApmNode.default.startTransaction('server_start', 'kibana_platform');

    const elasticsearchStart = await this.elasticsearch.start();
    const soStartSpan = startTransaction === null || startTransaction === void 0 ? void 0 : startTransaction.startSpan('saved_objects.migration', 'migration');
    const savedObjectsStart = await this.savedObjects.start({
      elasticsearch: elasticsearchStart,
      pluginsInitialized: _classPrivateFieldGet(this, _pluginsInitialized)
    });
    await this.resolveSavedObjectsStartPromise(savedObjectsStart);
    soStartSpan === null || soStartSpan === void 0 ? void 0 : soStartSpan.end();
    const capabilitiesStart = this.capabilities.start();
    const uiSettingsStart = await this.uiSettings.start();
    const metricsStart = await this.metrics.start();
    const httpStart = this.http.getStartContract();
    const coreUsageDataStart = this.coreUsageData.start({
      elasticsearch: elasticsearchStart,
      savedObjects: savedObjectsStart
    });
    this.coreStart = {
      capabilities: capabilitiesStart,
      elasticsearch: elasticsearchStart,
      http: httpStart,
      metrics: metricsStart,
      savedObjects: savedObjectsStart,
      uiSettings: uiSettingsStart,
      coreUsageData: coreUsageDataStart
    };
    const pluginsStart = await this.plugins.start(this.coreStart);
    await this.legacy.start({
      core: { ...this.coreStart,
        plugins: pluginsStart
      },
      plugins: (0, _std.mapToObject)(pluginsStart.contracts)
    });
    await this.http.start();
    startTransaction === null || startTransaction === void 0 ? void 0 : startTransaction.end();
    return this.coreStart;
  }

  async stop() {
    this.log.debug('stopping server');
    await this.legacy.stop();
    await this.plugins.stop();
    await this.savedObjects.stop();
    await this.elasticsearch.stop();
    await this.http.stop();
    await this.uiSettings.stop();
    await this.rendering.stop();
    await this.metrics.stop();
    await this.status.stop();
    await this.logging.stop();
  }

  registerCoreContext(coreSetup) {
    coreSetup.http.registerRouteHandlerContext(coreId, 'core', (context, req, res) => {
      return new _core_route_handler_context.CoreRouteHandlerContext(this.coreStart, req);
    });
  }

  setupCoreConfig() {
    const configDescriptors = [_utils.config, _csp.config, _elasticsearch.config, _external_url.config, _logging.config, _http.config, _plugins.config, _dev.config, _kibana_config.config, _saved_objects.savedObjectsConfig, _saved_objects.savedObjectsMigrationConfig, _ui_settings.config, _metrics.opsConfig, _status.config, _environment.config, _i18n.config];
    this.configService.addDeprecationProvider(rootConfigPath, _config.coreDeprecationProvider);

    for (const descriptor of configDescriptors) {
      if (descriptor.deprecations) {
        this.configService.addDeprecationProvider(descriptor.path, descriptor.deprecations);
      }

      this.configService.setSchema(descriptor.path, descriptor.schema);
    }
  }

}

exports.Server = Server;