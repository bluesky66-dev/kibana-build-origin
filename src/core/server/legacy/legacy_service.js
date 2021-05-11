"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LegacyService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _config = require("../../../legacy/server/config");

var _csp = require("../csp");

var _dev = require("../dev");

var _http = require("../http");

var _external_url = require("../external_url");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function getLegacyRawConfig(config, pathConfig) {
  const rawConfig = config.toRaw(); // Elasticsearch config is solely handled by the core and legacy platform
  // shouldn't have direct access to it.

  if (rawConfig.elasticsearch !== undefined) {
    delete rawConfig.elasticsearch;
  }

  return { ...rawConfig,
    // We rely heavily in the default value of 'path.data' in the legacy world and,
    // since it has been moved to NP, it won't show up in RawConfig.
    path: pathConfig
  };
}
/** @internal */


/** @internal */
class LegacyService {
  /** Symbol to represent the legacy platform as a fake "plugin". Used by the ContextService */
  constructor(coreContext) {
    this.coreContext = coreContext;

    _defineProperty(this, "legacyId", Symbol());

    _defineProperty(this, "log", void 0);

    _defineProperty(this, "devConfig$", void 0);

    _defineProperty(this, "httpConfig$", void 0);

    _defineProperty(this, "kbnServer", void 0);

    _defineProperty(this, "configSubscription", void 0);

    _defineProperty(this, "setupDeps", void 0);

    _defineProperty(this, "update$", void 0);

    _defineProperty(this, "legacyRawConfig", void 0);

    _defineProperty(this, "settings", void 0);

    const {
      logger,
      configService
    } = coreContext;
    this.log = logger.get('legacy-service');
    this.devConfig$ = configService.atPath(_dev.config.path).pipe((0, _operators.map)(rawConfig => new _dev.DevConfig(rawConfig)));
    this.httpConfig$ = (0, _rxjs.combineLatest)(configService.atPath(_http.config.path), configService.atPath(_csp.config.path), configService.atPath(_external_url.config.path)).pipe((0, _operators.map)(([http, csp, externalUrl]) => new _http.HttpConfig(http, csp, externalUrl)));
  }

  async setupLegacyConfig() {
    this.update$ = (0, _rxjs.combineLatest)([this.coreContext.configService.getConfig$(), this.coreContext.configService.atPath('path')]).pipe((0, _operators.tap)(([config, pathConfig]) => {
      if (this.kbnServer !== undefined) {
        this.kbnServer.applyLoggingConfiguration(getLegacyRawConfig(config, pathConfig));
      }
    }), (0, _operators.tap)({
      error: err => this.log.error(err)
    }), (0, _operators.publishReplay)(1));
    this.configSubscription = this.update$.connect();
    this.settings = await this.update$.pipe((0, _operators.first)(), (0, _operators.map)(([config, pathConfig]) => getLegacyRawConfig(config, pathConfig))).toPromise();
    this.legacyRawConfig = _config.Config.withDefaultSchema(this.settings);
    return {
      settings: this.settings,
      legacyConfig: this.legacyRawConfig
    };
  }

  async setup(setupDeps) {
    this.log.debug('setting up legacy service');

    if (!this.legacyRawConfig) {
      throw new Error('Legacy config not initialized yet. Ensure LegacyService.setupLegacyConfig() is called before LegacyService.setup()');
    } // propagate the instance uuid to the legacy config, as it was the legacy way to access it.


    this.legacyRawConfig.set('server.uuid', setupDeps.core.environment.instanceUuid);
    this.setupDeps = setupDeps;
  }

  async start(startDeps) {
    const {
      setupDeps
    } = this;

    if (!setupDeps || !this.legacyRawConfig) {
      throw new Error('Legacy service is not setup yet.');
    }

    this.log.debug('starting legacy service'); // Receive initial config and create kbnServer/ClusterManager.

    if (this.coreContext.env.isDevCliParent) {
      await this.setupCliDevMode(this.legacyRawConfig);
    } else {
      this.kbnServer = await this.createKbnServer(this.settings, this.legacyRawConfig, setupDeps, startDeps);
    }
  }

  async stop() {
    this.log.debug('stopping legacy service');

    if (this.configSubscription !== undefined) {
      this.configSubscription.unsubscribe();
      this.configSubscription = undefined;
    }

    if (this.kbnServer !== undefined) {
      await this.kbnServer.close();
      this.kbnServer = undefined;
    }
  }

  async setupCliDevMode(config) {
    const basePathProxy$ = this.coreContext.env.cliArgs.basePath ? (0, _rxjs.combineLatest)([this.devConfig$, this.httpConfig$]).pipe((0, _operators.first)(), (0, _operators.map)(([dev, http]) => new _http.BasePathProxyServer(this.coreContext.logger.get('server'), http, dev))) : _rxjs.EMPTY; // eslint-disable-next-line @typescript-eslint/no-var-requires

    const {
      CliDevMode
    } = require('./cli_dev_mode');

    CliDevMode.fromCoreServices(this.coreContext.env.cliArgs, config, await basePathProxy$.toPromise());
  }

