"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReportingCore = void 0;

var Rx = _interopRequireWildcard(require("rxjs"));

var _operators = require("rxjs/operators");

var _server = require("../../../../src/core/server");

var _constants = require("../../spaces/common/constants");

var _lib = require("./lib");

var _screenshots = require("./lib/screenshots");

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

class ReportingCore {
  // observe async background setupDeps and config each are done
  // observe async background startDeps
  constructor(logger) {
    this.logger = logger;

    _defineProperty(this, "pluginSetupDeps", void 0);

    _defineProperty(this, "pluginStartDeps", void 0);

    _defineProperty(this, "pluginSetup$", new Rx.ReplaySubject());

    _defineProperty(this, "pluginStart$", new Rx.ReplaySubject());

    _defineProperty(this, "exportTypesRegistry", (0, _lib.getExportTypesRegistry)());

    _defineProperty(this, "config", void 0);
  }
  /*
   * Register setupDeps
   */


  pluginSetup(setupDeps) {
    this.pluginSetup$.next(true); // trigger the observer

    this.pluginSetupDeps = setupDeps; // cache
  }
  /*
   * Register startDeps
   */


  pluginStart(startDeps) {
    this.pluginStart$.next(startDeps); // trigger the observer

    this.pluginStartDeps = startDeps; // cache
  }
  /*
   * Blocks the caller until setup is done
   */


  async pluginSetsUp() {
    // use deps and config as a cached resolver
    if (this.pluginSetupDeps && this.config) {
      return true;
    }

    return await this.pluginSetup$.pipe((0, _operators.take)(2)).toPromise(); // once for pluginSetupDeps (sync) and twice for config (async)
  }
  /*
   * Blocks the caller until start is done
   */


  async pluginStartsUp() {
    return await this.getPluginStartDeps().then(() => true);
  }
  /*
   * Synchronously checks if all async background setup and startup is completed
   */


  pluginIsStarted() {
    return this.pluginSetupDeps != null && this.config != null && this.pluginStartDeps != null;
  }
  /*
   * Allows config to be set in the background
   */


  setConfig(config) {
    this.config = config;
    this.pluginSetup$.next(true);
  }
  /**
   * Registers reporting as an Elasticsearch feature for the purpose of toggling visibility based on roles.
   */


  registerFeature() {
    var _config$get$allow, _config$get;

    const config = this.getConfig();
    const allowedRoles = ['superuser', ...((_config$get$allow = (_config$get = config.get('roles')) === null || _config$get === void 0 ? void 0 : _config$get.allow) !== null && _config$get$allow !== void 0 ? _config$get$allow : [])];
    this.getPluginSetupDeps().features.registerElasticsearchFeature({
      id: 'reporting',
      catalogue: ['reporting'],
      management: {
        insightsAndAlerting: ['reporting']
      },
      privileges: allowedRoles.map(role => ({
        requiredClusterPrivileges: [],
        requiredRoles: [role],
        ui: []
      }))
    });
  }
  /*
   * Gives synchronous access to the config
   */


  getConfig() {
    if (!this.config) {
      throw new Error('Config is not yet initialized');
    }

    return this.config;
  }
  /*
   * Gives async access to the startDeps
   */


  async getPluginStartDeps() {
    if (this.pluginStartDeps) {
      return this.pluginStartDeps;
    }

    return await this.pluginStart$.pipe((0, _operators.first)()).toPromise();
  }

  getExportTypesRegistry() {
    return this.exportTypesRegistry;
  }

  async getEsqueue() {
    return (await this.getPluginStartDeps()).esqueue;
  }

  async getLicenseInfo() {
    const {
      licensing
    } = this.getPluginSetupDeps();
    return await licensing.license$.pipe((0, _operators.map)(license => (0, _lib.checkLicense)(this.getExportTypesRegistry(), license)), (0, _operators.first)()).toPromise();
  }

  async getScreenshotsObservable() {
    const config = this.getConfig();
    const {
      browserDriverFactory
    } = await this.getPluginStartDeps();
    return (0, _screenshots.screenshotsObservableFactory)(config.get('capture'), browserDriverFactory);
  }
  /*
   * Gives synchronous access to the setupDeps
   */


  getPluginSetupDeps() {
    if (!this.pluginSetupDeps) {
      throw new Error(`"pluginSetupDeps" dependencies haven't initialized yet`);
    }

    return this.pluginSetupDeps;
  }

  getElasticsearchService() {
    return this.getPluginSetupDeps().elasticsearch;
  }

  async getSavedObjectsClient(request) {
    const {
      savedObjects
    } = await this.getPluginStartDeps();
    return savedObjects.getScopedClient(request);
  }

  async getUiSettingsServiceFactory(savedObjectsClient) {
    const {
      uiSettings: uiSettingsService
    } = await this.getPluginStartDeps();
    const scopedUiSettingsService = uiSettingsService.asScopedToClient(savedObjectsClient);
    return scopedUiSettingsService;
  }

  getSpaceId(request, logger = this.logger) {
    var _this$getPluginSetupD;

    const spacesService = (_this$getPluginSetupD = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD === void 0 ? void 0 : _this$getPluginSetupD.spacesService;

    if (spacesService) {
      const spaceId = spacesService === null || spacesService === void 0 ? void 0 : spacesService.getSpaceId(request);

      if (spaceId !== _constants.DEFAULT_SPACE_ID) {
        logger.info(`Request uses Space ID: ${spaceId}`);
        return spaceId;
      } else {
        logger.debug(`Request uses default Space`);
      }
    }
  }

  getFakeRequest(baseRequest, spaceId, logger = this.logger) {
    var _this$getPluginSetupD2;

    const fakeRequest = _server.KibanaRequest.from({
      path: '/',
      route: {
        settings: {}
      },
      url: {
        href: '/'
      },
      raw: {
        req: {
          url: '/'
        }
      },
      ...baseRequest
    });

    const spacesService = (_this$getPluginSetupD2 = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD2 === void 0 ? void 0 : _this$getPluginSetupD2.spacesService;

    if (spacesService) {
      if (spaceId && spaceId !== _constants.DEFAULT_SPACE_ID) {
        logger.info(`Generating request for space: ${spaceId}`);
        this.getPluginSetupDeps().basePath.set(fakeRequest, `/s/${spaceId}`);
      }
    }

    return fakeRequest;
  }

  async getUiSettingsClient(request, logger = this.logger) {
    var _this$getPluginSetupD3;

    const spacesService = (_this$getPluginSetupD3 = this.getPluginSetupDeps().spaces) === null || _this$getPluginSetupD3 === void 0 ? void 0 : _this$getPluginSetupD3.spacesService;
    const spaceId = this.getSpaceId(request, logger);

    if (spacesService && spaceId) {
      logger.info(`Creating UI Settings Client for space: ${spaceId}`);
    }

    const savedObjectsClient = await this.getSavedObjectsClient(request);
    return await this.getUiSettingsServiceFactory(savedObjectsClient);
  }

}

exports.ReportingCore = ReportingCore;