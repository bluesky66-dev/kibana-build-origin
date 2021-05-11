"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SecurityPlugin = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _authentication = require("./authentication");

var _authorization = require("./authorization");

var _anonymous_access = require("./anonymous_access");

var _config = require("./config");

var _routes = require("./routes");

var _licensing = require("../common/licensing");

var _saved_objects = require("./saved_objects");

var _audit = require("./audit");

var _feature_usage = require("./feature_usage");

var _features = require("./features");

var _elasticsearch = require("./elasticsearch");

var _session_management = require("./session_management");

var _usage_collector = require("./usage_collector");

var _spaces = require("./spaces");

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
/**
 * Represents Security Plugin instance that will be managed by the Kibana plugin system.
 */


class SecurityPlugin {
  constructor(initializerContext) {
    this.initializerContext = initializerContext;

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "authorizationSetup", void 0);

    _defineProperty(this, "auditSetup", void 0);

    _defineProperty(this, "anonymousAccessStart", void 0);

    _defineProperty(this, "configSubscription", void 0);

    _defineProperty(this, "config", void 0);

    _defineProperty(this, "getConfig", () => {
      if (!this.config) {
        throw new Error('Config is not available.');
      }

      return this.config;
    });

    _defineProperty(this, "session", void 0);

    _defineProperty(this, "getSession", () => {
      if (!this.session) {
        throw new Error('Session is not available.');
      }

      return this.session;
    });

    _defineProperty(this, "kibanaIndexName", void 0);

    _defineProperty(this, "getKibanaIndexName", () => {
      if (!this.kibanaIndexName) {
        throw new Error('Kibana index name is not available.');
      }

      return this.kibanaIndexName;
    });

    _defineProperty(this, "authenticationService", new _authentication.AuthenticationService(this.initializerContext.logger.get('authentication')));

    _defineProperty(this, "authenticationStart", void 0);

    _defineProperty(this, "getAuthentication", () => {
      if (!this.authenticationStart) {
        throw new Error(`authenticationStart is not registered!`);
      }

      return this.authenticationStart;
    });

    _defineProperty(this, "featureUsageService", new _feature_usage.SecurityFeatureUsageService());

    _defineProperty(this, "featureUsageServiceStart", void 0);

    _defineProperty(this, "getFeatureUsageService", () => {
      if (!this.featureUsageServiceStart) {
        throw new Error(`featureUsageServiceStart is not registered!`);
      }

      return this.featureUsageServiceStart;
    });

    _defineProperty(this, "auditService", new _audit.AuditService(this.initializerContext.logger.get('audit')));

    _defineProperty(this, "securityLicenseService", new _licensing.SecurityLicenseService());

    _defineProperty(this, "authorizationService", new _authorization.AuthorizationService());

    _defineProperty(this, "elasticsearchService", new _elasticsearch.ElasticsearchService(this.initializerContext.logger.get('elasticsearch')));

    _defineProperty(this, "sessionManagementService", new _session_management.SessionManagementService(this.initializerContext.logger.get('session')));

    _defineProperty(this, "anonymousAccessService", new _anonymous_access.AnonymousAccessService(this.initializerContext.logger.get('anonymous-access'), this.getConfig));