  async createKbnServer(settings, config, setupDeps, startDeps) {
    const coreStart = {
      capabilities: startDeps.core.capabilities,
      elasticsearch: startDeps.core.elasticsearch,
      http: {
        auth: startDeps.core.http.auth,
        basePath: startDeps.core.http.basePath,
        getServerInfo: startDeps.core.http.getServerInfo
      },
      savedObjects: {
        getScopedClient: startDeps.core.savedObjects.getScopedClient,
        createScopedRepository: startDeps.core.savedObjects.createScopedRepository,
        createInternalRepository: startDeps.core.savedObjects.createInternalRepository,
        createSerializer: startDeps.core.savedObjects.createSerializer,
        createExporter: startDeps.core.savedObjects.createExporter,
        createImporter: startDeps.core.savedObjects.createImporter,
        getTypeRegistry: startDeps.core.savedObjects.getTypeRegistry
      },
      metrics: {
        collectionInterval: startDeps.core.metrics.collectionInterval,
        getOpsMetrics$: startDeps.core.metrics.getOpsMetrics$
      },
      uiSettings: {
        asScopedToClient: startDeps.core.uiSettings.asScopedToClient
      },
      coreUsageData: {
        getCoreUsageData: () => {
          throw new Error('core.start.coreUsageData.getCoreUsageData is unsupported in legacy');
        }
      }
    };
    const router = setupDeps.core.http.createRouter('', this.legacyId);
    const coreSetup = {
      capabilities: setupDeps.core.capabilities,
      context: setupDeps.core.context,
      elasticsearch: {
        legacy: setupDeps.core.elasticsearch.legacy
      },
      http: {
        createCookieSessionStorageFactory: setupDeps.core.http.createCookieSessionStorageFactory,
        registerRouteHandlerContext: (contextName, provider) => setupDeps.core.http.registerRouteHandlerContext(this.legacyId, contextName, provider),
        createRouter: () => router,
        resources: setupDeps.core.httpResources.createRegistrar(router),
        registerOnPreRouting: setupDeps.core.http.registerOnPreRouting,
        registerOnPreAuth: setupDeps.core.http.registerOnPreAuth,
        registerAuth: setupDeps.core.http.registerAuth,
        registerOnPostAuth: setupDeps.core.http.registerOnPostAuth,
        registerOnPreResponse: setupDeps.core.http.registerOnPreResponse,
        basePath: setupDeps.core.http.basePath,
        auth: {
          get: setupDeps.core.http.auth.get,
          isAuthenticated: setupDeps.core.http.auth.isAuthenticated
        },
        csp: setupDeps.core.http.csp,
        getServerInfo: setupDeps.core.http.getServerInfo
      },
      i18n: setupDeps.core.i18n,
      logging: {
        configure: config$ => setupDeps.core.logging.configure([], config$)
      },
      metrics: {
        collectionInterval: setupDeps.core.metrics.collectionInterval,
        getOpsMetrics$: setupDeps.core.metrics.getOpsMetrics$
      },
      savedObjects: {
        setClientFactoryProvider: setupDeps.core.savedObjects.setClientFactoryProvider,
        addClientWrapper: setupDeps.core.savedObjects.addClientWrapper,
        registerType: setupDeps.core.savedObjects.registerType
      },
      status: {
        isStatusPageAnonymous: setupDeps.core.status.isStatusPageAnonymous,
        core$: setupDeps.core.status.core$,
        overall$: setupDeps.core.status.overall$,
        set: () => {
          throw new Error(`core.status.set is unsupported in legacy`);
        },

        // @ts-expect-error
        get dependencies$() {
          throw new Error(`core.status.dependencies$ is unsupported in legacy`);
        },

        // @ts-expect-error
        get derivedStatus$() {
          throw new Error(`core.status.derivedStatus$ is unsupported in legacy`);
        }

      },
      uiSettings: {
        register: setupDeps.core.uiSettings.register
      },
      getStartServices: () => Promise.resolve([coreStart, startDeps.plugins, {}])
    }; // eslint-disable-next-line @typescript-eslint/no-var-requires

    const KbnServer = require('../../../legacy/server/kbn_server');

    const kbnServer = new KbnServer(settings, config, {
      env: {
        mode: this.coreContext.env.mode,
        packageInfo: this.coreContext.env.packageInfo
      },
      setupDeps: {
        core: coreSetup,
        plugins: setupDeps.plugins
      },
      startDeps: {
        core: coreStart,
        plugins: startDeps.plugins
      },
      __internals: {
        hapiServer: setupDeps.core.http.server,
        uiPlugins: setupDeps.uiPlugins,
        rendering: setupDeps.core.rendering
      },
      logger: this.coreContext.logger
    });
    const {
      autoListen
    } = await this.httpConfig$.pipe((0, _operators.first)()).toPromise();

    if (autoListen) {
      try {
        await kbnServer.listen();
      } catch (err) {
        await kbnServer.close();
        throw err;
      }
    } else {
      await kbnServer.ready();
    }

    return kbnServer;
  }

}

exports.LegacyService = LegacyService;