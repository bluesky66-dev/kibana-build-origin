"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appContextService = void 0;

var _rxjs = require("rxjs");

var _operators = require("rxjs/operators");

var _utils = require("@kbn/utils");

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

class AppContextService {
  constructor() {
    _defineProperty(this, "encryptedSavedObjects", void 0);

    _defineProperty(this, "encryptedSavedObjectsSetup", void 0);

    _defineProperty(this, "esClient", void 0);

    _defineProperty(this, "security", void 0);

    _defineProperty(this, "config$", void 0);

    _defineProperty(this, "configSubject$", void 0);

    _defineProperty(this, "savedObjects", void 0);

    _defineProperty(this, "isProductionMode", false);

    _defineProperty(this, "kibanaVersion", _utils.kibanaPackageJson.version);

    _defineProperty(this, "kibanaBranch", _utils.kibanaPackageJson.branch);

    _defineProperty(this, "cloud", void 0);

    _defineProperty(this, "logger", void 0);

    _defineProperty(this, "httpSetup", void 0);

    _defineProperty(this, "externalCallbacks", new Map());
  }

  async start(appContext) {
    var _appContext$encrypted;

    this.esClient = appContext.elasticsearch.client.asInternalUser;
    this.encryptedSavedObjects = (_appContext$encrypted = appContext.encryptedSavedObjectsStart) === null || _appContext$encrypted === void 0 ? void 0 : _appContext$encrypted.getClient();
    this.encryptedSavedObjectsSetup = appContext.encryptedSavedObjectsSetup;
    this.security = appContext.security;
    this.savedObjects = appContext.savedObjects;
    this.isProductionMode = appContext.isProductionMode;
    this.cloud = appContext.cloud;
    this.logger = appContext.logger;
    this.kibanaVersion = appContext.kibanaVersion;
    this.kibanaBranch = appContext.kibanaBranch;
    this.httpSetup = appContext.httpSetup;

    if (appContext.config$) {
      this.config$ = appContext.config$;
      const initialValue = await this.config$.pipe((0, _operators.first)()).toPromise();
      this.configSubject$ = new _rxjs.BehaviorSubject(initialValue);
      this.config$.subscribe(this.configSubject$);
    }
  }

  stop() {
    this.externalCallbacks.clear();
  }

  getEncryptedSavedObjects() {
    if (!this.encryptedSavedObjects) {
      throw new Error('Encrypted saved object start service not set.');
    }

    return this.encryptedSavedObjects;
  }

  getSecurity() {
    if (!this.security) {
      throw new Error('Security service not set.');
    }

    return this.security;
  }

  hasSecurity() {
    return !!this.security;
  }

  getCloud() {
    return this.cloud;
  }

  getLogger() {
    if (!this.logger) {
      throw new Error('Logger not set.');
    }

    return this.logger;
  }

  getConfig() {
    var _this$configSubject$;

    return (_this$configSubject$ = this.configSubject$) === null || _this$configSubject$ === void 0 ? void 0 : _this$configSubject$.value;
  }

  getConfig$() {
    return this.config$;
  }

  getSavedObjects() {
    if (!this.savedObjects) {
      throw new Error('Saved objects start service not set.');
    }

    return this.savedObjects;
  }

  getInternalUserSOClient(request) {
    // soClient as kibana internal users, be careful on how you use it, security is not enabled
    return appContextService.getSavedObjects().getScopedClient(request, {
      excludedWrappers: ['security']
    });
  }

  getInternalUserESClient() {
    if (!this.esClient) {
      throw new Error('Elasticsearch start service not set.');
    } // soClient as kibana internal users, be careful on how you use it, security is not enabled


    return this.esClient;
  }

  getIsProductionMode() {
    return this.isProductionMode;
  }

  getHttpSetup() {
    if (!this.httpSetup) {
      throw new Error('HttpServiceSetup not set.');
    }

    return this.httpSetup;
  }

  getEncryptedSavedObjectsSetup() {
    return this.encryptedSavedObjectsSetup;
  }

  getKibanaVersion() {
    return this.kibanaVersion;
  }

  getKibanaBranch() {
    return this.kibanaBranch;
  }

  addExternalCallback(type, callback) {
    if (!this.externalCallbacks.has(type)) {
      this.externalCallbacks.set(type, new Set());
    }

    this.externalCallbacks.get(type).add(callback);
  }

  getExternalCallbacks(type) {
    if (this.externalCallbacks) {
      return this.externalCallbacks.get(type);
    }
  }

}

const appContextService = new AppContextService();
exports.appContextService = appContextService;