    this.logger = this.initializerContext.logger.get();
  }

  setup(core, {
    features,
    licensing,
    taskManager,
    usageCollection,
    securityOss,
    spaces
  }) {
    this.configSubscription = (0, _rxjs.combineLatest)([this.initializerContext.config.create().pipe((0, _operators.map)(rawConfig => (0, _config.createConfig)(rawConfig, this.initializerContext.logger.get('config'), {
      isTLSEnabled: core.http.getServerInfo().protocol === 'https'
    }))), this.initializerContext.config.legacy.globalConfig$]).subscribe(([config, {
      kibana
    }]) => {
      this.config = config;
      this.kibanaIndexName = kibana.index;
    });
    const config = this.getConfig();
    const kibanaIndexName = this.getKibanaIndexName(); // A subset of `start` services we need during `setup`.

    const startServicesPromise = core.getStartServices().then(([coreServices, depsServices]) => ({
      elasticsearch: coreServices.elasticsearch,
      features: depsServices.features
    }));
    const {
      license
    } = this.securityLicenseService.setup({
      license$: licensing.license$
    });

    if (securityOss) {
      license.features$.subscribe(({
        allowRbac
      }) => {
        const showInsecureClusterWarning = !allowRbac;
        securityOss.showInsecureClusterWarning$.next(showInsecureClusterWarning);
      });
      securityOss.setAnonymousAccessServiceProvider(() => {
        if (!this.anonymousAccessStart) {
          throw new Error('AnonymousAccess service is not started!');
        }

        return this.anonymousAccessStart;
      });
    }

    _features.securityFeatures.forEach(securityFeature => features.registerElasticsearchFeature(securityFeature));

    this.elasticsearchService.setup({
      license,
      status: core.status
    });
    this.featureUsageService.setup({
      featureUsage: licensing.featureUsage
    });
    this.sessionManagementService.setup({
      config,
      http: core.http,
      taskManager
    });
    this.authenticationService.setup({
      http: core.http,
      license
    });
    (0, _usage_collector.registerSecurityUsageCollector)({
      usageCollection,
      config,
      license
    });
    this.auditSetup = this.auditService.setup({
      license,
      config: config.audit,
      logging: core.logging,
      http: core.http,
      getSpaceId: request => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService.getSpaceId(request),
      getSID: request => this.getSession().getSID(request),
      getCurrentUser: request => this.getAuthentication().getCurrentUser(request),
      recordAuditLoggingUsage: () => this.getFeatureUsageService().recordAuditLoggingUsage()
    });
    this.anonymousAccessService.setup();
    this.authorizationSetup = this.authorizationService.setup({
      http: core.http,
      capabilities: core.capabilities,
      getClusterClient: () => startServicesPromise.then(({
        elasticsearch
      }) => elasticsearch.client),
      license,
      loggers: this.initializerContext.logger,
      kibanaIndexName,
      packageVersion: this.initializerContext.env.packageInfo.version,
      buildNumber: this.initializerContext.env.packageInfo.buildNum,
      getSpacesService: () => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService,
      features,
      getCurrentUser: request => this.getAuthentication().getCurrentUser(request)
    });
    (0, _spaces.setupSpacesClient)({
      spaces,
      audit: this.auditSetup,
      authz: this.authorizationSetup
    });
    (0, _saved_objects.setupSavedObjects)({
      legacyAuditLogger: new _audit.SecurityAuditLogger(this.auditSetup.getLogger()),
      audit: this.auditSetup,
      authz: this.authorizationSetup,
      savedObjects: core.savedObjects,
      getSpacesService: () => spaces === null || spaces === void 0 ? void 0 : spaces.spacesService
    });
    (0, _routes.defineRoutes)({
      router: core.http.createRouter(),
      basePath: core.http.basePath,
      httpResources: core.http.resources,
      logger: this.initializerContext.logger.get('routes'),
      config,
      authz: this.authorizationSetup,
      license,
      getSession: this.getSession,
      getFeatures: () => startServicesPromise.then(services => services.features.getKibanaFeatures()),
      getFeatureUsageService: this.getFeatureUsageService,
      getAuthenticationService: this.getAuthentication
    });
    return Object.freeze({
      audit: {
        asScoped: this.auditSetup.asScoped,
        getLogger: this.auditSetup.getLogger
      },
      authc: {
        getCurrentUser: request => this.getAuthentication().getCurrentUser(request)
      },
      authz: {
        actions: this.authorizationSetup.actions,
        checkPrivilegesWithRequest: this.authorizationSetup.checkPrivilegesWithRequest,
        checkPrivilegesDynamicallyWithRequest: this.authorizationSetup.checkPrivilegesDynamicallyWithRequest,
        mode: this.authorizationSetup.mode
      },
      license
    });
  }

  start(core, {
    features,
    licensing,
    taskManager,
    spaces
  }) {
    this.logger.debug('Starting plugin');
    this.featureUsageServiceStart = this.featureUsageService.start({
      featureUsage: licensing.featureUsage
    });
    const clusterClient = core.elasticsearch.client;
    const {
      watchOnlineStatus$
    } = this.elasticsearchService.start();
    const {
      session
    } = this.sessionManagementService.start({
      elasticsearchClient: clusterClient.asInternalUser,
      kibanaIndexName: this.getKibanaIndexName(),
      online$: watchOnlineStatus$(),
      taskManager
    });
    this.session = session;
    const config = this.getConfig();
    this.authenticationStart = this.authenticationService.start({
      audit: this.auditSetup,
      clusterClient,
      config,
      featureUsageService: this.featureUsageServiceStart,
      http: core.http,
      legacyAuditLogger: new _audit.SecurityAuditLogger(this.auditSetup.getLogger()),
      loggers: this.initializerContext.logger,
      session
    });
    this.authorizationService.start({
      features,
      clusterClient,
      online$: watchOnlineStatus$()
    });
    this.anonymousAccessStart = this.anonymousAccessService.start({
      capabilities: core.capabilities,
      clusterClient,
      basePath: core.http.basePath,
      spaces: spaces === null || spaces === void 0 ? void 0 : spaces.spacesService
    });
    return Object.freeze({
      authc: {
        apiKeys: this.authenticationStart.apiKeys,
        getCurrentUser: this.authenticationStart.getCurrentUser
      },
      authz: {
        actions: this.authorizationSetup.actions,
        checkPrivilegesWithRequest: this.authorizationSetup.checkPrivilegesWithRequest,
        checkPrivilegesDynamicallyWithRequest: this.authorizationSetup.checkPrivilegesDynamicallyWithRequest,
        mode: this.authorizationSetup.mode
      }
    });
  }

  stop() {
    this.logger.debug('Stopping plugin');

    if (this.configSubscription) {
      this.configSubscription.unsubscribe();
      this.configSubscription = undefined;
    }

    if (this.featureUsageServiceStart) {
      this.featureUsageServiceStart = undefined;
    }

    if (this.authenticationStart) {
      this.authenticationStart = undefined;
    }

    if (this.anonymousAccessStart) {
      this.anonymousAccessStart = undefined;
    }

    this.securityLicenseService.stop();
    this.auditService.stop();
    this.authorizationService.stop();
    this.sessionManagementService.stop();
  }

}

exports.SecurityPlugin = SecurityPlugin;